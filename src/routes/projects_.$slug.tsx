import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, ExternalLink, Github, Layers3 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { ExternalAction, PageIntro, SiteLayout, Tag } from "@/components/portfolio/SiteLayout";
import { usePortfolio } from "@/data/use-portfolio";

export const Route = createFileRoute("/projects_/$slug")({ component: ProjectDetails });

function ProjectDetails() {
  const { slug } = Route.useParams();
  const { projects } = usePortfolio();
  const project = projects.find((p) => p.slug === slug);
  if (!project)
    return (
      <SiteLayout>
        <div className="py-24">
          <h1 className="font-serif text-4xl">Project not found.</h1>
          <a href="/projects" className="mt-6 inline-flex items-center gap-2 text-primary">
            <ArrowLeft size={16} /> All projects
          </a>
        </div>
      </SiteLayout>
    );
  return (
    <SiteLayout>
      <PageIntro
        eyebrow={`${project.year} / ${project.status}`}
        title={project.name}
        description={project.tagline}
        backHref="/projects"
        backLabel="All projects"
      />
      <div className="grid gap-12 py-12 md:grid-cols-[minmax(0,1.6fr)_minmax(220px,1fr)]">
        <div>
          <Reveal>
            <div className="creative-panel relative flex min-h-[230px] items-center justify-center overflow-hidden rounded-3xl border md:min-h-[320px]">
              <div aria-hidden="true" className="creative-abstract absolute inset-0" />
              <span className="relative z-10 max-w-sm px-8 text-center font-serif text-4xl text-foreground md:text-5xl">
                {project.name}
                <span className="text-primary">.</span>
              </span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-10 font-serif text-3xl">The project</h2>
            <p className="mt-4 leading-8 text-muted-foreground">{project.description}</p>
          </Reveal>
          <Reveal delay={140}>
            <h3 className="mt-10 font-serif text-2xl">Highlights</h3>
            <ul className="mt-5 space-y-4">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal variant="right">
          <SpotlightCard className="h-fit">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              Project details
            </p>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Year</dt>
                <dd className="mt-1 font-serif text-lg">{project.year}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Status</dt>
                <dd className="mt-1 font-serif text-lg">{project.status}</dd>
              </div>
              <div>
                <dt className="mb-2 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <Layers3 size={14} /> Categories
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {project.categories.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              {project.liveUrl && (
                <ExternalAction href={project.liveUrl} primary>
                  Visit website
                </ExternalAction>
              )}
              {project.sourceUrl && (
                <ExternalAction href={project.sourceUrl}>
                  <Github size={15} /> Source
                </ExternalAction>
              )}
            </div>
            {!project.liveUrl && (
              <p className="mt-6 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <ExternalLink size={13} /> Public demo not added yet.
              </p>
            )}
          </SpotlightCard>
        </Reveal>
      </div>
      <div className="border-t py-12">
        <a href="/projects" className="inline-flex items-center gap-2 text-sm text-primary">
          <ArrowLeft size={16} /> Back to all projects
        </a>
      </div>
    </SiteLayout>
  );
}
