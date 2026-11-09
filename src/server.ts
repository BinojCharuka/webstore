import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { getPortfolioFromDb, savePortfolioToDb, isDbConfigured } from "./server/db";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "./server/cloudinary";
import { isPortfolioContent } from "./data/portfolio";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);

      if (url.pathname === "/api/portfolio") {
        if (request.method === "GET") {
          const content = await getPortfolioFromDb();
          return Response.json({ content, dbConfigured: isDbConfigured() });
        }
        if (request.method === "POST") {
          const body = await request.json();
          if (!isPortfolioContent(body)) {
            return Response.json(
              { success: false, error: "Invalid portfolio structure" },
              { status: 400 },
            );
          }
          const result = await savePortfolioToDb(body);
          return Response.json(result);
        }
      }

      if (url.pathname === "/api/upload" && request.method === "POST") {
        const body = (await request.json()) as { image?: string; folder?: string };
        if (!body.image || typeof body.image !== "string") {
          return Response.json(
            { success: false, error: "Image data (Base64 or Data URI) is required" },
            { status: 400 },
          );
        }
        const result = await uploadImageToCloudinary(
          body.image,
          body.folder ? { folder: body.folder } : undefined,
        );
        return Response.json(result, { status: result.success ? 200 : 400 });
      }

      if (url.pathname === "/api/status" && request.method === "GET") {
        return Response.json({
          dbConfigured: isDbConfigured(),
          cloudinaryConfigured: isCloudinaryConfigured(),
        });
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
