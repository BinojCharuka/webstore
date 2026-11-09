import { useEffect, useState } from "react";
import { defaultPortfolio, isPortfolioContent, type PortfolioContent } from "./portfolio";

const storageKey = "student-work-atlas-content-v1";
const eventKey = "student-work-atlas-updated";

export function loadPortfolio(): PortfolioContent {
  if (typeof window === "undefined") return defaultPortfolio;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return defaultPortfolio;
    const parsed: unknown = JSON.parse(raw);
    if (isPortfolioContent(parsed)) return parsed;
  } catch {
    /* Use defaults when storage is unavailable or invalid. */
  }
  return defaultPortfolio;
}

export function savePortfolio(content: PortfolioContent): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(content));
    window.dispatchEvent(new Event(eventKey));
  }
}

export function resetPortfolio(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(storageKey);
    window.dispatchEvent(new Event(eventKey));
  }
}

export async function syncPortfolioFromRemote(): Promise<PortfolioContent> {
  if (typeof window === "undefined") return defaultPortfolio;
  try {
    const res = await fetch("/api/portfolio");
    if (!res.ok) return loadPortfolio();
    const data = await res.json();
    if (data?.content && isPortfolioContent(data.content)) {
      savePortfolio(data.content);
      return data.content;
    }
  } catch {
    // If offline or during local testing, keep local content
  }
  return loadPortfolio();
}

export async function savePortfolioToRemote(
  content: PortfolioContent,
): Promise<{ success: boolean; error?: string }> {
  // Always update local cache for instant UI response
  savePortfolio(content);

  try {
    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect to database server",
    };
  }
}

export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadImageToCloudinaryStorage(
  file: File,
  folder?: string,
): Promise<{ success: boolean; url?: string; publicId?: string; error?: string }> {
  try {
    const dataUri = await fileToDataUri(file);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: dataUri, folder: folder || "student-work-atlas" }),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Image upload request failed",
    };
  }
}

export async function getBackendStatus(): Promise<{
  dbConfigured: boolean;
  cloudinaryConfigured: boolean;
}> {
  try {
    const res = await fetch("/api/status");
    if (!res.ok) throw new Error("Status check failed");
    return await res.json();
  } catch {
    return { dbConfigured: false, cloudinaryConfigured: false };
  }
}

export function usePortfolio(): PortfolioContent {
  const [content, setContent] = useState<PortfolioContent>(defaultPortfolio);

  useEffect(() => {
    // 1. Load immediately from local cache or default
    const refresh = () => setContent(loadPortfolio());
    refresh();

    window.addEventListener(eventKey, refresh);
    window.addEventListener("storage", refresh);

    // 2. Fetch fresh data from Neon DB in the background
    syncPortfolioFromRemote().then((remoteContent) => {
      setContent(remoteContent);
    });

    return () => {
      window.removeEventListener(eventKey, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return content;
}
