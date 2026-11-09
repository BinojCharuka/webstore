import { describe, expect, it } from "vitest";
import { resolveTheme } from "./theme";

describe("portfolio theme preference", () => {
  it("defaults to the very dark theme", () => {
    expect(resolveTheme(null)).toBe("dark");
    expect(resolveTheme("invalid")).toBe("dark");
  });
  it("restores the visitor's light or dark choice", () => {
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });
});
