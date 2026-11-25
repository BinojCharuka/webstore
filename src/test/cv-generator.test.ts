import { describe, expect, it } from "vitest";
import { defaultCvSettings, defaultPortfolio, type PortfolioContent } from "@/data/portfolio";
import { buildCvDocumentModel, buildSafePdfFileName } from "@/lib/cv-model";
import { generateCvPdfBlob, sanitizePdfText } from "@/lib/cv-pdf";

describe("CV model and PDF generator", () => {
  it("uses brief reference-CV defaults: excludes certificates and omits project live links", () => {
    const model = buildCvDocumentModel(defaultPortfolio);

    expect(model.sections.map((s) => s.key)).toEqual([
      "summary",
      "education",
      "skills",
      "projects",
      "leadership",
      "creative",
      "languages",
    ]);
    expect(model.sections.some((s) => s.key === "certificates")).toBe(false);

    const projects = model.sections.find((s) => s.key === "projects");
    expect(projects?.key).toBe("projects");
    if (projects?.key === "projects") {
      expect(projects.items.every((p) => p.links.length === 0)).toBe(true);
      expect(projects.items[0]?.techStack).toBe("Web Tool, PDF, Browser-first");
    }

    const edu = model.sections.find((s) => s.key === "education");
    if (edu?.key === "education") {
      expect(edu.items[0]?.description).toBeUndefined();
      expect(edu.items[0]?.highlights).toEqual([]);
    }

    const roles = model.sections.find((s) => s.key === "leadership");
    expect(roles?.heading).toBe("VOLUNTEERING");
    if (roles?.key === "leadership") {
      expect(roles.items[0]?.highlights).toEqual([]);
    }
  });

  it("builds CV sections respecting toggles, section order, and limits", () => {
    const custom: PortfolioContent = {
      ...defaultPortfolio,
      cvSettings: {
        ...defaultCvSettings,
        briefMode: false,
        includeProjectLinks: true,
        headlineOverride: "Full-Stack Developer & UI/UX Designer",
        summaryOverride: "Custom third-person professional summary for CV export.",
        phone: "+94 77 123 4567",
        featuredProjectsOnly: true,
        limits: {
          ...defaultCvSettings.limits,
          projects: 2,
          certificates: 1,
        },
        sectionOrder: [
          "education",
          "projects",
          "summary",
          "skills",
          "leadership",
          "creative",
          "certificates",
          "events",
          "journey",
          "languages",
        ],
        sections: {
          ...defaultCvSettings.sections,
          creative: false,
          leadership: true,
          certificates: true,
        },
      },
    };

    const model = buildCvDocumentModel(custom);

    expect(model.header.headline).toBe("Full-Stack Developer & UI/UX Designer");
    expect(
      model.header.primaryContacts.some(
        (c) => c.label === "Phone" && c.displayText.includes("+94"),
      ),
    ).toBe(true);
    expect(model.sections.map((s) => s.key).slice(0, 3)).toEqual([
      "education",
      "projects",
      "summary",
    ]);
    expect(model.sections.some((s) => s.key === "creative")).toBe(false);

    const summary = model.sections.find((s) => s.key === "summary");
    expect(summary?.key === "summary" ? summary.text : "").toBe(
      "Custom third-person professional summary for CV export.",
    );

    const projects = model.sections.find((s) => s.key === "projects");
    if (projects?.key === "projects") {
      expect(projects.items.length).toBe(2);
      expect(projects.items[0]?.links[0]?.url).toBe("https://pdfmithura.charudesignstudio.us");
    }

    const certs = model.sections.find((s) => s.key === "certificates");
    expect(certs?.key === "certificates" ? certs.items.length : 0).toBe(1);
  });

  it("sanitizes unsupported Unicode symbols cleanly while preserving readable ASCII text", () => {
    expect(sanitizePdfText("PDF ↔ image conversion ✳ built with care 📍")).toBe(
      "PDF <-> image conversion * built with care",
    );
  });

  it("builds safe normalized PDF file names", () => {
    expect(buildSafePdfFileName("  My CV: 2026 / Final  ")).toBe("My_CV_2026_Final.pdf");
    expect(buildSafePdfFileName("Binoj_Charuka_CV.pdf")).toBe("Binoj_Charuka_CV.pdf");
    expect(buildSafePdfFileName("")).toBe("Binoj_Charuka_CV.pdf");
  });

  it("generates a compact plain PDF binary without project URLs by default", async () => {
    const result = await generateCvPdfBlob(defaultPortfolio);

    expect(result.fileName).toBe("Binoj_Charuka_CV.pdf");
    expect(result.pageCount).toBeGreaterThanOrEqual(1);
    expect(result.blob.size).toBeGreaterThan(1500);

    const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error ?? new Error("Failed reading blob"));
      reader.readAsArrayBuffer(result.blob);
    });
    const fullAscii = new TextDecoder("latin1").decode(new Uint8Array(buffer));
    expect(fullAscii.startsWith("%PDF-")).toBe(true);
    expect(fullAscii).toContain("/URI (https://github.com/BinojCharuka)");
    expect(fullAscii).not.toContain("/URI (https://pdfmithura.charudesignstudio.us)");
  });

  it("supports serif Letter compact layout and very long skill lists cleanly", async () => {
    const rich: PortfolioContent = {
      ...defaultPortfolio,
      skills: [
        {
          group: "Very Long Core Stack",
          items: Array.from({ length: 18 }, (_, i) => `SkillToken${i + 1}`),
        },
      ],
      cvSettings: {
        ...defaultCvSettings,
        paperSize: "letter",
        fontStyle: "serif",
        compactMode: true,
        includeProjectLinks: true,
        fileName: "Custom Serif CV",
        sections: {
          ...defaultCvSettings.sections,
          events: true,
          journey: true,
          certificates: true,
        },
      },
    };

    const result = await generateCvPdfBlob(rich);
    expect(result.fileName).toBe("Custom_Serif_CV.pdf");
    expect(result.pageCount).toBeGreaterThanOrEqual(1);

    const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error ?? new Error("Failed reading blob"));
      reader.readAsArrayBuffer(result.blob);
    });
    const fullAscii = new TextDecoder("latin1").decode(new Uint8Array(buffer));
    expect(fullAscii).toContain("/Times-Roman");
    expect(fullAscii).toContain("/Times-Bold");
    expect(fullAscii).toContain("/URI (https://pdfmithura.charudesignstudio.us)");
  });
});
