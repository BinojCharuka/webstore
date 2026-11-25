import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Eye, Images, Palette, Sparkles, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { PageIntro, SiteLayout, Tag } from "@/components/portfolio/SiteLayout";
import { FlyerLightbox } from "@/components/portfolio/FlyerLightbox";
import { usePortfolio } from "@/data/use-portfolio";

export const Route = createFileRoute("/creative-works_/$slug")({
  head: () => ({ meta: [{ title: "Creative Work Details — Binoj Charuka" }] }),
  component: CreativeWorkDetails,
});

function CreativeWorkDetails() {
  const { slug } = Route.useParams();
  const { creative } = usePortfolio();

  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const work = creative.find((c) => c.slug === slug);

  if (!work) {
    return (
      <SiteLayout>
        <div className="py-24">
          <h1 className="font-serif text-4xl">Creative work not found.</h1>
          <p className="mt-3 text-muted-foreground">
            The design campaign you are looking for does not exist or has been moved.
          </p>
          <a href="/#creative" className="mt-6 inline-flex items-center gap-2 text-primary">
            <ArrowLeft size={16} /> Back to Creative works
          </a>
        </div>
      </SiteLayout>
    );
  }

  const flyerList =
    Array.isArray(work.images) && work.images.length > 0
      ? work.images
      : work.image
        ? [work.image]
        : [];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const otherWorks = creative.filter((c) => c.slug !== slug).slice(0, 3);

  return (
    <SiteLayout>
      <PageIntro
        eyebrow={`${work.category} · ${work.year}`}
        title={work.title}
        description={work.context}
        backHref="/#creative"
        backLabel="Creative works"
      />

      <div className="grid gap-10 py-12 md:grid-cols-[minmax(0,1.6fr)_minmax(250px,1fr)]">
        <div>
          {/* Main Showcase Banner */}
          <Reveal>
            {flyerList.length > 0 ? (
              <div
                onClick={() => openLightbox(0)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/80 bg-black/40 shadow-lg transition-all duration-500 hover:border-primary/50"
              >
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={flyerList[0]}
                    alt={`${work.title} featured cover`}
                    loading="eager"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-primary">
                        Featured artwork
                      </span>
                      <h2 className="mt-1 font-serif text-xl sm:text-2xl font-bold">{work.title}</h2>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/60 px-3 py-1 font-mono text-xs backdrop-blur-xs transition-colors group-hover:bg-primary group-hover:text-black">
                      <Eye size={13} /> View full resolution
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="creative-panel relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-3xl border md:min-h-[280px]">
                <div aria-hidden="true" className="creative-abstract absolute inset-0" />
                <div className="relative z-10 flex flex-col items-center px-8 text-center">
                  <span className="font-mono text-xs uppercase tracking-widest text-primary">
                    {work.category}
                  </span>
                  <h1 className="mt-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
                    {work.title}
                    <span className="text-primary">.</span>
                  </h1>
                </div>
              </div>
            )}
          </Reveal>

          {/* Campaign Overview */}
          <Reveal delay={80}>
            <h2 className="mt-10 font-serif text-3xl">Campaign overview</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {work.context}
            </p>
          </Reveal>

          {/* Gallery of All Flyers / Visuals */}
          {flyerList.length > 0 && (
            <Reveal delay={140} className="mt-12">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Images className="h-5 w-5 text-primary" />
                  <h3 className="font-serif text-2xl">
                    Campaign flyers & graphics ({flyerList.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => openLightbox(0)}
                  className="cursor-target inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:underline"
                >
                  <Eye size={13} /> Slideshow view
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
                {flyerList.map((flyer, fIdx) => (
                  <div
                    key={`${flyer}-${fIdx}`}
                    onClick={() => openLightbox(fIdx)}
                    data-cursor-label="Zoom"
                    className="group/item relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl border border-border/80 bg-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-md"
                  >
                    <img
                      src={flyer}
                      alt={`${work.title} visual #${fIdx + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/item:opacity-100" />
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/80 px-2 py-0.5 font-mono text-[10px] text-white/90 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100">
                      Visual #{fIdx + 1}
                    </span>
                    <span className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity duration-300 group-hover/item:opacity-100">
                      <Eye size={12} />
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* Context Card */}
          <Reveal delay={200}>
            <div className="mt-12 rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              Need custom event branding, countdown flyers or promotional social media design for your initiative?{" "}
              <a href="/#contact" className="text-primary underline hover:text-primary/80">
                Let's connect
              </a>
              .
            </div>
          </Reveal>
        </div>

        {/* Snapshot Sidebar */}
        <Reveal variant="right">
          <SpotlightCard className="h-fit">
            <div className="flex items-center gap-2.5">
              <Palette className="h-6 w-6 text-primary" />
              <p className="font-mono text-xs uppercase tracking-widest text-primary">
                Design details
              </p>
            </div>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Project</dt>
                <dd className="mt-1 font-serif text-lg text-foreground">{work.title}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Category</dt>
                <dd className="mt-1 font-serif text-lg text-foreground">{work.category}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Year</dt>
                <dd className="mt-1 font-serif text-lg text-foreground">{work.year}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Flyers / Assets</dt>
                <dd className="mt-1 text-sm text-foreground">
                  {flyerList.length > 0 ? `${flyerList.length} visual items` : "Concept design"}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Type</dt>
                <dd className="mt-1 text-sm text-muted-foreground">Creative & Visual Storytelling</dd>
              </div>
            </dl>

            {flyerList.length > 0 && (
              <div className="mt-7">
                <button
                  type="button"
                  onClick={() => openLightbox(0)}
                  className="cursor-target inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2.5 font-mono text-xs text-primary transition-colors hover:border-primary hover:bg-primary/20"
                >
                  <Eye size={14} /> Open full gallery ({flyerList.length})
                </button>
              </div>
            )}
          </SpotlightCard>
        </Reveal>
      </div>

      {/* Other Works Navigation */}
      {otherWorks.length > 0 && (
        <div className="border-t py-12">
          <h3 className="font-serif text-2xl">More creative works</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {otherWorks.map((other) => {
              const otherCover =
                other.image || (other.images && other.images.length > 0 ? other.images[0] : null);
              return (
                <a
                  key={other.slug}
                  href={`/creative-works/${encodeURIComponent(other.slug)}`}
                  className="cursor-target group flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-md"
                >
                  {otherCover && (
                    <div className="mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/40">
                      <img
                        src={otherCover}
                        alt={other.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div>
                    <span className="font-mono text-[11px] text-primary">{other.category}</span>
                    <h4 className="mt-1 font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                      {other.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{other.context}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                    <span>{other.year}</span>
                    <span className="inline-flex items-center gap-1 text-primary group-hover:underline">
                      View details <ArrowUpRight size={13} />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
          <div className="mt-8">
            <a href="/#creative" className="inline-flex items-center gap-2 text-sm text-primary">
              <ArrowLeft size={16} /> Back to Creative works
            </a>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <FlyerLightbox
        images={flyerList}
        initialIndex={lightboxIndex}
        title={work.title}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
      />
    </SiteLayout>
  );
}
