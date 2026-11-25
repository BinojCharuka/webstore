import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminCvSettingsPanel } from "@/components/cv/AdminCvSettingsPanel";
import { defaultCvSettings, defaultPortfolio, type CvSettings } from "@/data/portfolio";
import * as cvPdf from "@/lib/cv-pdf";

function Harness() {
  const [settings, setSettings] = useState<CvSettings>(defaultCvSettings);
  return (
    <AdminCvSettingsPanel
      content={{ ...defaultPortfolio, cvSettings: settings }}
      onChangeSettings={setSettings}
      onResetDefaults={() => setSettings(defaultCvSettings)}
    />
  );
}

describe("AdminCvSettingsPanel & Live Preview UI", () => {
  it("updates live CV preview immediately when CV settings and overrides change", () => {
    render(<Harness />);

    expect(screen.getByText("TECHNICAL SKILLS")).toBeInTheDocument();
    expect(screen.getByText("VOLUNTEERING")).toBeInTheDocument();
    expect(screen.getByText("CREATIVE & MEDIA")).toBeInTheDocument();
    expect(screen.queryByText("CERTIFICATIONS")).not.toBeInTheDocument();

    const phoneInput = screen.getByLabelText(/Phone number for CV header/i);
    fireEvent.change(phoneInput, { target: { value: "+94 77 555 0199" } });
    expect(screen.getByText("+94 77 555 0199")).toBeInTheDocument();

    const summaryInput = screen.getByLabelText(/Professional Summary override/i);
    fireEvent.change(summaryInput, {
      target: { value: "Focused electronics & web developer ready for software roles." },
    });
    const matched = screen.getAllByText(
      "Focused electronics & web developer ready for software roles.",
    );
    expect(matched.some((el) => el.tagName.toLowerCase() === "p")).toBe(true);

    const creativeToggle = screen.getByLabelText("Creative & Media");
    fireEvent.click(creativeToggle);
    expect(screen.queryByText("CREATIVE & MEDIA")).not.toBeInTheDocument();

    const moveProjectsUp = screen.getByRole("button", { name: "Move Projects up" });
    fireEvent.click(moveProjectsUp);
    expect(screen.getByText("PROJECTS")).toBeInTheDocument();

    const addLanguage = screen.getByRole("button", { name: /Add language/i });
    fireEvent.click(addLanguage);
    expect(screen.getByLabelText(/Remove language 3/i)).toBeInTheDocument();
  });

  it("handles test PDF download status feedback cleanly", async () => {
    const spy = vi
      .spyOn(cvPdf, "downloadCvPdf")
      .mockResolvedValue({ fileName: "Binoj_Charuka_CV.pdf", pageCount: 2 });

    render(<Harness />);

    const buttons = screen.getAllByRole("button", { name: /Download Test PDF/i });
    const firstBtn = buttons[0];
    expect(firstBtn).toBeDefined();
    if (firstBtn) {
      fireEvent.click(firstBtn);
    }

    await waitFor(() => {
      expect(
        screen.getByText(/Downloaded Binoj_Charuka_CV.pdf \(2 pages\)\./i),
      ).toBeInTheDocument();
    });

    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRejectedValueOnce(new Error("Simulated export failure"));
    if (firstBtn) {
      fireEvent.click(firstBtn);
    }
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Simulated export failure");
    });

    spy.mockRestore();
  });
});
