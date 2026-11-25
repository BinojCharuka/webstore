import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Award } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PageIntro, SiteLayout } from "@/components/portfolio/SiteLayout";
import { SpotlightCard } from "@/components/SpotlightCard";
import { type Role } from "@/data/portfolio";
import { usePortfolio } from "@/data/use-portfolio";

export const Route = createFileRoute("/leadership")({
  head: () => ({ meta: [{ title: "Leadership & Volunteering — Binoj Charuka" }] }),
  component: LeadershipPage,
});

function getSlug(role: Role) {
  return (
    role.slug ||
    role.group
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );
}

function LeadershipPage() {
  const { roles } = usePortfolio();
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="03 / community"
        title="Leadership & volunteering"
        description="Building communities, supporting teams and making things happen together across IEEE, university societies and student initiatives."
        backHref="/#leadership"
        backLabel="Home"
      />
      <div className="grid gap-6 py-12 pb-20 md:grid-cols-2">
        {roles.map((role, i) => {
          const slug = getSlug(role);
          return (
            <Reveal key={`${role.title}-${role.group}`} delay={(i % 4) * 80}>
              <a
                href={`/leadership/${encodeURIComponent(slug)}`}
                data-cursor-label="View role"
                className="group block h-full focus:outline-hidden"
              >
                <SpotlightCard className="cursor-target h-full transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-primary">
                      {role.title}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{role.year}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <h2 className="font-serif text-2xl transition-colors group-hover:text-primary">
                      {role.group}
                    </h2>
                    <ArrowUpRight
                      size={18}
                      className="shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </div>
                  {role.organization && (
                    <p className="mt-1 font-mono text-xs text-muted-foreground/75">
                      {role.organization}
                    </p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {role.description}
                  </p>
                  <p className="mt-5 flex items-center gap-1.5 font-mono text-xs text-primary transition-colors group-hover:underline">
                    <span>View role details & contributions</span>
                    <span>→</span>
                  </p>
                </SpotlightCard>
              </a>
            </Reveal>
          );
        })}
      </div>
    </SiteLayout>
  );
}
