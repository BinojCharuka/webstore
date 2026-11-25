import React from "react";
import { CheckCircle2, ArrowUpRight, GraduationCap } from "lucide-react";
import type { Certificate } from "@/data/portfolio";
import { SpotlightCard } from "@/components/SpotlightCard";

export function getCertificateSlug(c: { slug?: string | undefined; title: string }) {
  return (
    c.slug ||
    c.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") ||
    "certificate"
  );
}

export function CertificateCard({ certificate: c }: { certificate: Certificate }) {
  const slug = getCertificateSlug(c);
  const hasImage = Boolean(c.image);

  return (
    <a
      href={`/certificates/${encodeURIComponent(slug)}`}
      data-cursor-label="View certificate"
      className="group block h-full focus:outline-hidden"
    >
      <SpotlightCard className="cursor-target flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-0 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-xl">
        <div>
          {/* Visual Preview Banner */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
            {hasImage ? (
              <>
                <img
                  src={c.image}
                  alt={`${c.title} certificate preview`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </>
            ) : (
              <div className="creative-panel relative flex h-full w-full items-center justify-center p-6 text-center">
                <div aria-hidden="true" className="creative-abstract absolute inset-0 opacity-60" />
                <div className="relative z-10 flex flex-col items-center">
                  <GraduationCap className="h-10 w-10 text-primary/80 mb-2" />
                  <span className="font-serif text-lg font-semibold text-foreground/90">
                    {c.title}
                  </span>
                  <span className="mt-1 font-mono text-[11px] text-primary">{c.issuer}</span>
                </div>
              </div>
            )}

            {/* Top-left Verified Badge */}
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-black/30 bg-black/75 px-3 py-1 font-mono text-[10px] sm:text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md shadow-sm">
              <CheckCircle2 size={12} className="text-primary" />
              <span>VERIFIED BY {c.issuer.toUpperCase() || "CREDENTIAL"}</span>
            </span>

            {/* Top-right Year Badge */}
            <span className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 font-mono text-[11px] text-white/90 backdrop-blur-xs">
              {c.year}
            </span>
          </div>

          {/* Card Body */}
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                {c.issuer}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{c.year}</span>
            </div>

            <h3 className="mt-2.5 font-serif text-xl sm:text-2xl text-foreground font-bold transition-colors group-hover:text-primary">
              {c.title}
            </h3>

            {c.description && (
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {c.description}
              </p>
            )}

            {c.skills && c.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border/80 bg-secondary/50 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
                {c.skills.length > 3 && (
                  <span className="rounded-full border border-border/80 bg-secondary/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    +{c.skills.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="border-t border-border/60 bg-muted/20 px-5 sm:px-6 py-3.5 flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">Verified credential</span>
          <span className="inline-flex items-center gap-1 font-mono text-xs text-primary transition-all group-hover:underline group-hover:translate-x-0.5">
            <span>Read details</span>
            <ArrowUpRight size={13} />
          </span>
        </div>
      </SpotlightCard>
    </a>
  );
}
