import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import path from "node:path";

function ensureEnvLoaded() {
  if (process.env["CLOUDINARY_API_KEY"] && process.env["DATABASE_URL"]) {
    return;
  }
  if (typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(".env");
    } catch {
      // ignore
    }
  } else {
    try {
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, "utf-8").split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }
}

function parseCloudinaryUrl(url: string) {
  try {
    const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (match && match[1] && match[2] && match[3]) {
      return {
        api_key: match[1].replace(/[<>]/g, "").trim(),
        api_secret: match[2].replace(/[<>]/g, "").trim(),
        cloud_name: match[3].replace(/[<>]/g, "").trim(),
      };
    }
  } catch {
    // ignore
  }
  return null;
}

export function getCloudinaryConfig(): {
  cloud_name: string;
  api_key: string;
  api_secret: string;
  secure: boolean;
} | null {
  ensureEnvLoaded();

  let cloud_name = process.env["CLOUDINARY_CLOUD_NAME"]?.replace(/[<>]/g, "").trim();
  let api_key = process.env["CLOUDINARY_API_KEY"]?.replace(/[<>]/g, "").trim();
  let api_secret = process.env["CLOUDINARY_API_SECRET"]?.replace(/[<>]/g, "").trim();

  if ((!cloud_name || !api_key || !api_secret) && process.env["CLOUDINARY_URL"]) {
    const parsed = parseCloudinaryUrl(process.env["CLOUDINARY_URL"]);
    if (parsed) {
      cloud_name = cloud_name || parsed.cloud_name;
      api_key = api_key || parsed.api_key;
      api_secret = api_secret || parsed.api_secret;
    }
  }

  if (cloud_name && api_key && api_secret) {
    return {
      cloud_name,
      api_key,
      api_secret,
      secure: true,
    };
  }

  return null;
}

export function isCloudinaryConfigured(): boolean {
  return getCloudinaryConfig() !== null;
}

export function configureCloudinary(): boolean {
  const config = getCloudinaryConfig();
  if (!config) return false;
  cloudinary.config(config);
  return true;
}

export async function uploadImageToCloudinary(
  fileDataUriOrBase64: string,
  options?: { folder?: string; publicId?: string },
): Promise<{ success: boolean; url?: string; publicId?: string; error?: string }> {
  const configured = configureCloudinary();
  if (!configured) {
    return {
      success: false,
      error:
        "Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.",
    };
  }

  try {
    const uploadOptions: Record<string, unknown> = {
      folder: options?.folder || "student-work-atlas",
      resource_type: "auto",
      overwrite: true,
    };
    if (options?.publicId) {
      uploadOptions["public_id"] = options.publicId;
    }
    const result = await cloudinary.uploader.upload(fileDataUriOrBase64, uploadOptions as any);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Cloudinary upload failed",
    };
  }
}
