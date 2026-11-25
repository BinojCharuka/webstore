import { useId, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  FileDown,
  FileText,
  Loader2,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  defaultCvSettings,
  resolveCvSettings,
  type CvSectionKey,
  type CvSettings,
  type PortfolioContent,
} from "@/data/portfolio";
import { buildCvDocumentModel, CV_SECTION_META } from "@/lib/cv-model";
import { CvPreviewSheet } from "@/components/cv/CvPreviewSheet";

type AdminCvSettingsPanelProps = {
  content: PortfolioContent;
  onChangeSettings: (next: CvSettings) => void;
  onResetDefaults: () => void;
};

type LimitFieldKey = keyof CvSettings["limits"];

const SECTION_LIMIT_KEY: Partial<Record<CvSectionKey, LimitFieldKey>> = {
  projects: "projects",
  leadership: "roles",
  events: "events",
  creative: "creative",
  certificates: "certificates",
  journey: "journey",
};

export function AdminCvSettingsPanel({
  content,
  onChangeSettings,
  onResetDefaults,
}: AdminCvSettingsPanelProps) {
  const settings = useMemo(() => resolveCvSettings(content.cvSettings), [content.cvSettings]);
  const model = useMemo(() => buildCvDocumentModel(content, settings), [content, settings]);

  const [generating, setGenerating] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<{
    type: "idle" | "success" | "error";
    text: string;
  }>({ type: "idle", text: "" });

  const idPrefix = useId();
  const inputClass =
    "w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";

  const patchSettings = (partial: Partial<CvSettings>) => {
    onChangeSettings({ ...settings, ...partial });
  };

  const toggleSection = (key: CvSectionKey, checked: boolean) => {
    patchSettings({
      sections: { ...settings.sections, [key]: checked },
    });
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= settings.sectionOrder.length) return;
    const nextOrder = [...settings.sectionOrder];
    const currentItem = nextOrder[index];
    const targetItem = nextOrder[target];
    if (!currentItem || !targetItem) return;
    nextOrder[index] = targetItem;
    nextOrder[target] = currentItem;
    patchSettings({ sectionOrder: nextOrder });
  };

  const updateLimit = (limitKey: LimitFieldKey, rawValue: string) => {
    const parsed = Number.parseInt(rawValue, 10);
    const safe = Number.isFinite(parsed) ? Math.max(0, Math.min(50, parsed)) : 0;
    patchSettings({
      limits: { ...settings.limits, [limitKey]: safe },
    });
  };

  const addLanguage = () => {
    patchSettings({
      languages: [...settings.languages, { name: "", proficiency: "" }],
    });
  };

  const updateLanguage = (idx: number, field: "name" | "proficiency", value: string) => {
    const next = settings.languages.map((lang, i) =>
      i === idx ? { ...lang, [field]: value } : lang,
    );
    patchSettings({ languages: next });
  };

  const removeLanguage = (idx: number) => {
    patchSettings({
      languages: settings.languages.filter((_, i) => i !== idx),
    });
  };

  const handleTestDownload = async () => {
    if (generating) return;
    setGenerating(true);
    setDownloadStatus({ type: "idle", text: "Generating PDF from live draft..." });
    try {
      const { downloadCvPdf } = await import("@/lib/cv-pdf");
      const result = await downloadCvPdf(content, settings);
      setDownloadStatus({
        type: "success",
        text: `Downloaded ${result.fileName} (${result.pageCount} ${result.pageCount === 1 ? "page" : "pages"}).`,
      });
    } catch (error) {
      setDownloadStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to generate CV PDF.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const jumpToPreview = () => {
    document.getElementById(`${idPrefix}-preview`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
              <FileText size={14} /> ATS Plain CV Generator
            </div>
            <h2 className="mt-2 font-serif text-3xl">CV Settings & Preview</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Configure which portfolio sections appear in your downloadable plain CV. Visitors
              click{" "}
              <strong className="text-foreground">{settings.buttonLabel || "Download CV"}</strong>{" "}
              in your Contact section to receive a formatted PDF using your live site content and
              these saved settings.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleTestDownload}
              disabled={generating}
              className="shine inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" /> Generating...
                </>
              ) : (
                <>
                  <FileDown size={15} aria-hidden="true" /> Download Test PDF
                </>
              )}
            </button>
            <button
              type="button"
              onClick={jumpToPreview}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-mono hover:bg-accent transition-colors"
            >
              Jump to Preview ↓
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Reset CV settings back to defaults?")) {
                  onResetDefaults();
                  setDownloadStatus({ type: "idle", text: "" });
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw size={13} aria-hidden="true" /> Reset CV defaults
            </button>
          </div>
        </div>

        {downloadStatus.text && (
          <p
            role={downloadStatus.type === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`mt-4 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 font-mono text-xs ${
              downloadStatus.type === "error"
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "border-primary/30 bg-primary/5 text-foreground"
            }`}
          >
            {downloadStatus.type === "success" && (
              <Check size={14} className="shrink-0 text-primary" aria-hidden="true" />
            )}
            <span>{downloadStatus.text}</span>
          </p>
        )}
      </div>

      {/* 1. Output & Public Button Controls */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-serif text-2xl">Public Download & PDF Format</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Controls the Contact section CTA pill and page formatting of exported `.pdf` files.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2 flex items-center gap-3 rounded-xl border bg-background/60 px-4 py-3">
            <input
              id={`${idPrefix}-enabled`}
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => patchSettings({ enabled: e.target.checked })}
              className="h-4 w-4 accent-primary"
            />
            <label htmlFor={`${idPrefix}-enabled`} className="text-sm font-medium cursor-pointer">
              Show CV download button in the public Contact section
            </label>
          </div>

          <div>
            <label
              htmlFor={`${idPrefix}-btn-label`}
              className="mb-1.5 block font-mono text-xs text-muted-foreground"
            >
              Public button label
            </label>
            <input
              id={`${idPrefix}-btn-label`}
              type="text"
              className={inputClass}
              value={settings.buttonLabel}
              placeholder={defaultCvSettings.buttonLabel}
              onChange={(e) => patchSettings({ buttonLabel: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor={`${idPrefix}-file-name`}
              className="mb-1.5 block font-mono text-xs text-muted-foreground"
            >
              PDF file name (without .pdf)
            </label>
            <input
              id={`${idPrefix}-file-name`}
              type="text"
              className={inputClass}
              value={settings.fileName}
              placeholder={defaultCvSettings.fileName}
              onChange={(e) => patchSettings({ fileName: e.target.value })}
            />
          </div>

          <fieldset className="rounded-xl border bg-background/40 p-4">
            <legend className="px-1 font-mono text-xs text-muted-foreground">Paper size</legend>
            <div className="mt-1 flex flex-wrap gap-5">
              <div className="flex items-center gap-2">
                <input
                  id={`${idPrefix}-paper-a4`}
                  type="radio"
                  name={`${idPrefix}-paper-size`}
                  value="a4"
                  checked={settings.paperSize === "a4"}
                  onChange={() => patchSettings({ paperSize: "a4" })}
                  className="accent-primary"
                />
                <label htmlFor={`${idPrefix}-paper-a4`} className="text-sm cursor-pointer">
                  A4 (International)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id={`${idPrefix}-paper-letter`}
                  type="radio"
                  name={`${idPrefix}-paper-size`}
                  value="letter"
                  checked={settings.paperSize === "letter"}
                  onChange={() => patchSettings({ paperSize: "letter" })}
                  className="accent-primary"
                />
                <label htmlFor={`${idPrefix}-paper-letter`} className="text-sm cursor-pointer">
                  US Letter
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-xl border bg-background/40 p-4">
            <legend className="px-1 font-mono text-xs text-muted-foreground">Typography</legend>
            <div className="mt-1 flex flex-wrap gap-5">
              <div className="flex items-center gap-2">
                <input
                  id={`${idPrefix}-font-sans`}
                  type="radio"
                  name={`${idPrefix}-font-style`}
                  value="sans"
                  checked={settings.fontStyle === "sans"}
                  onChange={() => patchSettings({ fontStyle: "sans" })}
                  className="accent-primary"
                />
                <label htmlFor={`${idPrefix}-font-sans`} className="text-sm cursor-pointer">
                  Clean Sans (Helvetica)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id={`${idPrefix}-font-serif`}
                  type="radio"
                  name={`${idPrefix}-font-style`}
                  value="serif"
                  checked={settings.fontStyle === "serif"}
                  onChange={() => patchSettings({ fontStyle: "serif" })}
                  className="accent-primary"
                />
                <label htmlFor={`${idPrefix}-font-serif`} className="text-sm cursor-pointer">
                  Classic Serif (Times)
                </label>
              </div>
            </div>
          </fieldset>

          <div className="sm:col-span-2 flex flex-wrap gap-x-6 gap-y-3 pt-1">
            <div className="flex items-center gap-2.5">
              <input
                id={`${idPrefix}-brief`}
                type="checkbox"
                checked={settings.briefMode}
                onChange={(e) => patchSettings({ briefMode: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
              <label htmlFor={`${idPrefix}-brief`} className="text-sm cursor-pointer">
                Brief mode (concise Education, Projects & Volunteering summaries)
              </label>
            </div>
            <div className="flex items-center gap-2.5">
              <input
                id={`${idPrefix}-compact`}
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => patchSettings({ compactMode: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
              <label htmlFor={`${idPrefix}-compact`} className="text-sm cursor-pointer">
                Compact spacing (fits more per page)
              </label>
            </div>
            <div className="flex items-center gap-2.5">
              <input
                id={`${idPrefix}-links`}
                type="checkbox"
                checked={settings.includeLinks}
                onChange={(e) => patchSettings({ includeLinks: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
              <label htmlFor={`${idPrefix}-links`} className="text-sm cursor-pointer">
                Include contact links in header (LinkedIn, GitHub, Portfolio)
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Contact & Summary Overrides + Languages */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-serif text-2xl">CV Details & Languages</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Leave Headline or Summary blank to automatically inherit from your Profile section.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`${idPrefix}-phone`}
              className="mb-1.5 block font-mono text-xs text-muted-foreground"
            >
              Phone number for CV header (optional)
            </label>
            <input
              id={`${idPrefix}-phone`}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={inputClass}
              value={settings.phone}
              placeholder="+94 7X XXX XXXX"
              onChange={(e) => patchSettings({ phone: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor={`${idPrefix}-headline`}
              className="mb-1.5 block font-mono text-xs text-muted-foreground"
            >
              CV Role / Headline override (optional)
            </label>
            <input
              id={`${idPrefix}-headline`}
              type="text"
              className={inputClass}
              value={settings.headlineOverride}
              placeholder={content.profile.headline}
              onChange={(e) => patchSettings({ headlineOverride: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor={`${idPrefix}-summary`}
              className="mb-1.5 block font-mono text-xs text-muted-foreground"
            >
              Professional Summary override (optional)
            </label>
            <textarea
              id={`${idPrefix}-summary`}
              rows={3}
              aria-describedby={`${idPrefix}-summary-hint`}
              className={inputClass}
              value={settings.summaryOverride}
              placeholder={content.profile.bio}
              onChange={(e) => patchSettings({ summaryOverride: e.target.value })}
            />
            <span
              id={`${idPrefix}-summary-hint`}
              className="mt-1 block text-xs text-muted-foreground"
            >
              Currently using:{" "}
              {settings.summaryOverride.trim()
                ? "Custom CV Professional Summary"
                : "Site Profile About Bio (automatic fallback)"}
            </span>
          </div>
        </div>

        {/* Languages Repeatable Group */}
        <div className="mt-6 border-t border-border/50 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Languages
              </h4>
            </div>
            <button
              type="button"
              onClick={addLanguage}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-accent/40 px-3.5 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
            >
              <Plus size={13} aria-hidden="true" /> Add language
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {settings.languages.map((lang, idx) => (
              <div key={idx} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto] items-end">
                <div>
                  <label
                    htmlFor={`${idPrefix}-lang-name-${idx}`}
                    className="mb-1 block font-mono text-[11px] text-muted-foreground"
                  >
                    Language
                  </label>
                  <input
                    id={`${idPrefix}-lang-name-${idx}`}
                    type="text"
                    className={inputClass}
                    value={lang.name}
                    placeholder="e.g. English"
                    onChange={(e) => updateLanguage(idx, "name", e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${idPrefix}-lang-prof-${idx}`}
                    className="mb-1 block font-mono text-[11px] text-muted-foreground"
                  >
                    Proficiency
                  </label>
                  <input
                    id={`${idPrefix}-lang-prof-${idx}`}
                    type="text"
                    className={inputClass}
                    value={lang.proficiency}
                    placeholder="e.g. Professional Working Proficiency"
                    onChange={(e) => updateLanguage(idx, "proficiency", e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLanguage(idx)}
                  aria-label={`Remove language ${lang.name || idx + 1}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
            ))}
            {settings.languages.length === 0 && (
              <p className="rounded-xl border border-dashed p-3 text-xs text-muted-foreground">
                No languages configured. Add one above or toggle Languages off below.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. Section Visibility, Order & Limits */}
      <section className="rounded-2xl border bg-card p-6">
        <h3 className="font-serif text-2xl">Sections, Ordering & Item Limits</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Choose which portfolio sections appear in the CV, reorder them, or cap entry counts (use{" "}
          <code className="font-mono text-foreground">0</code> to include all entries).
        </p>

        {/* Fine-grain content toggles */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 rounded-xl border bg-background/40 p-4">
          <div className="flex items-center gap-2.5">
            <input
              id={`${idPrefix}-featured-only`}
              type="checkbox"
              checked={settings.featuredProjectsOnly}
              onChange={(e) => patchSettings({ featuredProjectsOnly: e.target.checked })}
              className="h-4 w-4 accent-primary"
            />
            <label
              htmlFor={`${idPrefix}-featured-only`}
              className="text-xs sm:text-sm cursor-pointer"
            >
              Featured projects only
            </label>
          </div>
          <div className="flex items-center gap-2.5">
            <input
              id={`${idPrefix}-proj-links`}
              type="checkbox"
              checked={settings.includeProjectLinks}
              onChange={(e) => patchSettings({ includeProjectLinks: e.target.checked })}
              className="h-4 w-4 accent-primary"
            />
            <label htmlFor={`${idPrefix}-proj-links`} className="text-xs sm:text-sm cursor-pointer">
              Include Live / Source links in Projects
            </label>
          </div>
          <div className="flex items-center gap-2.5">
            <input
              id={`${idPrefix}-proj-highlights`}
              type="checkbox"
              checked={settings.includeProjectHighlights}
              disabled={settings.briefMode}
              onChange={(e) => patchSettings({ includeProjectHighlights: e.target.checked })}
              className="h-4 w-4 accent-primary disabled:opacity-50"
            />
            <label
              htmlFor={`${idPrefix}-proj-highlights`}
              className={`text-xs sm:text-sm cursor-pointer ${settings.briefMode ? "opacity-60" : ""}`}
            >
              Extra project bullet points (Detailed mode only)
            </label>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {settings.sectionOrder.map((key, idx) => {
            const meta = CV_SECTION_META[key];
            const enabled = settings.sections[key];
            const limitKey = SECTION_LIMIT_KEY[key];

            return (
              <div
                key={key}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors ${
                  enabled
                    ? "bg-background/70 border-border"
                    : "bg-background/25 border-border/40 opacity-75"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <input
                    id={`${idPrefix}-sec-${key}`}
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => toggleSection(key, e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-primary"
                  />
                  <div className="min-w-0">
                    <label
                      htmlFor={`${idPrefix}-sec-${key}`}
                      className="block text-sm font-medium cursor-pointer"
                    >
                      {meta.label}
                    </label>
                    <p className="text-xs text-muted-foreground">{meta.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {limitKey && (
                    <div className="flex items-center gap-1.5 mr-2">
                      <label
                        htmlFor={`${idPrefix}-limit-${key}`}
                        className="font-mono text-[11px] text-muted-foreground"
                      >
                        Max:
                      </label>
                      <input
                        id={`${idPrefix}-limit-${key}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        aria-label={`Maximum ${meta.label} items in CV (0 for all)`}
                        className="w-14 rounded-lg border bg-background px-2 py-1 text-center font-mono text-xs outline-none focus-visible:border-primary"
                        value={String(settings.limits[limitKey])}
                        onChange={(e) => updateLimit(limitKey, e.target.value)}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, -1)}
                    aria-label={`Move ${meta.label} up`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground hover:border-primary/50 hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowUp size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === settings.sectionOrder.length - 1}
                    onClick={() => moveSection(idx, 1)}
                    aria-label={`Move ${meta.label} down`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground hover:border-primary/50 hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowDown size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Live Plain Paper Preview */}
      <section id={`${idPrefix}-preview`} className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl">Live Plain CV Preview</h3>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Output file: <span className="text-foreground">{model.fileName}</span> ·{" "}
              {settings.paperSize.toUpperCase()} ·{" "}
              {settings.fontStyle === "serif" ? "Serif" : "Sans"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleTestDownload}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-mono font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
          >
            {generating ? (
              <Loader2 size={13} className="animate-spin" aria-hidden="true" />
            ) : (
              <FileDown size={13} aria-hidden="true" />
            )}
            Download Test PDF
          </button>
        </div>

        <CvPreviewSheet model={model} />
      </section>
    </div>
  );
}
