import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PageIntro, SiteLayout } from "@/components/portfolio/SiteLayout";
import { CertificateCard } from "@/components/portfolio/CertificateCard";
import { usePortfolio } from "@/data/use-portfolio";

export const Route = createFileRoute("/certificates")({
  head: () => ({ meta: [{ title: "Certificates & Achievements — Binoj Charuka" }] }),
  component: CertificatesPage,
});
function CertificatesPage() {
  const { certificates } = usePortfolio();
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="04 / milestones"
        title="Certificates & achievements"
        description="Documenting learning, recognition and verified technical milestones."
        backHref="/#certificates"
        backLabel="Home"
      />
      {certificates.length ? (
        <div className="grid gap-6 py-12 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c, i) => (
            <Reveal key={`${c.title}-${i}`} delay={(i % 3) * 80}>
              <CertificateCard certificate={c} />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <div className="my-12 rounded-3xl border border-dashed bg-card p-12 text-center">
            <Award className="mx-auto h-9 w-9 text-primary" />
            <h2 className="mt-5 font-serif text-2xl">The collection is getting started.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Add your real certificates, issuing organizations and credential links in the content
              file or local Content Studio. No example awards are presented as real.
            </p>
          </div>
        </Reveal>
      )}
    </SiteLayout>
  );
}
