import { describe, expect, it } from "vitest";
import { defaultPortfolio, isPortfolioContent, getPortfolioValidationErrors } from "@/data/portfolio";

describe("Portfolio content", () => {
  it("has all planned main sections", () => {
    expect(defaultPortfolio.profile.shortName).toBe("Binoj Charuka");
    expect(defaultPortfolio.projects.length).toBeGreaterThanOrEqual(4);
    expect(defaultPortfolio.events.length).toBeGreaterThan(0);
    expect(defaultPortfolio.roles.length).toBeGreaterThan(0);
    expect(defaultPortfolio.creative.length).toBeGreaterThan(0);
    expect(defaultPortfolio.journey.length).toBeGreaterThan(0);
    expect(defaultPortfolio.education?.length).toBe(3);
    expect(defaultPortfolio.certificates).toEqual([]);
  });
  it("accepts the bundled export shape", () => {
    expect(isPortfolioContent(JSON.parse(JSON.stringify(defaultPortfolio)))).toBe(true);
    expect(isPortfolioContent({ projects: [] })).toBe(false);
  });
  it("accepts projects with images array", () => {
    const withImages = JSON.parse(JSON.stringify(defaultPortfolio));
    withImages.projects[0].images = ["https://res.cloudinary.com/demo/image1.jpg", "https://res.cloudinary.com/demo/image2.jpg"];
    expect(isPortfolioContent(withImages)).toBe(true);
  });
  it("handles null in optional fields without failing validation", () => {
    const withNulls = JSON.parse(JSON.stringify(defaultPortfolio));
    withNulls.projects[0].liveUrl = null;
    withNulls.projects[0].sourceUrl = null;
    if (withNulls.education?.[0]) {
      withNulls.education[0].logo = null;
      withNulls.education[0].field = null;
    }
    expect(getPortfolioValidationErrors(withNulls)).toEqual([]);
    expect(isPortfolioContent(withNulls)).toBe(true);
  });
  it("returns descriptive validation errors for missing profile fields", () => {
    const errors = getPortfolioValidationErrors({ profile: {} });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain("profile.name");
  });
});
