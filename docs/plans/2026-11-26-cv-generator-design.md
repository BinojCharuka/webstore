# Dynamic Plain CV PDF Generator — Design Document

**Date:** 2026-11-26  
**Topic:** Dynamic on-demand plain CV PDF generator configured from `/admin` and triggered from Contact section  
**Target Stack:** TanStack Start (React 19.2), Vite 8, TypeScript (strict + `exactOptionalPropertyTypes`), Tailwind CSS v4, Neon PostgreSQL (`/api/portfolio`), Vercel Nitro

---

## 1. Intent & The Why

The portfolio owner wants visitors (and the owner themselves) to be able to download a cleanly formatted, plain, ATS-friendly PDF CV generated directly from the live content of the portfolio website (`profile`, `education`, `skills`, `projects`, `roles`, `events`, `creative`, `certificates`, `journey`).

Whenever the owner updates any section of the website in `/admin` (saved to Neon PostgreSQL or locally), subsequent CV downloads must reflect those updates automatically without manually re-editing and re-uploading a separate static PDF file.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Single source of truth:** Pull section data dynamically from `PortfolioContent` (`usePortfolio()`), synced with Neon PostgreSQL.
- **Plain, ATS-friendly format:** Render a single-column, white-paper, dark-ink plain CV matching the structure of `Binoj_Charuka_CV.md` — clean hierarchy, horizontal section dividers, bullet highlights, real selectable vector text, and clickable hyperlinks.
- **Admin-only configuration (`/admin`):** Add a dedicated **CV Settings** view inside `/admin` (persisted alongside `PortfolioContent` in Neon DB and JSON export/import) controlling included sections, order, item caps, CV-specific metadata (formal summary override, role headline override, phone, languages), layout/page size, and public CTA toggle, accompanied by a live preview sheet and a "Download test PDF" action.
- **One-click public download (`10 — contact`):** Place a `Download CV` button right inside the `Contact` section (`src/routes/index.tsx`) alongside `Copy email`, `GitHub`, and `My website`. Clicking it builds and downloads the `.pdf` immediately to the requester's device.

### Non-Goals
- Letting public visitors customize CV sections or templates before downloading (user explicitly chose admin-only settings).
- Creating a standalone public `/cv` showcase page or adding navigation bar clutter.
- Adding neon glows, portfolio cards, portrait photos, or multi-column graphic templates into the CV PDF.
- Rendering from a headless browser or server-side HTML screenshot pipeline.

### Anti-Goals
- Rasterizing HTML via `html2canvas` (produces non-selectable text, blurry output, broken links, and fails ATS parsing).
- Relying on `window.print()` (requires manual user confirmation in a browser print dialog and stamps inconsistent browser headers/margins).
- Bloating the initial `/` landing bundle with PDF libraries on page load (`jspdf` must be dynamically imported only on demand).

---

## 3. Constraints

1. **TypeScript strictness (`tsconfig.json`):** `strict: true`, `exactOptionalPropertyTypes: true`, `noPropertyAccessFromIndexSignature: true`, `noUncheckedIndexedAccess: true`. Optional fields in `CvSettings` must allow `| undefined` or be omitted cleanly in normalizers.
2. **Backward compatibility with existing Neon DB rows:** Existing JSON rows in Neon PostgreSQL (`portfolio_data.data`) do not contain `cvSettings`. Both `isPortfolioContent` / `getPortfolioValidationErrors` and `normalizePortfolio` MUST accept payloads where `cvSettings` is absent or partial and fill safe defaults without throwing errors.
3. **Standard PDF font glyph safety:** Built-in PDF fonts (`helvetica`, `times`) in `jsPDF` support Windows-1252 / Latin-1 text only. Unsupported symbols (e.g., `↔`, `✳`, emojis) appearing in portfolio copy MUST be sanitized/transliterated (e.g. `↔` → `to`) before drawing text so no mojibake appears in the exported PDF.
4. **Pagination integrity:** Multi-page CVs (`A4` or `Letter`) must never orphan a section heading at the bottom of a page or split a short item title from its first description line.

---

## 4. Approaches Considered & Selection

| Approach | How it works | Trade-offs | Outcome |
|----------|--------------|------------|---------|
| **1. Client-side vector PDF (`jsPDF`, dynamic `import()`)** | Builds real vector text, rules, wrapped paragraphs, and clickable `link` annotations directly from `PortfolioContent` + `cvSettings` on button click. | Adds one small dependency (`jspdf`); PDF layout written in TypeScript rather than JSX. Zero React 19 / SSR bundler friction; works with both saved DB state and unsaved `/admin` drafts; sub-100ms export. | **Selected by user** |
| 2. Declarative JSX PDF (`@react-pdf/renderer`) | Defines PDF layout using React components (`<Document>`, `<Page>`, `<View>`). | Heavy bundle (~1MB+) and frequent React 19 / Vite 8 / Node buffer compatibility issues in SSR setups. | Rejected |
| 3. Server-side Nitro `/api/cv.pdf` | Reads Neon DB on Vercel serverless and streams PDF bytes. | Ignores unsaved `/admin` edits, adds cold-start latency, requires DB configured locally to preview admin edits. | Rejected |

---

## 5. User Decisions vs. Agent Proposals (Marked Calls)

### User Decisions (Fixed)
1. **Settings visibility:** Only configurable inside `/admin`; visitors get direct click-to-download without any settings UI.
2. **CV visual format:** Single-column, ATS-friendly plain format matching `Binoj_Charuka_CV.md`.
3. **Download button placement:** Inside the `10 — contact` section (`src/routes/index.tsx`), next to `Copy email`, `GitHub`, and `My website`.
4. **Generation engine:** Client-side lazy-loaded `jsPDF` (`Approach 1`).

### Our Calls (Proposals — Clearly Marked)
- **Call 1 — Storage in existing `PortfolioContent` schema:** Store `cvSettings` as a root field on `PortfolioContent` (`src/data/portfolio.ts`) instead of adding a second Neon DB table/API endpoint. *Why:* Reuses existing `savePortfolioToDb`, `normalizePortfolio`, `exportJson`/`importJson`, and live `usePortfolio()` listeners with zero extra backend surface area.
- **Call 2 — Built-in PDF typography (`helvetica` sans or `times` serif option):** Default to clean sans-serif (`helvetica`) with an optional toggle in `/admin` for `times` classic serif, using built-in PDF base fonts rather than embedding external `.ttf` files. *Why:* Zero external font fetch latency on visitor click, reliable ATS text extraction, instant offline generation.
- **Call 3 — Dedicated formal CV fields with smart fallbacks:** Provide optional `cvSettings.headlineOverride`, `cvSettings.summaryOverride`, `cvSettings.phone`, `cvSettings.languages`, and `cvSettings.sectionOrder` inside `/admin`. When `headlineOverride` or `summaryOverride` is blank, automatically fall back to `profile.headline` and `profile.bio`. *Why:* Portfolio copy uses casual first-person phrasing ("I'm an undergraduate..."), whereas a formal CV often uses concise third-person phrasing like `Binoj_Charuka_CV.md`, yet manual re-entry isn't forced if the user prefers automatic fallback.
- **Call 4 — Plain preview sheet + test download inside `/admin`:** Render a React HTML plain-document preview (`src/components/cv/CvPreviewSheet.tsx`) beside the CV Settings controls inside `/admin` using the exact same section-mapping resolver (`src/lib/cv-model.ts`) as the PDF generator (`src/lib/cv-pdf.ts`). *Why:* Gives the owner instant visual verification of section order, limits, and text while toggling settings before saving to Neon DB, and prevents drift between preview and PDF output.
- **Call 5 — Extract UI modules cleanly:** Put CV data resolution in `src/lib/cv-model.ts`, PDF generation in `src/lib/cv-pdf.ts`, and `/admin` CV tab UI in `src/components/cv/AdminCvSettingsPanel.tsx` + `src/components/cv/CvPreviewSheet.tsx` rather than inflating `src/routes/admin.tsx` further.
- **Call 6 — Section toggle defaults & sensible caps:** Default all main `Binoj_Charuka_CV.md` sections ON (`summary`, `skills`, `education`, `projects`, `leadership`, `certificates`, `languages`), keep secondary/overlapping ones toggleable (`creative` ON as concise summary/list, `events` and `journey` OFF by default since `roles` + `projects` + `education` already cover them without bloating past 2 pages, easily toggleable ON in `/admin`). Allow item caps (`maxProjects`, `maxRoles`, `maxCertificates`, etc. where `0` = all) and toggles for project highlights / URLs and certificate descriptions.

---

## 6. Architecture & Data Flow

```
Neon DB / localStorage ──▶ normalizePortfolio() ──▶ PortfolioContent (+ cvSettings)
                                                            │
                                    ┌───────────────────────┴───────────────────────┐
                                    ▼                                               ▼
                       /admin (CvSettingsPanel)                     Public Home (`#contact`)
                   Edit toggles, order, phone,                      "Download CV" pill button
                   languages, paper, live preview                               │
                                    │                                           │
                                    └───────────────────┬───────────────────────┘
                                                        ▼
                                            buildCvDocumentModel(portfolio)
                                                 (src/lib/cv-model.ts)
                                                        │
                                                        ▼
                                          await import("@/lib/cv-pdf")
                                          downloadCvPdf(model, cvSettings)
                                            (lazy-loaded jsPDF engine)
                                                        │
                                                        ▼
                                      Downloads `{fileName}.pdf` to browser
```

### 6.1 Data Schema (`src/data/portfolio.ts`)

Add `CvSectionKey` and `CvSettings` types:

```ts
export type CvSectionKey =
  | "summary"
  | "skills"
  | "education"
  | "projects"
  | "leadership"
  | "events"
  | "creative"
  | "certificates"
  | "journey"
  | "languages";

export type CvLanguageEntry = {
  name: string;
  proficiency: string;
};

export type CvSettings = {
  enabled: boolean; // Show/hide Download CV button in #contact
  buttonLabel: string; // Default: "Download CV"
  fileName: string; // Base name without .pdf, e.g. "Binoj_Charuka_CV"
  paperSize: "a4" | "letter";
  fontStyle: "sans" | "serif"; // Maps to jsPDF helvetica vs times
  compactMode: boolean; // Slightly tighter line height & margins for 1–2 page fit
  includeLinks: boolean; // Include Website / GitHub / LinkedIn / Project live URLs
  includeProjectHighlights: boolean;
  includeCertificatesDetails: boolean;
  headlineOverride: string; // Optional; blank falls back to profile.headline
  summaryOverride: string; // Optional; blank falls back to profile.bio
  phone: string; // Optional CV contact line
  languages: CvLanguageEntry[];
  sectionOrder: CvSectionKey[];
  sections: Record<CvSectionKey, boolean>;
  limits: {
    projects: number; // 0 = show all (only featured filter optional or all capped)
    roles: number;
    events: number;
    creative: number;
    certificates: number;
    journey: number;
  };
  featuredProjectsOnly: boolean; // If true, filter projects with featured === true before applying limit
};
```

Extend `PortfolioContent` with:
```ts
cvSettings?: CvSettings;
```
Provide `defaultCvSettings: CvSettings` cleanly modeled on `Binoj_Charuka_CV.md`:
- `enabled: true`
- `buttonLabel: "Download CV"`
- `fileName: "Binoj_Charuka_CV"`
- `paperSize: "a4"`
- `fontStyle: "sans"`
- `compactMode: false`
- `includeLinks: true`
- `includeProjectHighlights: true`
- `includeCertificatesDetails: false`
- `headlineOverride: ""`
- `summaryOverride: ""`
- `phone: ""`
- `languages: [{ name: "English", proficiency: "Professional Working Proficiency" }, { name: "Sinhala", proficiency: "Native Proficiency" }]`
- `sectionOrder: ["summary", "skills", "education", "projects", "leadership", "creative", "certificates", "events", "journey", "languages"]`
- `sections`: all `true` except `events: false`, `journey: false` (all individually toggleable in `/admin`)
- `limits`: `{ projects: 6, roles: 6, events: 4, creative: 5, certificates: 5, journey: 6 }`
- `featuredProjectsOnly: false`

**Validation & Normalization Rules:**
- `getPortfolioValidationErrors(value)` checks `root["cvSettings"]` ONLY if defined & non-null (ensuring backwards compatibility with existing Neon DB payloads and minimal tests!). Invalid types inside `cvSettings` report clear strings; missing keys are permitted when normalizing.
- `normalizePortfolio(value)` always returns a complete `cvSettings` object merged safely with `defaultCvSettings` (preserving every valid user toggle, normalizing `sectionOrder` so newly added `CvSectionKey` items never get dropped or duplicated).

### 6.2 Shared CV Document Model (`src/lib/cv-model.ts`)

Pure TypeScript transformation:
`buildCvDocumentModel(content: PortfolioContent): CvDocumentModel`
Produces normalized, clean plain-text structures consumed identically by **both** `CvPreviewSheet.tsx` and `cv-pdf.ts`:
- Header block:
  - Name (`profile.name`)
  - Subtitle (`cvSettings.headlineOverride.trim() || profile.headline`)
  - Contact links row (filtering empty strings automatically): `location`, `phone`, `email`, `website`, `github`, `linkedin`
- Ordered sections filtered by `cvSettings.sectionOrder` & `cvSettings.sections[key]`:
  - `summary`: `cvSettings.summaryOverride.trim() || profile.bio`
  - `skills`: Each `{ group, items }` where `items.length > 0`
  - `education`: `{ title: degree + (field ? " — " + field : ""), institution, period, description, highlights }`
  - `projects`: Filtered optionally by `featured`, capped by `limits.projects`, ordered cleanly with `name`, `tagline`, `categories`, `year`, `description`, `highlights` (when `includeProjectHighlights`), and clickable `liveUrl` / `sourceUrl` (when `includeLinks`)
  - `leadership`: Mapped from `roles` capped by `limits.roles`, with `title`, `group`, `organization`, `year`, `description`, `highlights`
  - `events`: Mapped from `events` capped by `limits.events`, with `title`, `role`, `group`, `year`, `summary`, `highlights`
  - `creative`: Mapped from `creative` capped by `limits.creative`, with `title`, `category`, `year`, `context`
  - `certificates`: Mapped from `certificates` capped by `limits.certificates`, with `title`, `issuer`, `year`, `credentialId`, optional `description`, and optional `url` (when `includeLinks`)
  - `journey`: Mapped from `journey` capped by `limits.journey`, with `when`, `what`, `where`, `detail`
  - `languages`: Each `{ name, proficiency }` with non-empty name
- Omits any section whose mapped items array is empty so blank sections never leave orphan headers!

### 6.3 PDF Rendering Engine (`src/lib/cv-pdf.ts`)

Lazy-loaded (`await import("@/lib/cv-pdf")`) only when the user clicks Download CV or Test Download PDF:
- Uses `jsPDF` (`unit: "pt"`, `format: settings.paperSize`, portrait).
- **Margins & Grid:** Single-column editorial layout (`46pt` L/R margins, `44pt` top/bottom; or `36pt` / `36pt` when `compactMode: true`). Consistent vertical rhythm.
- **Plain ATS Aesthetics:**
  - Pure black/charcoal ink (`#111827` headings, `#1f2937` body, `#4b5563` secondary metadata, `#d1d5db` 0.5pt hairline rules). Zero dark backgrounds, zero neon colors, zero icons/raster images.
  - **Header:** Centered or crisp left-aligned bold Name (`18pt`), muted role/headline (`10pt`), subtle metadata bar (`location | phone | email | website | github | linkedin`) with real clickable `doc.textWithLink(...)` anchors where URLs exist. Bottom divider rule.
  - **Section Titles:** Uppercase bold (`10.5pt` with crisp underline rule below title) + **keep-with-next protection** (checks remaining page height >= heading height + first entry minimum block height before drawing, preventing orphan headers!).
  - **Entries:** Left title bold + right-aligned period/year, muted subtitle/organization/stack line, wrapped justified/left body text via `doc.splitTextToSize()`, crisp indented hyphen/bullet points (`- ` or `\u2022` safe Latin-1 bullet `•`), and clickable project/certificate links.
  - **Footer:** Subtle bottom-right `Page X of Y` (only shown when total pages > 1) and clean generated date/metadata.
  - **Sanitization helper `sanitizePdfText(input: string)`:** Normalizes typography into Windows-1252-safe characters (`↔` → `to`, `✳` → `*`, `↳` → `->`, `•` preserved cleanly, smart quotes normalized, strips non-Latin1 emojis) so no garbled text ever appears in PDF viewers.
  - **Safe filename builder:** Sanitizes `cvSettings.fileName` (fallback `Binoj_Charuka_CV`) ending in `.pdf`.

### 6.4 `/admin` Integration (`src/routes/admin.tsx` + `src/components/cv/*`)

1. Add `{ value: "cv", label: "CV Generator" }` to `sections` navigation in `/admin` (`View = "profile" | "cv" | Collection`).
2. `AdminCvSettingsPanel.tsx` features:
   - Top quick actions: **Download Test PDF** (uses current unsaved/saved `draft` live!) and notice reminding user to click **Save to Neon Database** to publish settings to visitors.
   - **Left Column (Controls):**
     - **Public Button & File**: Enable/disable public Contact button (`enabled`), button label, downloaded filename (`fileName`), paper size (`A4` / `Letter`), typography (`Clean Sans` / `Classic Serif`), `Compact spacing` toggle, `Clickable URLs` toggle.
     - **CV Profile Overrides & Extras**: Phone number input, Headline override input, Formal Summary textarea override (with character count & note that blank inherits from Profile Bio), Languages repeatable rows (Name + Proficiency + Add/Remove).
     - **Sections & Ordering**: Checklist for all sections with Toggle Switch + Move Up / Move Down order buttons (`sectionOrder`), plus concise per-section limits (`Max Projects`, `Featured Projects only` toggle, `Include Project Highlights` toggle, `Max Roles`, `Max Certificates`, `Include Certificate Details` toggle).
   - **Right Column (`CvPreviewSheet.tsx`):**
     - Responsive crisp white A4/Letter sheet preview showing live rendered CV output updates instantaneously as you edit sections OR CV settings! Includes clean Zoom/Scale fit for desktop & mobile viewports (`overflow-x-hidden`).
3. Ensure `Admin`'s `draft` normalization preserves `cvSettings` cleanly on load, Reset restores `defaultPortfolio` (including `defaultCvSettings`), and Export/Import JSON preserves `cvSettings`.

### 6.5 Public Contact CTA (`src/routes/index.tsx` -> `Contact()`)

In `function Contact()`:
- Read `{ profile, cvSettings } = usePortfolio()` (falling back safely with `normalizePortfolio` or default settings if `cvSettings` is undefined).
- Render button when `(cvSettings?.enabled ?? true)` right inside the button flex row alongside `Copy email`, `GitHub`, `LinkedIn`, `My website`:
  - Matches existing pill styling (`cursor-target inline-flex items-center gap-2 rounded-full border ...`), uses existing Lucide icon (`FileDown` / `Check` / `Loader2`), accessible `aria-label`, disabled state while generating (`pending` guard preventing double-clicks), transient success indicator ("CV downloaded!"), and graceful inline error message if generation ever throws.

---

## 7. Verification Plan

1. **Unit tests (`vitest`):**
   - `src/test/portfolio-data.test.ts`:
     - Verify `defaultPortfolio.cvSettings` exists and passes `isPortfolioContent`.
     - Verify legacy payloads *without* `cvSettings` still pass `getPortfolioValidationErrors` and get hydrated with defaults by `normalizePortfolio`.
     - Verify invalid `cvSettings` fields return clear validation errors.
   - `src/test/cv-generator.test.ts`:
     - Verify `buildCvDocumentModel` respects toggled sections, `sectionOrder`, `featuredProjectsOnly`, item limits, and `headlineOverride`/`summaryOverride` fallbacks.
     - Verify `sanitizePdfText` removes emojis and preserves normal punctuation cleanly.
     - Verify `generateCvPdfBlob` runs without runtime errors in Node/jsdom and produces a valid non-empty `%PDF-` binary header!
2. **Static & Build checks:**
   - `npx tsc --noEmit` (zero TS errors under `exactOptionalPropertyTypes`).
   - `npm run lint` (clean lint).
   - `npm test` (all tests pass).
   - `npm run build` (verify `jspdf` code-splits into an async chunk cleanly and client + Nitro SSR builds succeed with zero SSR `window` errors!).
3. **Real Browser Check (required by `senior-frontend`):**
   - Inspect `/` Contact section at 375px and 1280px widths, verify keyboard Tab focus on `Download CV` button, click it and verify no console errors and download triggers cleanly.
   - Inspect `/admin` `CV Generator` tab at desktop and phone widths, toggle a setting / edit phone & language, verify live preview updates immediately, test `Download Test PDF` button, and clean up temporary verification artifacts.

---

## 8. What's Left to the Builder

- Installing the exact `jspdf` package version compatible with Vite 8 & TypeScript.
- Choosing exact spacing ratios (line heights in `pt`, margins in `compactMode` vs standard) for crisp visual balance during verification by visually inspecting a generated PDF sample.
- Styling exact Tailwind utility classes inside `AdminCvSettingsPanel.tsx` and `CvPreviewSheet.tsx` matching existing `/admin` card tokens.
