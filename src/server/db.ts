import { neon } from "@neondatabase/serverless";
import { defaultPortfolio, isPortfolioContent, type PortfolioContent } from "../data/portfolio";
import fs from "node:fs";
import path from "node:path";

function ensureEnvLoaded() {
  if (process.env["DATABASE_URL"]) return;
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

function getDatabaseUrl(): string | undefined {
  ensureEnvLoaded();
  return process.env["DATABASE_URL"];
}

export function isDbConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

export function getDbClient() {
  const url = getDatabaseUrl();
  if (!url) {
    return null;
  }
  return neon(url);
}

let tableInitPromise: Promise<void> | null = null;

export async function initDb(): Promise<void> {
  if (tableInitPromise) return tableInitPromise;
  tableInitPromise = (async () => {
    const sql = getDbClient();
    if (!sql) return;
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS portfolio_data (
          id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
          data JSONB NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
    } catch (error) {
      console.error("Failed to initialize Neon database tables:", error);
    }
  })();
  return tableInitPromise;
}

export async function getPortfolioFromDb(): Promise<PortfolioContent> {
  const sql = getDbClient();
  if (!sql) {
    return defaultPortfolio;
  }
  try {
    await initDb();
    const rows = await sql`
      SELECT data FROM portfolio_data WHERE id = 'main' LIMIT 1;
    `;
    const firstRow = rows[0];
    if (firstRow && isPortfolioContent(firstRow["data"])) {
      return firstRow["data"];
    }

    // Seed default portfolio if empty
    await savePortfolioToDb(defaultPortfolio);
    return defaultPortfolio;
  } catch (error) {
    console.error("Error reading portfolio from Neon DB:", error);
    return defaultPortfolio;
  }
}

export async function savePortfolioToDb(
  content: PortfolioContent,
): Promise<{ success: boolean; error?: string }> {
  const sql = getDbClient();
  if (!sql) {
    return { success: false, error: "DATABASE_URL is not configured" };
  }
  if (!isPortfolioContent(content)) {
    return { success: false, error: "Invalid portfolio data structure" };
  }
  try {
    await initDb();
    await sql`
      INSERT INTO portfolio_data (id, data, updated_at)
      VALUES ('main', ${JSON.stringify(content)}, NOW())
      ON CONFLICT (id) DO UPDATE
      SET data = ${JSON.stringify(content)}, updated_at = NOW();
    `;
    return { success: true };
  } catch (error) {
    console.error("Error saving portfolio to Neon DB:", error);
    return { success: false, error: error instanceof Error ? error.message : "Database error" };
  }
}
