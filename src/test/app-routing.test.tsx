import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";

// Match routes without mounting an SSR runtime; avoid fetching data in jsdom.
describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
  it.each([
    "/",
    "/projects",
    "/projects/pdf-mithura",
    "/events",
    "/events/ieeextreme-20",
    "/creative-works",
    "/certificates",
    "/gallery",
    "/admin",
  ])("matches %s", (path) => {
    const matches = router.matchRoutes(path);
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
