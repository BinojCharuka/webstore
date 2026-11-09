import { createFileRoute } from "@tanstack/react-router";
import { Award, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PageIntro, SiteLayout } from "@/components/portfolio/SiteLayout";
import { usePortfolio } from "@/data/use-portfolio";

export const Route = createFileRoute("/certificates")({
  head: () => ({ meta: [{ title: "Certificates — Binoj Charuka" }] }),
  component: CertificatesPage,
});
function CertificatesPage() {
  const { certificates } = usePortfolio();
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="04 / milestones"
        title="Certificates & achievements"
        description="Documenting learning, recognition and experiences — only with confirmed entries."
      />
      {certificates.length ? (
        <div className="grid gap-5 py-12 pb-20 md:grid-cols-2">
          {certificates.map((c, i) => (
            <Reveal key={`${c.title}-${i}`}>
              <div className="rounded-2xl border bg-card p-7">
                <Award className="mb-4 h-7 w-7 text-primary" />
                <p className="font-mono text-xs text-primary">{c.year}</p>
                <h2 className="mt-3 font-serif text-2xl">{c.title}</h2>
                <p className="mt-2 text-muted-foreground">{c.issuer}</p>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm text-primary"
                  >
                    View credential
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
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
