import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import type { CreativeWork } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/** Accessible interactive gallery, intentionally built with the site's own typography and motion system. */
export function CreativeAccordion({ works }: { works: CreativeWork[] }) {
  const [active, setActive] = useState(0);
  if (!works.length)
    return (
      <p className="rounded-2xl border p-8 text-muted-foreground">
        Creative work will be added here.
      </p>
    );
  return (
    <Reveal className="grid gap-3 md:flex md:min-h-[340px]" variant="blur">
      {works.map((work, index) => {
        const coverImg = work.image || (work.images && work.images.length > 0 ? work.images[0] : null);
        const flyerCount = work.images?.length || (work.image ? 1 : 0);

        return (
          <div
            key={work.slug}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (active === index) {
                window.location.href = `/creative-works/${encodeURIComponent(work.slug)}`;
              } else {
                setActive(index);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (active === index) {
                  window.location.href = `/creative-works/${encodeURIComponent(work.slug)}`;
                } else {
                  setActive(index);
                }
              }
            }}
            aria-pressed={active === index}
            data-cursor-label={active === index ? "View details" : work.title}
            className={cn(
              "cursor-target creative-panel group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500 focus:outline-hidden md:min-h-[340px]",
              active === index ? "active border-primary/50 md:flex-[2.35]" : "md:flex-1 hover:border-primary/30",
            )}
          >
            {coverImg ? (
              <img
                src={coverImg}
                alt={work.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div aria-hidden="true" className="creative-abstract absolute inset-0 opacity-70" />
            )}
            <div className="relative flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-primary font-bold">
                {String(index + 1).padStart(2, "0")} — {work.year}
              </span>
              {flyerCount > 1 && (
                <span className="rounded-full bg-black/60 border border-white/20 px-2 py-0.5 font-mono text-[10px] text-white/90">
                  {flyerCount} flyers
                </span>
              )}
            </div>
            <div className="relative">
              <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {work.category}
              </p>
              <h3 className="font-serif text-xl md:text-2xl transition-colors group-hover:text-primary">
                {work.title}
              </h3>
              {active === index ? (
                <div className="mt-3">
                  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {work.context}
                  </p>
                  <a
                    href={`/creative-works/${encodeURIComponent(work.slug)}`}
                    onClick={(e) => e.stopPropagation()}
                    data-cursor-label="Open"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/15 px-3.5 py-1.5 font-mono text-xs font-medium text-primary shadow-xs backdrop-blur-xs transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
                  >
                    <span>View details & {flyerCount > 0 ? `${flyerCount} flyers` : "gallery"}</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              ) : (
                <ArrowUpRight size={16} className="mt-4 text-primary/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" aria-hidden="true" />
              )}
            </div>
          </div>
        );
      })}
    </Reveal>
  );
}
