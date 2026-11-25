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
  GraduationCap,
  Image as ImageIcon,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  ShieldAlert,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { SiteLayout } from "@/components/portfolio/SiteLayout";
import {
  defaultPortfolio,
  isPortfolioContent,
  getPortfolioValidationErrors,
  normalizePortfolio,
  type PortfolioContent,
} from "@/data/portfolio";
import { getEducationLogo } from "@/lib/education";
import { JellyRadio } from "@/components/ui/JellyRadio";
import {
  loadPortfolio,
  resetPortfolio,
  savePortfolio,
  savePortfolioToRemote,
  uploadImageToCloudinaryStorage,
  getBackendStatus,
  syncPortfolioFromRemote,
  fileToDataUri,
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
  | "education"
  | "projects"
  | "events"
  | "creative"
  | "certificates"
  | "skills"
  | "roles"
  | "journey";
type View = "profile" | Collection;
type Field = {
  key: string;
  label: string;
  type?: "textarea" | "array" | "checkbox" | "status" | "image" | "gallery" | "logo";
};
const sections: { value: View; label: string }[] = [
  { value: "profile", label: "Profile" },
  { value: "education", label: "Education" },
  { value: "projects", label: "Projects" },
  { value: "events", label: "Events" },
  { value: "creative", label: "Creative works" },
  { value: "certificates", label: "Certificates" },
  { value: "skills", label: "Skills" },
  { value: "roles", label: "Leadership" },
  { value: "journey", label: "Journey" },
];
const fields: Record<Collection, Field[]> = {
  education: [
    { key: "institution", label: "Institution / University" },
    { key: "degree", label: "Degree / Program" },
    { key: "field", label: "Department / Field of study" },
    { key: "period", label: "Period (e.g. 2023 – Present)" },
    { key: "logo", label: "Institution crest & watermark logo", type: "logo" },
    { key: "description", label: "Description / Overview", type: "textarea" },
    { key: "highlights", label: "Highlights / Focus areas (comma separated)", type: "array" },
  ],
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
    { key: "images_0", label: "Primary image (card foreground)", type: "image" },
    { key: "images_1", label: "Secondary image (card hover)", type: "image" },
  ],
  events: [
    { key: "slug", label: "URL slug" },
    { key: "title", label: "Event title" },
    { key: "group", label: "Community / group" },
    { key: "role", label: "Your role" },
    { key: "year", label: "Year" },
    { key: "summary", label: "Summary", type: "textarea" },
    { key: "highlights", label: "Highlights (comma separated)", type: "array" },
    { key: "images", label: "Event flyers & photo gallery", type: "gallery" },
  ],
  creative: [
    { key: "slug", label: "Unique slug" },
    { key: "title", label: "Work title" },
    { key: "category", label: "Category" },
    { key: "context", label: "Description", type: "textarea" },
    { key: "year", label: "Year" },
    { key: "image", label: "Primary cover flyer (single preview)", type: "image" },
    { key: "images", label: "Flyer collection / event photo gallery", type: "gallery" },
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
    { key: "slug", label: "Unique slug (optional)" },
    { key: "title", label: "Role title" },
    { key: "group", label: "Group / event" },
    { key: "organization", label: "Organization / University" },
    { key: "description", label: "Short description", type: "textarea" },
    { key: "details", label: "Detailed description", type: "textarea" },
    { key: "highlights", label: "Key highlights / impact (comma separated)", type: "array" },
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
  education: {
    institution: "Wayamba University of Sri Lanka",
    degree: "B.Sc. (Hons) Undergraduate",
    field: "Department of Electronics, Faculty of Applied Sciences",
    period: "2023 – Present",
    description: "",
    highlights: [],
    logo: "",
  },
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
    images: ["", ""],
  },
  events: {
    slug: "new-event",
    title: "",
    group: "",
    role: "",
    year: "2026",
    summary: "",
    highlights: [],
    images: [],
  },
  creative: {
    slug: "new-work",
    title: "",
    category: "",
    context: "",
    year: "2026",
    image: "",
    images: [],
  },
  certificates: { title: "", issuer: "", year: "2026", url: "", image: "" },
  skills: { group: "New skill group", items: [] },
  roles: { slug: "", title: "", group: "", organization: "", description: "", details: "", highlights: [], year: "2026" },
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

function GalleryUploadField({
  id,
  field,
  value,
  onChange,
  onSetCover,
}: {
  id: string;
  field: Field;
  value: unknown;
  onChange: (v: string[]) => void;
  onSetCover?: ((url: string) => void) | undefined;
}) {
  const images = Array.isArray(value) ? (value as string[]).filter(Boolean) : [];
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMultipleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const validFiles = files.filter((f) => f.size <= 15 * 1024 * 1024);
    if (validFiles.length < files.length) {
      setUploadError("Some files were skipped because they exceed 15MB.");
    } else {
      setUploadError(null);
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const currentFile = validFiles[i];
      if (!currentFile) continue;
      setUploadProgress(`Uploading ${i + 1} of ${validFiles.length}...`);
      try {
        const res = await uploadImageToCloudinaryStorage(currentFile, "portfolio/media");
        if (res.success && res.url) {
          uploadedUrls.push(res.url);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setUploading(false);
    setUploadProgress("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (uploadedUrls.length > 0) {
      const nextImages = [...images, ...uploadedUrls];
      onChange(nextImages);
      if (onSetCover && images.length === 0 && uploadedUrls[0]) {
        onSetCover(uploadedUrls[0]);
      }
    }
  };

  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    const nextImages = [...images, trimmed];
    onChange(nextImages);
    setUrlInput("");
    if (onSetCover && images.length === 0) {
      onSetCover(trimmed);
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const clearAll = () => {
    if (confirm("Remove all flyers/photos from this gallery?")) {
      onChange([]);
    }
  };

  return (
    <div id={id} className="space-y-3 rounded-2xl border border-border/80 bg-background/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ImageIcon size={14} className="text-primary" />
          <span className="font-mono text-xs font-semibold text-foreground">{field.label}</span>
          <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.2 font-mono text-[10px] text-primary">
            {images.length} {images.length === 1 ? "flyer" : "flyers"}
          </span>
        </div>
        <span className="font-mono text-[10px] text-primary/80 flex items-center gap-1">
          <Cloud size={11} /> Cloudinary multi-upload
        </span>
      </div>

      {/* Upload button and URL paste */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleMultipleFiles}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary/20 hover:border-primary disabled:opacity-50 transition-all shrink-0 cursor-target"
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin text-primary" />
              <span>{uploadProgress || "Uploading flyers..."}</span>
            </>
          ) : (
            <>
              <Upload size={14} />
              <span>Upload Flyers / Photos</span>
            </>
          )}
        </button>

        <div className="flex flex-1 gap-1.5">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="Or paste image URL (https://...)"
            className="flex-1 rounded-xl border bg-background px-3 py-2 text-xs font-mono outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={addUrl}
            disabled={!urlInput.trim()}
            className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-medium hover:border-primary hover:text-primary disabled:opacity-40 transition-colors shrink-0"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Add URL</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <p className="font-mono text-xs text-destructive bg-destructive/10 p-2.5 rounded-lg border border-destructive/20">
          ⚠️ {uploadError}
        </p>
      )}

      {/* Gallery Grid */}
      {images.length > 0 ? (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Flyers in this gallery (hover thumbnail to manage):</span>
            <button
              type="button"
              onClick={clearAll}
              className="text-destructive/80 hover:text-destructive hover:underline"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((imgUrl, idx) => (
              <div
                key={`${imgUrl}-${idx}`}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-border/80 bg-black/40 shadow-xs hover:border-primary/60 transition-all"
              >
                <img
                  src={imgUrl}
                  alt={`Flyer ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.4";
                  }}
                />
                {/* Index badge */}
                <span className="absolute top-1.5 left-1.5 rounded-md bg-black/70 backdrop-blur-xs px-1.5 py-0.5 font-mono text-[10px] text-white/90">
                  #{idx + 1}
                </span>
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end gap-1">
                    <a
                      href={imgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-black/60 p-1.5 text-white/80 hover:text-white transition-colors"
                      title="Open full size"
                    >
                      <ExternalLink size={12} />
                    </a>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="rounded-lg bg-red-500/80 p-1.5 text-white hover:bg-red-600 transition-colors"
                      title="Delete flyer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  {onSetCover && (
                    <button
                      type="button"
                      onClick={() => onSetCover(imgUrl)}
                      className="w-full rounded-md bg-white/20 hover:bg-primary hover:text-primary-foreground backdrop-blur-xs py-1 text-[10px] font-mono font-medium text-white transition-colors text-center"
                    >
                      Set as cover
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/70 p-6 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            No flyers or photos added yet for this event.
          </p>
          <p className="text-[11px] text-muted-foreground/70 mt-1">
            Click "Upload Flyers / Photos" to select all your flyers at once.
          </p>
        </div>
      )}
    </div>
  );
}

const PRESET_LOGOS = [
  {
    id: "wusl",
    name: "Wayamba University (WUSL)",
    short: "WUSL",
    path: "/assets/education/wusl.svg",
    desc: "Navy & Gold crest",
  },
  {
    id: "ananda",
    name: "Ananda College",
    short: "Ananda",
    path: "/assets/education/ananda.svg",
    desc: "Maroon & Gold crest",
  },
  {
    id: "rajasinghe",
    name: "Rajasinghe Central College",
    short: "Rajasinghe",
    path: "/assets/education/rajasinghe.svg",
    desc: "Green & Gold crest",
  },
  {
    id: "default",
    name: "Default Academic Crest",
    short: "Universal",
    path: "/assets/education/default.svg",
    desc: "Graduation cap seal",
  },
] as const;

function InstitutionLogoField({
  id,
  field,
  institution,
  value,
  onChange,
}: {
  id: string;
  field: Field;
  institution: string;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const base =
    "w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const strValue = typeof value === "string" ? value.trim() : "";
  const resolvedLogo = getEducationLogo({ institution, logo: strValue });

  const activePreset = PRESET_LOGOS.find((p) => p.path === strValue);
  const isAutoDetected = !strValue;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Logo file size should be less than 8MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    try {
      // 1. Try Cloudinary first
      const result = await uploadImageToCloudinaryStorage(file, "portfolio/education");
      if (result.success && result.url) {
        onChange(result.url);
        setUploadError(null);
      } else {
        // 2. Graceful fallback: convert to base64 data URI so user is NEVER blocked
        const dataUri = await fileToDataUri(file);
        onChange(dataUri);
        setUploadError(null);
      }
    } catch (err) {
      // Even on network error, embed as data URI
      try {
        const dataUri = await fileToDataUri(file);
        onChange(dataUri);
        setUploadError(null);
      } catch {
        setUploadError(err instanceof Error ? err.message : "Failed to load logo file.");
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-primary/20 bg-secondary/10 p-4 text-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GraduationCap size={15} className="text-primary" />
          <span className="font-mono text-xs font-semibold text-foreground">
            {field.label}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-primary/80">
          <Sparkles size={11} /> Card Watermark Crest
        </span>
      </div>

      {/* Active Logo Summary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-xl border bg-card/60 p-3.5">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-primary/30 bg-secondary/50 p-1.5 shadow-sm flex items-center justify-center">
            <img
              src={resolvedLogo}
              alt="Active crest"
              className="h-full w-full object-contain filter contrast-125 drop-shadow"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/assets/education/default.svg";
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-medium text-foreground truncate">
                {activePreset
                  ? activePreset.name
                  : isAutoDetected
                  ? `Auto Preset (${institution || "Default"})`
                  : "Custom Uploaded Crest"}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                  strValue
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-muted text-muted-foreground border"
                }`}
              >
                {strValue ? "Custom Selected" : "Auto Smart Preset"}
              </span>
            </div>
            <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
              {resolvedLogo}
            </p>
          </div>
        </div>

        {/* Actions for current logo */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={resolvedLogo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink size={12} /> View vector
          </a>
          {strValue && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 rounded-lg border border-border/80 px-2.5 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              title="Reset to smart auto-matching by institution name"
            >
              <RotateCcw size={12} /> Reset to auto
            </button>
          )}
        </div>
      </div>

      {/* Preset Crests Grid */}
      <div className="space-y-2">
        <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Quick Preset Logos (One-click apply):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_LOGOS.map((preset) => {
            const isSelected = strValue === preset.path;
            const isAutoActive = !strValue && resolvedLogo === preset.path;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChange(preset.path)}
                className={`group flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 ring-1 ring-primary/40 shadow-sm"
                    : isAutoActive
                    ? "border-primary/50 bg-accent/20"
                    : "border-border/70 bg-card/40 hover:border-primary/40 hover:bg-accent/40"
                }`}
              >
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-secondary/60 p-1 flex items-center justify-center">
                  <img
                    src={preset.path}
                    alt={preset.name}
                    className="h-full w-full object-contain filter contrast-125"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs font-medium text-foreground">
                    {preset.short}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {isSelected ? "Active" : isAutoActive ? "Auto active" : preset.desc}
                  </p>
                </div>
                {isSelected && <Check size={13} className="text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Custom Logo & Image URL */}
      <div className="space-y-2 pt-1 border-t border-border/40">
        <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Upload Custom Crest or Paste Image URL:
        </span>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id={id}
            className={`${base} flex-1 font-mono text-xs`}
            placeholder="/assets/education/wusl.svg or https://res.cloudinary.com/..."
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
          />
          <input
            type="file"
            accept="image/svg+xml,image/png,image/jpeg,image/webp"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-accent/40 px-4 py-2.5 text-xs font-medium hover:bg-accent hover:border-primary disabled:opacity-50 shrink-0 transition-colors"
          >
            {uploading ? (
              <>
                <Loader2 size={13} className="animate-spin text-primary" /> Uploading...
              </>
            ) : (
              <>
                <Upload size={13} className="text-primary" /> Upload Logo File
              </>
            )}
          </button>
        </div>

        {uploadError && (
          <p className="font-mono text-xs text-destructive bg-destructive/10 p-2.5 rounded-lg border border-destructive/20">
            ⚠️ {uploadError}
          </p>
        )}
      </div>
    </div>
  );
}

function FieldInput({
  id,
  field,
  value,
  record,
  onChange,
  onSetCover,
}: {
  id: string;
  field: Field;
  value: unknown;
  record?: Record<string, unknown>;
  onChange: (v: unknown) => void;
  onSetCover?: (url: string) => void;
}) {
  const base =
    "w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";

  if (field.type === "gallery") {
    return (
      <GalleryUploadField
        id={id}
        field={field}
        value={value}
        onChange={(urls) => onChange(urls)}
        onSetCover={onSetCover}
      />
    );
  }

  if (field.type === "logo" || field.key === "logo") {
    return (
      <InstitutionLogoField
        id={id}
        field={field}
        institution={String(record?.["institution"] || "")}
        value={value}
        onChange={onChange}
      />
    );
  }

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
      const current = ((prev[collection] as unknown as Record<string, unknown>[]) ?? []);
      const list = current.map((row, i) => {
        if (i !== index) return row;
        // Handle virtual images_0 / images_1 keys → store in images tuple
        if (key === "images_0" || key === "images_1") {
          const slot = key === "images_0" ? 0 : 1;
          const imgs = Array.isArray(row["images"]) ? [...row["images"]] : ["", ""];
          imgs[slot] = value;
          return { ...row, images: imgs as [string, string] };
        }
        return { ...row, [key]: value };
      });
      return { ...prev, [collection]: list } as PortfolioContent;
    });
    setMessage("Unsaved changes");
  };

  const addRow = (collection: Collection) => {
    setDraft(
      (prev) => {
        const current = ((prev[collection] as unknown as Record<string, unknown>[]) ?? []);
        return {
          ...prev,
          [collection]: [...current, { ...emptyRows[collection] }],
        } as PortfolioContent;
      },
    );
    setMessage("Unsaved changes");
  };

  const removeRow = (collection: Collection, index: number) => {
    setDraft(
      (prev) => {
        const current = ((prev[collection] as unknown as Record<string, unknown>[]) ?? []);
        return {
          ...prev,
          [collection]: current.filter((_, i) => i !== index),
        } as PortfolioContent;
      },
    );
    setMessage("Unsaved changes");
  };

  const saveToDatabase = async () => {
    setIsSavingDb(true);
    setMessage("Validating and saving to Neon Database...");
    try {
      const normalized = normalizePortfolio(draft);
      setDraft(normalized);
      const errors = getPortfolioValidationErrors(normalized);
      if (errors.length > 0) {
        setMessage(`⚠️ Validation error before saving: ${errors[0]}`);
        setIsSavingDb(false);
        return;
      }
      const res = await savePortfolioToRemote(normalized);
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
      const normalized = normalizePortfolio(draft);
      setDraft(normalized);
      savePortfolio(normalized);
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
    const normalized = normalizePortfolio(draft);
    const blob = new Blob([JSON.stringify(normalized, null, 2)], { type: "application/json" });
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
      const normalized = normalizePortfolio(parsed);
      const errors = getPortfolioValidationErrors(normalized);
      if (errors.length > 0) throw new Error(errors[0]);
      setDraft(normalized);
      setMessage("Imported into the editor. Click 'Save to Neon Database' to apply.");
    } catch (err) {
      setMessage(`Import failed: ${err instanceof Error ? err.message : "Upload a valid exported portfolio JSON file."}`);
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
  items?: PortfolioContent[Collection];
  onChange: (name: Collection, index: number, key: string, value: unknown) => void;
  onRemove: (name: Collection, index: number) => void;
  onAdd: (name: Collection) => void;
}) {
  const safeItems = (items as unknown as Record<string, unknown>[]) ?? [];
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl capitalize">
            {name === "creative" ? "Creative works" : name}
          </h2>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {safeItems.length} entries · Edit below
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

      {!safeItems.length && (
        <p className="mb-5 rounded-2xl border border-dashed p-7 text-sm text-muted-foreground">
          No entries yet. Use Add entry to create your first one.
        </p>
      )}

      {name === "education" && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs text-muted-foreground">
          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="space-y-1">
            <strong className="text-foreground">Institution Crest Watermarks:</strong>
            <p className="leading-relaxed">
              Each academic card displays a soft, light, blurred watermark crest on the right. You can select one of the built-in official vector presets (WUSL, Ananda College, Rajasinghe Central College, Default Crest) or upload your own school/university badge for any entry below.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5">
        {safeItems.map((row, i) => {
          const record = row as unknown as Record<string, unknown>;
          const title = String(
            record["institution"] ||
              record["degree"] ||
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
                {fields[name].map((field) => {
                  // Resolve virtual images_0 / images_1 keys from the images tuple
                  let fieldValue = record[field.key];
                  if (field.key === "images_0") {
                    fieldValue = Array.isArray(record["images"]) ? record["images"][0] : "";
                  } else if (field.key === "images_1") {
                    fieldValue = Array.isArray(record["images"]) ? record["images"][1] : "";
                  }
                  return (
                    <div
                      key={field.key}
                      className={
                        field.type === "textarea" ||
                        field.type === "image" ||
                        field.type === "gallery" ||
                        field.type === "logo" ||
                        field.key === "logo"
                          ? "sm:col-span-2"
                          : ""
                      }
                    >
                      <FieldInput
                        id={`${name}-${i}-${field.key}`}
                        field={field}
                        value={fieldValue}
                        record={record}
                        onChange={(value) => onChange(name, i, field.key, value)}
                        onSetCover={(url) => onChange(name, i, "image", url)}
                      />
                    </div>
                  );
                })}
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
