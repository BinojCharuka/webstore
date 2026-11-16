import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import type { Project } from "@/data/portfolio";
import PixelSwap from "@/components/ui/PixelSwap";
import { Tag } from "./SiteLayout";

import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  index = 0,
  stacked = false,
}: {
  project: Project;
  index?: number;
  stacked?: boolean;
}) {
  const card = (
    <SpotlightCard
      data-cursor-target
      data-cursor-label={project.name}
      className={cn(
        "cursor-target relative flex flex-col overflow-hidden !p-0 rounded-2xl border",
        stacked
          ? "h-[380px] sm:h-[420px] md:h-[460px] w-full"
          : "h-full"
      )}
    >
      {/* Full-bleed PixelSwap image background */}
      <div className="absolute inset-0 z-0">
        <PixelSwap
          firstContent={
            <img
              src={project.images?.[0] ?? "/assets/demo/day-sky.webp"}
              alt={`${project.name} – primary`}
              className="w-full h-full object-cover"
            />
          }
          secondContent={
            <img
              src={project.images?.[1] ?? "/assets/demo/night-sky.webp"}
              alt={`${project.name} – secondary`}
              className="w-full h-full object-cover"
            />
          }
          pattern="random"
          pixelSize={40}
          duration={600}
          pixelDuration={350}
          trigger="hover"
        />
      </div>

      {/* Top bar: index + status */}
      <div className="relative z-10 flex items-start justify-between gap-4 p-5 sm:p-7">
        <span className="font-mono text-xs sm:text-sm text-primary drop-shadow-md">
          {String(index + 1).padStart(2, "0")} / {project.year}
        </span>
        <span className="rounded-full border border-white/20 bg-black/40 backdrop-blur-sm px-3 py-1 font-mono text-[11px] text-white/90">
          {project.status}
        </span>
      </div>

      {/* Spacer to push text content to the bottom */}
      <div className="relative z-10 flex-1 min-h-[80px]" />

      {/* Bottom gradient overlay for readability */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none"
        style={{
          height: "75%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Text content over the gradient */}
      <div className="relative z-10 p-5 sm:p-7 pt-0">
        <h3 className="font-serif text-2xl sm:text-3xl text-white drop-shadow-lg">
          {project.name}
        </h3>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-white/80 max-w-2xl">
          {project.tagline}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.categories.slice(0, 4).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <a
            href={`/projects/${encodeURIComponent(project.slug)}`}
            aria-label={`Explore project ${project.name}`}
            data-cursor-label="Explore"
            className="cursor-target group inline-flex items-center gap-2 text-sm sm:text-base font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
          >
            Explore project
            <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1" />
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.name} live website`}
              data-cursor-label="Live"
              className="cursor-target rounded-full border border-white/20 bg-black/30 backdrop-blur-xs p-2.5 text-white/80 hover:border-primary/50 hover:text-primary transition-colors"
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
    </SpotlightCard>
  );

  if (stacked) {
    return card;
  }

  return (
    <Reveal delay={(index % 4) * 100} variant="blur" className="h-full">
      {card}
    </Reveal>
  );
}
