import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, type ChangeEvent } from "react";
import {
  ArrowLeft,
  Check,
  Cloud,
  Database,
  Download,
  ExternalLink,
  FileJson,
  Loader2,
  RotateCcw,
  Save,
  ShieldAlert,
  Upload,
} from "lucide-react";
import { SiteLayout } from "@/components/portfolio/SiteLayout";
import { defaultPortfolio, isPortfolioContent, type PortfolioContent } from "@/data/portfolio";
import { JellyRadio } from "@/components/ui/JellyRadio";
import {
  loadPortfolio,
  resetPortfolio,
  savePortfolio,
  savePortfolioToRemote,
  uploadImageToCloudinaryStorage,
  getBackendStatus,
  syncPortfolioFromRemote,
} from "@/data/use-portfolio";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Content Studio & Cloud Admin — Binoj Charuka" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

type Collection =
  "projects" | "events" | "creative" | "certificates" | "skills" | "roles" | "journey";
type View = "profile" | Collection;
type Field = {
  key: string;
  label: string;
  type?: "textarea" | "array" | "checkbox" | "status" | "image";
};
const sections: { value: View; label: string }[] = [
  { value: "profile", label: "Profile" },
  { value: "projects", label: "Projects" },
  { value: "events", label: "Events" },
  { value: "creative", label: "Creative works" },
  { value: "certificates", label: "Certificates" },
  { value: "skills", label: "Skills" },
  { value: "roles", label: "Leadership" },
  { value: "journey", label: "Journey" },
];
const fields: Record<Collection, Field[]> = {
  projects: [
    { key: "slug", label: "URL slug" },
    { key: "name", label: "Project name" },
    { key: "tagline", label: "Tagline" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "categories", label: "Categories (comma separated)", type: "array" },
    { key: "year", label: "Year" },
    { key: "status", label: "Status", type: "status" },
    { key: "liveUrl", label: "Live URL" },
    { key: "sourceUrl", label: "Source URL" },
    { key: "highlights", label: "Highlights (comma separated)", type: "array" },
    { key: "featured", label: "Featured on home", type: "checkbox" },
  ],
  events: [
    { key: "slug", label: "URL slug" },
    { key: "title", label: "Event title" },
    { key: "group", label: "Community / group" },
    { key: "role", label: "Your role" },
    { key: "year", label: "Year" },
    { key: "summary", label: "Summary", type: "textarea" },
    { key: "highlights", label: "Highlights (comma separated)", type: "array" },
  ],
  creative: [
    { key: "slug", label: "Unique slug" },
    { key: "title", label: "Work title" },
    { key: "category", label: "Category" },
    { key: "context", label: "Description", type: "textarea" },
    { key: "year", label: "Year" },
    { key: "image", label: "Image URL or Cloudinary upload", type: "image" },
  ],
  certificates: [
    { key: "title", label: "Certificate title" },
    { key: "issuer", label: "Issuer" },
    { key: "year", label: "Year" },
    { key: "url", label: "Credential link" },
    { key: "image", label: "Certificate Image URL", type: "image" },
  ],
  skills: [
    { key: "group", label: "Skill group" },
    { key: "items", label: "Skills (comma separated)", type: "array" },
  ],
  roles: [
    { key: "title", label: "Role" },
    { key: "group", label: "Group / event" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "year", label: "Year" },
  ],
  journey: [
    { key: "when", label: "When" },
    { key: "what", label: "Milestone" },
    { key: "where", label: "Where" },
    { key: "detail", label: "Details", type: "textarea" },
  ],
};
const emptyRows: Record<Collection, Record<string, unknown>> = {
  projects: {
    slug: "new-project",
    name: "",
    tagline: "",
    description: "",
    categories: [],
    year: "2026",
    status: "In progress",
    liveUrl: "",
    sourceUrl: "",
    highlights: [],
    featured: false,
  },
  events: {
    slug: "new-event",
    title: "",
    group: "",
    role: "",
    year: "2026",
    summary: "",
    highlights: [],
  },
  creative: {
    slug: "new-work",
    title: "",
    category: "",
    context: "",
    year: "2026",
    image: "",
  },
  certificates: { title: "", issuer: "", year: "2026", url: "", image: "" },
  skills: { group: "New skill group", items: [] },
  roles: { title: "", group: "", description: "", year: "2026" },
  journey: { when: "", what: "", where: "", detail: "" },
};
const profileFields: Field[] = [
  { key: "name", label: "Full name" },
  { key: "shortName", label: "Display name" },
  { key: "headline", label: "Headline" },
  { key: "intro", label: "Hero introduction", type: "textarea" },
  { key: "bio", label: "About me", type: "textarea" },
  { key: "location", label: "Location" },
  { key: "university", label: "University" },
  { key: "focus", label: "Focus areas" },
  { key: "availability", label: "Availability line" },
  { key: "portrait", label: "Portrait image (Cloudinary or /path)", type: "image" },
  { key: "email", label: "Public email (optional)" },
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn (optional)" },
  { key: "website", label: "Website" },
];

function ImageUploadField({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const base =
    "w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image file size should be less than 10MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    try {
      const folder = field.key === "portrait" ? "portfolio/profile" : "portfolio/media";
      const result = await uploadImageToCloudinaryStorage(file, folder);
      if (result.success && result.url) {
        onChange(result.url);
        setUploadError(null);
      } else {
        setUploadError(
          result.error ||
            "Failed to upload image. Please verify your Cloudinary credentials in .env",
        );
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const strValue = String(value ?? "");

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{field.label}</span>
        <span className="font-mono text-[10px] text-primary/80 flex items-center gap-1">
          <Cloud size={11} /> Cloudinary storage
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id={id}
          className={`${base} flex-1`}
          placeholder="https://res.cloudinary.com/... or /path.jpg"
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-accent/40 px-3.5 py-2 text-xs font-medium hover:bg-accent hover:border-primary disabled:opacity-50 shrink-0 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 size={13} className="animate-spin text-primary" /> Uploading...
            </>
          ) : (
            <>
              <Upload size={13} className="text-primary" /> Upload to Cloudinary
            </>
          )}
        </button>
      </div>

      {uploadError && (
        <p className="font-mono text-xs text-destructive bg-destructive/10 p-2.5 rounded-lg border border-destructive/20">
          ⚠️ {uploadError}
        </p>
      )}

      {strValue && (
        <div className="flex items-center gap-3 p-2 rounded-xl border bg-muted/20">
          <img
            src={strValue}
            alt="Preview"
            className="h-12 w-12 rounded-lg object-cover border bg-background shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = "none";
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs text-foreground">{strValue}</p>
            <a
              href={strValue}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-0.5"
            >
              Open full image <ExternalLink size={10} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldInput({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const base =
    "w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";

  if (field.type === "image" || field.key === "image" || field.key === "portrait") {
    return <ImageUploadField id={id} field={field} value={value} onChange={onChange} />;
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 text-sm">
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="accent-primary"
        />
        {field.label}
      </label>
    );
  }

  return (
    <label className="block text-sm">
      <span className="mb-2 block font-mono text-xs text-muted-foreground">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea
          id={id}
          rows={3}
          className={base}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === "status" ? (
        <div className="pt-1">
          <JellyRadio
            items={["Live", "In progress", "Concept"]}
            value={String(value || "In progress")}
            onChange={(v) => onChange(v)}
            size="sm"
            swell={0.14}
            bounce={0.25}
          />
        </div>
      ) : (
        <input
          id={id}
          className={base}
          value={
            field.type === "array"
              ? Array.isArray(value)
                ? value.join(", ")
                : ""
              : String(value ?? "")
          }
          onChange={(e) =>
            onChange(
              field.type === "array"
                ? e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : e.target.value,
            )
          }
        />
      )}
    </label>
  );
}

function Admin() {
  const [draft, setDraft] = useState<PortfolioContent>(defaultPortfolio);
  const [view, setView] = useState<View>("profile");
  const [message, setMessage] = useState("Loading portfolio...");
  const [isSavingDb, setIsSavingDb] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{
    dbConfigured: boolean;
    cloudinaryConfigured: boolean;
  } | null>(null);

  useEffect(() => {
    // 1. Initial local load
    setDraft(loadPortfolio());
    setMessage("Edit and save to Neon PostgreSQL or locally.");

    // 2. Sync from database
    syncPortfolioFromRemote().then((remoteContent) => {
      setDraft(remoteContent);
    });

    // 3. Check Neon & Cloudinary status
    getBackendStatus().then((status) => {
      setBackendStatus(status);
    });
  }, []);

  const updateProfile = (field: string, value: unknown) => {
    setDraft((prev) => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
    setMessage("Unsaved changes");
  };

  const editRow = (collection: Collection, index: number, key: string, value: unknown) => {
    setDraft((prev) => {
      const list = prev[collection].map((row, i) => (i === index ? { ...row, [key]: value } : row));
      return { ...prev, [collection]: list } as PortfolioContent;
    });
    setMessage("Unsaved changes");
  };

  const addRow = (collection: Collection) => {
    setDraft(
      (prev) =>
        ({
          ...prev,
          [collection]: [...prev[collection], { ...emptyRows[collection] }],
        }) as PortfolioContent,
    );
    setMessage("Unsaved changes");
  };

  const removeRow = (collection: Collection, index: number) => {
    setDraft(
      (prev) =>
        ({
          ...prev,
          [collection]: prev[collection].filter((_, i) => i !== index),
        }) as PortfolioContent,
    );
    setMessage("Unsaved changes");
  };

  const saveToDatabase = async () => {
    setIsSavingDb(true);
    setMessage("Saving to Neon Database...");
    try {
      const res = await savePortfolioToRemote(draft);
      if (res.success) {
        setMessage("✅ Saved permanently to Neon PostgreSQL database! Live site updated.");
      } else {
        setMessage(`⚠️ Database save error: ${res.error || "Check your database connection."}`);
      }
    } catch (err) {
      setMessage(`⚠️ Error saving: ${err instanceof Error ? err.message : "Server error"}`);
    } finally {
      setIsSavingDb(false);
    }
  };

  const saveLocalOnly = () => {
    try {
      savePortfolio(draft);
      setMessage("Saved locally in this browser.");
    } catch {
      setMessage("Could not save to browser storage.");
    }
  };

  const reset = () => {
    if (!window.confirm("Reset edits and restore default content?")) return;
    try {
      resetPortfolio();
      setDraft(defaultPortfolio);
      setMessage("Restored bundled content in this browser.");
    } catch {
      setMessage("Could not clear browser storage.");
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "portfolio-content.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Content JSON exported. Keep this file as your backup.");
  };

  const importJson = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isPortfolioContent(parsed)) throw new Error("Invalid portfolio structure");
      setDraft(parsed);
      setMessage("Imported into the editor. Click 'Save to Neon Database' to apply.");
    } catch {
      setMessage("Import failed. Upload a valid exported portfolio JSON file.");
    }
    e.target.value = "";
  };

  return (
    <SiteLayout>
      <div className="border-b py-12 md:py-16">
        <a
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary"
        >
          <ArrowLeft size={15} /> Back to portfolio
        </a>
        <p className="mt-8 font-mono text-xs uppercase tracking-widest text-primary">
          Neon DB & Cloudinary Content Studio
        </p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl">
          Content Studio<span className="text-primary">.</span>
        </h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
          Manage your portfolio content backed by <strong>Neon PostgreSQL</strong> and store images
          in <strong>Cloudinary</strong>. Edits saved here update your live database permanently
          across all devices.
        </p>

        {/* Integration Status Badges */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-xs font-mono">
            <Database size={13} className="text-emerald-500" />
            <span>Neon DB:</span>
            <span
              className={
                backendStatus?.dbConfigured !== false
                  ? "text-emerald-500 font-semibold"
                  : "text-amber-500 font-semibold"
              }
            >
              {backendStatus?.dbConfigured !== false ? "Connected" : "Check DATABASE_URL"}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-xs font-mono">
            <Cloud size={13} className="text-sky-500" />
            <span>Cloudinary Storage:</span>
            <span
              className={
                backendStatus?.cloudinaryConfigured
                  ? "text-emerald-500 font-semibold"
                  : "text-amber-500 font-semibold"
              }
            >
              {backendStatus?.cloudinaryConfigured ? "Configured" : "Add keys to .env"}
            </span>
          </div>
        </div>
      </div>

      {!backendStatus?.cloudinaryConfigured && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-4 text-xs text-muted-foreground">
          <Cloud className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
          <p>
            <strong className="text-foreground">Cloudinary Image Storage:</strong> To upload photos
            directly from this studio, configure{" "}
            <code className="font-mono text-foreground">CLOUDINARY_CLOUD_NAME</code>,{" "}
            <code className="font-mono text-foreground">CLOUDINARY_API_KEY</code>, and{" "}
            <code className="font-mono text-foreground">CLOUDINARY_API_SECRET</code> in your local{" "}
            <code className="font-mono text-foreground">.env</code> file.
          </p>
        </div>
      )}

      {/* Main Actions Bar */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          onClick={saveToDatabase}
          disabled={isSavingDb}
          className="shine inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isSavingDb ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving to Neon DB...
            </>
          ) : (
            <>
              <Database size={16} /> Save to Neon Database
            </>
          )}
        </button>

        <button
          onClick={saveLocalOnly}
          className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm hover:bg-accent transition-colors"
        >
          <Save size={16} /> Save draft locally
        </button>

        <button
          onClick={exportJson}
          className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm hover:bg-accent transition-colors"
        >
          <Download size={16} /> Export JSON
        </button>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-3 text-sm hover:bg-accent transition-colors">
          <Upload size={16} /> Import JSON
          <input
            type="file"
            accept=".json,application/json"
            className="sr-only"
            onChange={importJson}
          />
        </label>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mt-4 flex items-center gap-2 font-mono text-xs text-muted-foreground"
      >
        <Check size={14} className="text-primary" />
        {message}
      </p>

      <div className="grid gap-8 py-12 md:grid-cols-[190px_minmax(0,1fr)]">
        <aside>
          <nav
            aria-label="Content sections"
            className="flex flex-wrap gap-2 md:sticky md:top-24 md:flex-col"
          >
            {sections.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setView(value)}
                aria-current={view === value ? "page" : undefined}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  view === value
                    ? "border-primary bg-accent text-accent-foreground font-medium"
                    : "bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          {view === "profile" ? (
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="font-serif text-3xl">Your profile</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Set your bio, headlines, and portrait image. Upload portraits directly to Cloudinary
                or use any image link.
              </p>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {profileFields.map((field) => (
                  <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                    <FieldInput
                      id={`profile-${field.key}`}
                      field={field}
                      value={draft.profile[field.key as keyof PortfolioContent["profile"]]}
                      onChange={(v) => updateProfile(field.key, v)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <CollectionEditor
              name={view}
              items={draft[view]}
              onChange={editRow}
              onRemove={removeRow}
              onAdd={addRow}
            />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

function CollectionEditor({
  name,
  items,
  onChange,
  onRemove,
  onAdd,
}: {
  name: Collection;
  items: PortfolioContent[Collection];
  onChange: (name: Collection, index: number, key: string, value: unknown) => void;
  onRemove: (name: Collection, index: number) => void;
  onAdd: (name: Collection) => void;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl capitalize">
            {name === "creative" ? "Creative works" : name}
          </h2>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {items.length} entries · Edit below
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAdd(name)}
          className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Add entry
        </button>
      </div>

      {!items.length && (
        <p className="mb-5 rounded-2xl border border-dashed p-7 text-sm text-muted-foreground">
          No entries yet. Use Add entry to create your first one.
        </p>
      )}

      <div className="grid gap-5">
        {items.map((row, i) => {
          const record = row as unknown as Record<string, unknown>;
          const title = String(
            record["name"] ||
              record["title"] ||
              record["what"] ||
              record["group"] ||
              `Entry ${i + 1}`,
          );
          return (
            <div key={i} className="rounded-2xl border bg-card p-5 md:p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-xl">
                  {String(i + 1).padStart(2, "0")}. {title}
                </h3>
                <button
                  type="button"
                  onClick={() => onRemove(name, i)}
                  className="rounded-full border px-4 py-2 font-mono text-xs text-muted-foreground hover:border-destructive hover:text-destructive"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {fields[name].map((field) => (
                  <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                    <FieldInput
                      id={`${name}-${i}-${field.key}`}
                      field={field}
                      value={record[field.key]}
                      onChange={(value) => onChange(name, i, field.key, value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onAdd(name)}
        className="mt-6 w-full rounded-2xl border border-dashed px-5 py-4 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
      >
        + Add another {name === "skills" ? "group" : "entry"}
      </button>
    </div>
  );
}
