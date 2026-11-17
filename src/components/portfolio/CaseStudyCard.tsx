import React from "react";
import { ArrowUpRight, Lock } from "lucide-react";
import type { Project } from "@/data/portfolio";
import PixelSwap from "@/components/ui/PixelSwap";
import { SpotlightCard } from "@/components/SpotlightCard";
import { cn } from "@/lib/utils";

interface ProjectStat {
  number: string;
  text: string;
}

const PROJECT_PRESETS: Record<string, [string, string]> = {
  "pdf-mithura": [
    "/assets/projects/pdf-mithura-editor.jpg",
    "/assets/projects/pdf-mithura-preview.jpg",
  ],
  "gpa-calculator": [
    "/assets/projects/gpa-1.jpg",
    "/assets/projects/gpa-2.jpg",
  ],
  "ieeextreme-region-10": [
    "/assets/projects/xtreme-1.jpg",
    "/assets/projects/xtreme-2.jpg",
  ],
  "charu-design-studio": [
    "/assets/projects/studio-1.jpg",
    "/assets/projects/studio-2.jpg",
  ],
};

const PROJECT_STATS: Record<string, ProjectStat> = {
  "pdf-mithura": {
    number: "100%",
    text: "client-side processing with zero server data storage",
  },
  "gpa-calculator": {
    number: "4.0",
    text: "scale accuracy with real-time GPA forecasting and semester goal tracking",
  },
  "ieeextreme-region-10": {
    number: "R10",
    text: "regional coding competition hub connecting thousands of student developers",
  },
  "charu-design-studio": {
    number: "2026",
    text: "crafted digital experiences, interactive design systems and creative engineering",
  },
};

function getProjectStat(project: Project, index: number): ProjectStat {
  const preset = PROJECT_STATS[project.slug];
  if (preset) {
    return preset;
  }
  if (project.highlights && project.highlights.length > 0 && project.highlights[0]) {
    return {
      number: `${project.highlights.length}+`,
      text: project.highlights[0],
    };
  }
  return {
    number: `0${index + 1}`,
    text: project.tagline || "Web application designed for real-world usability",
  };
}

export interface CaseStudyCardProps {
  project: Project;
  index: number;
  total: number;
  className?: string;
}

export function CaseStudyCard({
  project,
  index,
  total,
  className,
}: CaseStudyCardProps) {
  const stat = getProjectStat(project, index);
  const preset = PROJECT_PRESETS[project.slug] || [
    "/assets/demo/day-sky.webp",
    "/assets/demo/night-sky.webp",
  ];
  const firstImg =
    project.images && project.images[0] && project.images[0].trim().length > 0
      ? project.images[0]
      : preset[0];
  const secondImg =
    project.images && project.images[1] && project.images[1].trim().length > 0
      ? project.images[1]
      : project.images && project.images[0] && project.images[0].trim().length > 0
      ? project.images[0]
      : preset[1];

  return (
    <SpotlightCard
      data-cursor-target
      data-cursor-label={project.name}
      className={cn(
        "cursor-target relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 dark:border-white/10 bg-card text-card-foreground p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl shadow-black/5 dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-300",
        className
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch">
        {/* Left Column: Case study info, typography, specs & actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-8">
          <div>
            {/* Top Micro Label */}
            <div className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-muted-foreground flex flex-wrap items-center gap-2">
              <span className="text-primary font-semibold">
                CASE STUDY {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-muted-foreground">
                {project.categories[0] ? `${project.categories[0].toUpperCase()} PROJECT` : "CLIENT PROJECT"}
              </span>
            </div>

            {/* Massive Bold Project Title */}
            <h3 className="mt-3 font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-tight leading-[1.05]">
              {project.name}
            </h3>

            {/* Subtitle / Tagline */}
            <p className="mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground max-w-xl">
              {project.description || project.tagline}
            </p>

            {/* Specs metadata table with horizontal dividers */}
            <div className="mt-6 sm:mt-8 border-t border-border/70 dark:border-border/40 divide-y divide-border/60 dark:divide-border/30 font-mono text-xs">
              <div className="py-2.5 sm:py-3 grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] items-center gap-3">
                <span className="uppercase tracking-wider text-muted-foreground font-mono text-[11px]">ROLE</span>
                <span className="font-sans text-xs sm:text-sm text-foreground font-medium">
                  {project.categories.includes("Web Tool") || project.categories.includes("Education")
                    ? "Creator & Full-stack Developer"
                    : project.categories.includes("IEEE")
                      ? "Webmaster & Lead UI Designer"
                      : "Lead Developer & Designer"}
                </span>
              </div>

              <div className="py-2.5 sm:py-3 grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] items-center gap-3">
                <span className="uppercase tracking-wider text-muted-foreground font-mono text-[11px]">STATUS</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-xs bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-xs bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                    {project.status.toUpperCase()}
                  </span>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors text-xs truncate max-w-[200px]"
                    >
                      {project.liveUrl.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
              </div>

              <div className="py-2.5 sm:py-3 grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] items-center gap-3">
                <span className="uppercase tracking-wider text-muted-foreground font-mono text-[11px]">STACK</span>
                <span className="font-sans text-xs sm:text-sm text-foreground font-medium">
                  {project.categories.join(" · ")}
                </span>
              </div>

              {project.sourceUrl ? (
                <div className="py-2.5 sm:py-3 grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] items-center gap-3">
                  <span className="uppercase tracking-wider text-muted-foreground font-mono text-[11px]">SOURCE</span>
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors text-xs truncate max-w-[220px]"
                  >
                    {project.sourceUrl.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              ) : project.highlights?.[0] ? (
                <div className="py-2.5 sm:py-3 grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] items-center gap-3">
                  <span className="uppercase tracking-wider text-muted-foreground font-mono text-[11px]">BUILT</span>
                  <span className="font-sans text-xs sm:text-sm text-foreground font-medium truncate">
                    {project.highlights[0]}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={`/projects/${encodeURIComponent(project.slug)}`}
              className="cursor-target group inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors"
              data-cursor-label="Case Study"
            >
              <span>Read the case study</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-target inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/80 dark:bg-secondary/50 px-3.5 py-1.5 font-mono text-xs text-foreground/90 dark:text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                data-cursor-label="Live Site"
              >
                <span>Visit live website</span>
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Stat callout, macOS Browser frame with PixelSwap */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          {/* Top Impact Metric */}
          <div className="flex items-baseline gap-4 sm:gap-6">
            <span className="font-sans font-black text-6xl sm:text-7xl lg:text-8xl text-foreground tracking-tight leading-none shrink-0">
              {stat.number}
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-snug max-w-[260px]">
              {stat.text}
            </p>
          </div>

          {/* macOS Browser Mockup Frame */}
          <div className="w-full rounded-xl sm:rounded-2xl border border-border dark:border-white/10 bg-slate-100 dark:bg-[#090b0e] overflow-hidden shadow-lg dark:shadow-2xl transition-all duration-300 group/mockup">
            {/* Window Chrome Header Bar */}
            <div className="flex items-center justify-between px-3.5 sm:px-4 py-2 sm:py-2.5 border-b border-border/80 dark:border-white/10 bg-slate-200/80 dark:bg-[#12161c]/90 backdrop-blur-md">
              {/* Traffic Light Dots */}
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              </div>

              {/* Address bar pill */}
              <div className="flex items-center gap-1.5 rounded-md border border-border dark:border-white/10 bg-white/90 dark:bg-black/40 px-3 py-0.5 text-[10px] sm:text-[11px] font-mono text-foreground/80 dark:text-muted-foreground/90 max-w-[240px] sm:max-w-[280px] truncate shadow-xs">
                <Lock size={10} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span className="truncate">
                  {project.liveUrl
                    ? project.liveUrl.replace(/^https?:\/\//, "")
                    : `${project.slug}.charudesignstudio.us`}
                </span>
              </div>

              <div className="w-8 hidden sm:block" />
            </div>

            {/* Mockup Screen Viewport with PixelSwap */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 dark:bg-black/90">
              <PixelSwap
                firstContent={
                  <img
                    src={firstImg}
                    alt={`${project.name} primary preview`}
                    className="w-full h-full object-cover select-none"
                    loading="lazy"
                  />
                }
                secondContent={
                  <img
                    src={secondImg}
                    alt={`${project.name} secondary preview`}
                    className="w-full h-full object-cover select-none"
                    loading="lazy"
                  />
                }
                pattern="pointer"
                pixelSize={32}
                pixelRadius={50}
                duration={400}
                pixelDuration={350}
                randomness={0.3}
                bounce={0.3}
                trigger="hover"
                gap={4}
                aspectRatio="16 / 10"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Under-Mockup Caption */}
          <div className="font-mono text-[10px] sm:text-[11px] tracking-widest text-muted-foreground uppercase text-center sm:text-left">
            SCREENSHOT · {project.name.toUpperCase()}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

export default CaseStudyCard;
