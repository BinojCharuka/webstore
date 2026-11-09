import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { PageIntro, SiteLayout } from "@/components/portfolio/SiteLayout";
import { usePortfolio } from "@/data/use-portfolio";
import { JellyRadio } from "@/components/ui/JellyRadio";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Binoj Charuka" },
      {
        name: "description",
        content: "Explore web development, student utilities and creative technical projects.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects } = usePortfolio();
  const [selected, setSelected] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap((p) => p.categories)))],
    [projects],
  );
  const filtered =
    selected === "All" ? projects : projects.filter((p) => p.categories.includes(selected));
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="01 / projects"
        title="Things I've built"
        description="A mix of practical websites, student-friendly tools and work in progress. Each project starts with a problem worth exploring."
      />
      <div className="py-8 overflow-x-auto max-w-full">
        <JellyRadio
          items={categories}
          value={selected}
          onChange={(cat) => setSelected(cat)}
          ariaLabel="Filter projects by category"
          size="md"
          radius={9999}
          swell={0.16}
          bounce={0.25}
        />
      </div>
      {filtered.length ? (
        <div className="grid gap-5 pb-20 md:grid-cols-2">
          {filtered.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      ) : (
        <p className="pb-20 text-muted-foreground">No projects in this category yet.</p>
      )}
    </SiteLayout>
  );
}
