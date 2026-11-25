import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Award, CheckCircle2, ExternalLink, Eye, GraduationCap, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { PageIntro, SiteLayout, Tag } from "@/components/portfolio/SiteLayout";
import { getCertificateSlug } from "@/components/portfolio/CertificateCard";
import { usePortfolio } from "@/data/use-portfolio";

export const Route = createFileRoute("/certificates_/$slug")({
  head: () => ({ meta: [{ title: "Certificate Details — Binoj Charuka" }] }),
  component: CertificateDetails,
});

function CertificateDetails() {
  const { slug } = Route.useParams();
  const { certificates } = usePortfolio();

  const [isFullscreen, setIsFullscreen] = useState(false);

  const cert = certificates.find((c) => getCertificateSlug(c) === slug);

  if (!cert) {
    return (
      <SiteLayout>
        <div className="py-24">
          <h1 className="font-serif text-4xl">Certificate not found.</h1>
          <p className="mt-3 text-muted-foreground">
            The certificate or credential you are looking for does not exist or has been moved.
          </p>
          <a href="/#certificates" className="mt-6 inline-flex items-center gap-2 text-primary">
            <ArrowLeft size={16} /> Back to Certificates
          </a>
        </div>
      </SiteLayout>
    );
  }

  const otherCerts = certificates.filter((c) => getCertificateSlug(c) !== slug).slice(0, 3);

  return (
    <SiteLayout>
      <PageIntro
        eyebrow={`${cert.issuer} · ${cert.year}`}
        title={cert.title}
        description={cert.description || `Verified certificate and learning milestone issued by ${cert.issuer}.`}
        backHref="/#certificates"
        backLabel="Certificates & achievements"
      />

      <div className="grid gap-10 py-12 md:grid-cols-[minmax(0,1.6fr)_minmax(250px,1fr)]">
        <div>
          {/* Main Certificate Visual Frame */}
          <Reveal>
            {cert.image ? (
              <div
                onClick={() => setIsFullscreen(true)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/80 bg-black/40 shadow-xl transition-all duration-500 hover:border-primary/50"
              >
                <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden">
                  <img
                    src={cert.image}
                    alt={`${cert.title} certificate`}
                    loading="eager"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-primary">
                        Verified credential document
                      </span>
                      <h2 className="mt-1 font-serif text-xl sm:text-2xl font-bold">{cert.title}</h2>
                      <p className="font-mono text-xs text-white/80">{cert.issuer} · {cert.year}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/70 px-3.5 py-1.5 font-mono text-xs backdrop-blur-xs transition-colors group-hover:bg-primary group-hover:text-black">
                      <Eye size={13} /> View full document
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="creative-panel relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-3xl border md:min-h-[280px]">
                <div aria-hidden="true" className="creative-abstract absolute inset-0" />
                <div className="relative z-10 flex flex-col items-center px-8 text-center">
                  <GraduationCap className="h-12 w-12 text-primary mb-3" />
                  <span className="font-mono text-xs uppercase tracking-widest text-primary">
                    Verified milestone
                  </span>
                  <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
                    {cert.title}
                    <span className="text-primary">.</span>
                  </h1>
                  <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 font-mono text-xs text-primary">
                    <span>{cert.issuer}</span>
                    <span>•</span>
                    <span>{cert.year}</span>
                  </span>
                </div>
              </div>
            )}
          </Reveal>

          {/* Overview Section */}
          <Reveal delay={80}>
            <h2 className="mt-10 font-serif text-3xl">About this achievement</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {cert.details || cert.description || `Successfully completed the course and assessment requirements recognized by ${cert.issuer}.`}
            </p>
          </Reveal>

          {/* Skills and Competencies */}
          {cert.skills && cert.skills.length > 0 && (
            <Reveal delay={120}>
              <h3 className="mt-10 font-serif text-2xl">Verified skills & competencies</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {cert.skills.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </div>
            </Reveal>
          )}

          {/* Highlights & Modules */}
          {cert.highlights && cert.highlights.length > 0 && (
            <Reveal delay={160}>
              <h3 className="mt-10 font-serif text-2xl">Key coursework & deliverables</h3>
              <ul className="mt-5 space-y-4">
                {cert.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {/* Verification Note */}
          <Reveal delay={200}>
            <div className="mt-12 rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              This credential is part of continuous learning in software engineering, UI/UX, and electronics. For official transcripts or verification enquiries, please visit the{" "}
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
                Credential snapshot
              </p>
            </div>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Certificate Title</dt>
                <dd className="mt-1 font-serif text-lg text-foreground">{cert.title}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Issuing Organization</dt>
                <dd className="mt-1 font-serif text-lg text-foreground">{cert.issuer}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Year Issued</dt>
                <dd className="mt-1 font-serif text-lg text-foreground">{cert.year}</dd>
              </div>
              {cert.credentialId && (
                <div>
                  <dt className="font-mono text-xs text-muted-foreground">Credential ID</dt>
                  <dd className="mt-1 font-mono text-xs text-foreground">{cert.credentialId}</dd>
                </div>
              )}
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Verification Status</dt>
                <dd className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-xs text-primary">
                  <CheckCircle2 size={12} /> Confirmed entry
                </dd>
              </div>
            </dl>

            <div className="mt-7 flex flex-col gap-3">
              {cert.url && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-target inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-primary px-4 py-2.5 font-mono text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90"
                >
                  <ExternalLink size={14} /> Verify credential online
                </a>
              )}
              {cert.image && (
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="cursor-target inline-flex items-center justify-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-4 py-2.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground hover:border-primary/40"
                >
                  <Eye size={14} /> View full resolution certificate
                </button>
              )}
            </div>
          </SpotlightCard>
        </Reveal>
      </div>

      {/* Other Certificates Navigation */}
      {otherCerts.length > 0 && (
        <div className="border-t py-12">
          <h3 className="font-serif text-2xl">Other certificates & milestones</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {otherCerts.map((other) => {
              const oSlug = getCertificateSlug(other);
              return (
                <a
                  key={oSlug}
                  href={`/certificates/${encodeURIComponent(oSlug)}`}
                  className="cursor-target group flex flex-col justify-between rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-md"
                >
                  <div>
                    <span className="font-mono text-[11px] text-primary">{other.issuer}</span>
                    <h4 className="mt-1 font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                      {other.title}
                    </h4>
                    {other.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{other.description}</p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                    <span>{other.year}</span>
                    <span className="inline-flex items-center gap-1 text-primary group-hover:underline">
                      Read details <ArrowUpRight size={13} />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
          <div className="mt-8">
            <a href="/#certificates" className="inline-flex items-center gap-2 text-sm text-primary">
              <ArrowLeft size={16} /> Back to Certificates
            </a>
          </div>
        </div>
      )}

      {/* Fullscreen Certificate Modal */}
      {isFullscreen && cert.image && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <img
              src={cert.image}
              alt={cert.title}
              className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute -top-10 right-0 font-mono text-xs text-white/80 hover:text-white"
            >
              Close [ESC]
            </button>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
