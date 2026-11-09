import { createFileRoute } from "@tanstack/react-router";
import { CreativeAccordion } from "@/components/portfolio/CreativeAccordion";
import { PageIntro, SiteLayout, Tag } from "@/components/portfolio/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { usePortfolio } from "@/data/use-portfolio";

export const Route = createFileRoute("/creative-works")({
  head: () => ({ meta: [{ title: "Creative Works — Binoj Charuka" }] }),
  component: CreativeWorks,
});
function CreativeWorks() {
  const { creative } = usePortfolio();
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="03 / design"
        title="Creative works"
        description="A growing archive of campaigns, visual identities and design explorations — where concept meets execution."
      />
      <div className="py-12">
        <CreativeAccordion works={creative} />
      </div>
      <div className="grid gap-5 pb-20 md:grid-cols-2">
        {creative.map((work, i) => (
          <Reveal key={work.slug} delay={(i % 4) * 90}>
            <div className="rounded-2xl border bg-card p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{work.year}</span>
              </div>
              <h2 className="font-serif text-2xl">{work.title}</h2>
              <p className="my-4 text-sm leading-relaxed text-muted-foreground">{work.context}</p>
              <Tag>{work.category}</Tag>
            </div>
          </Reveal>
        ))}
      </div>
    </SiteLayout>
  );
}
