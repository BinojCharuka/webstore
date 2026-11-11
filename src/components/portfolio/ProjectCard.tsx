import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import type { Project } from "@/data/portfolio";
import { Tag } from "./SiteLayout";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <Reveal delay={(index % 4) * 100} variant="blur" className="h-full">
      <SpotlightCard className="flex h-full flex-col">
        <div className="relative flex items-start justify-between gap-4">
          <span className="font-mono text-xs text-primary">
            {String(index + 1).padStart(2, "0")} / {project.year}
          </span>
          <span className="rounded-full border px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
            {project.status}
          </span>
        </div>
        <h3 className="relative mt-5 font-serif text-2xl">{project.name}</h3>
        <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>
        <div className="relative mt-5 flex flex-wrap gap-2">
          {project.categories.slice(0, 3).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="relative mt-auto flex items-center justify-between gap-4 pt-7">
          <a
            href={`/projects/${encodeURIComponent(project.slug)}`}
            aria-label={`Explore project ${project.name}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
          >
            Explore project
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.name} live website`}
              className="rounded-full border p-2 text-muted-foreground hover:border-primary/50 hover:text-primary"
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </SpotlightCard>
    </Reveal>
  );
}
