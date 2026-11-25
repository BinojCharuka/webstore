import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Award, CheckCircle2, ExternalLink, HeartHandshake, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { PageIntro, SiteLayout } from "@/components/portfolio/SiteLayout";
import { type Role } from "@/data/portfolio";
import { usePortfolio } from "@/data/use-portfolio";

export const Route = createFileRoute("/leadership_/$slug")({
  head: () => ({ meta: [{ title: "Leadership & Volunteering — Binoj Charuka" }] }),
  component: LeadershipRoleDetails,
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

function LeadershipRoleDetails() {
  const { slug } = Route.useParams();
  const { roles } = usePortfolio();

  const role = roles.find((r) => getSlug(r) === slug);

  if (!role) {
    return (
      <SiteLayout>
        <div className="py-24">
          <h1 className="font-serif text-4xl">Role not found.</h1>
          <p className="mt-3 text-muted-foreground">The leadership position you are looking for does not exist.</p>
          <a href="/#leadership" className="mt-6 inline-flex items-center gap-2 text-primary">
            <ArrowLeft size={16} /> Back to Leadership
          </a>
        </div>
      </SiteLayout>
    );
  }

  const otherRoles = roles.filter((r) => getSlug(r) !== slug).slice(0, 2);

  return (
    <SiteLayout>
      <PageIntro
        eyebrow={`${role.organization || role.group} · ${role.year}`}
        title={`${role.title} — ${role.group}`}
        description={role.description}
        backHref="/#leadership"
        backLabel="Leadership & volunteering"
      />

      <div className="grid gap-10 py-12 md:grid-cols-[minmax(0,1.6fr)_minmax(250px,1fr)]">
        <div>
          {/* Creative Banner Panel */}
          <Reveal>
            <div className="creative-panel relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-3xl border md:min-h-[280px]">
              <div aria-hidden="true" className="creative-abstract absolute inset-0" />
              <div className="relative z-10 flex flex-col items-center px-8 text-center">
                <span className="font-mono text-xs uppercase tracking-widest text-primary">
                  {role.organization || role.group}
                </span>
                <h1 className="mt-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
                  {role.title}
                  <span className="text-primary">.</span>
                </h1>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 font-mono text-xs text-primary">
                    <span>{role.group}</span>
                    <span>•</span>
                    <span>{role.year}</span>
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Overview Section */}
          <Reveal delay={80}>
            <h2 className="mt-10 font-serif text-3xl">Role overview</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {role.details || role.description}
            </p>
          </Reveal>

          {/* Highlights & Contributions */}
          {role.highlights && role.highlights.length > 0 && (
            <Reveal delay={140}>
              <h3 className="mt-10 font-serif text-2xl">Key responsibilities & impact</h3>
              <ul className="mt-5 space-y-4">
                {role.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {/* Community Value Card */}
          <Reveal delay={200}>
            <div className="mt-12 rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              Interested in collaborating or learning more about student leadership and community initiatives? Feel free to reach out via the{" "}
              <a href="/#contact" className="text-primary underline hover:text-primary/80">
                contact section
              </a>
              .
            </div>
          </Reveal>
        </div>

        {/* Snapshot Sidebar */}
        <Reveal variant="right">
          <SpotlightCard className="h-fit">
            <div className="flex items-center gap-2.5">
              <Award className="h-6 w-6 text-primary" />
              <p className="font-mono text-xs uppercase tracking-widest text-primary">
                Role snapshot
              </p>
            </div>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Title</dt>
                <dd className="mt-1 font-serif text-lg text-foreground">{role.title}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Group / Event</dt>
                <dd className="mt-1 font-serif text-lg text-foreground">{role.group}</dd>
              </div>
              {role.organization && (
                <div>
                  <dt className="font-mono text-xs text-muted-foreground">Organization</dt>
                  <dd className="mt-1 text-sm text-foreground">{role.organization}</dd>
                </div>
              )}
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Year</dt>
                <dd className="mt-1 font-serif text-lg text-foreground">{role.year}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Focus</dt>
                <dd className="mt-1 text-sm text-muted-foreground">Leadership & Volunteering</dd>
              </div>
            </dl>

            {role.link && (
              <div className="mt-7">
                <a
                  href={role.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-target inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-xs text-primary transition-colors hover:border-primary hover:bg-primary/20"
                >
                  <ExternalLink size={14} /> Visit initiative
                </a>
              </div>
            )}
          </SpotlightCard>
        </Reveal>
      </div>

      {/* Other Roles Navigation */}
      {otherRoles.length > 0 && (
        <div className="border-t py-12">
          <h3 className="font-serif text-2xl">Other leadership positions</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {otherRoles.map((other) => (
              <a
                key={getSlug(other)}
                href={`/leadership/${encodeURIComponent(getSlug(other))}`}
                className="cursor-target group flex items-center justify-between rounded-xl border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-sm"
              >
                <div>
                  <span className="font-mono text-xs text-primary">{other.title}</span>
                  <h4 className="mt-1 font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                    {other.group}
                  </h4>
                  <span className="text-xs text-muted-foreground">{other.year}</span>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                />
              </a>
            ))}
          </div>
          <div className="mt-8">
            <a href="/#leadership" className="inline-flex items-center gap-2 text-sm text-primary">
              <ArrowLeft size={16} /> Back to Leadership
            </a>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
