import { describe, expect, it } from "vitest";
import { defaultPortfolio, isPortfolioContent } from "@/data/portfolio";

describe("Portfolio content", () => {
  it("has all planned main sections", () => {
    expect(defaultPortfolio.profile.shortName).toBe("Binoj Charuka");
    expect(defaultPortfolio.projects.length).toBeGreaterThanOrEqual(4);
    expect(defaultPortfolio.events.length).toBeGreaterThan(0);
    expect(defaultPortfolio.roles.length).toBeGreaterThan(0);
    expect(defaultPortfolio.creative.length).toBeGreaterThan(0);
    expect(defaultPortfolio.journey.length).toBeGreaterThan(0);
    expect(defaultPortfolio.certificates).toEqual([]);
  });
  it("accepts the bundled export shape", () => {
    expect(isPortfolioContent(JSON.parse(JSON.stringify(defaultPortfolio)))).toBe(true);
    expect(isPortfolioContent({ projects: [] })).toBe(false);
  });
});
