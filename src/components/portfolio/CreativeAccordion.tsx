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
          <button
            key={work.slug}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={active === index}
            data-cursor-label={work.title}
            className={cn(
              "cursor-target creative-panel group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500 md:min-h-[340px]",
              active === index ? "active border-primary/50 md:flex-[2.35]" : "md:flex-1",
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
              <span className="font-mono text-xs text-primary">
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
              <h3 className="font-serif text-xl md:text-2xl">{work.title}</h3>
              {active === index && (
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {work.context}
                </p>
              )}
              <ArrowUpRight size={16} className="mt-4 text-primary" aria-hidden="true" />
            </div>
          </button>
        );
      })}
    </Reveal>
  );
}
