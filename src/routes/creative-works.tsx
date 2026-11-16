import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Images, Eye, Sparkles } from "lucide-react";
import { CreativeAccordion } from "@/components/portfolio/CreativeAccordion";
import { PageIntro, SiteLayout, Tag } from "@/components/portfolio/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { usePortfolio } from "@/data/use-portfolio";
import { FlyerLightbox } from "@/components/portfolio/FlyerLightbox";

export const Route = createFileRoute("/creative-works")({
  head: () => ({ meta: [{ title: "Creative Works & Event Flyers — Binoj Charuka" }] }),
  component: CreativeWorks,
});

function CreativeWorks() {
  const { creative } = usePortfolio();
  const [lightboxData, setLightboxData] = useState<{
    images: string[];
    index: number;
    title: string;
    isOpen: boolean;
  }>({
    images: [],
    index: 0,
    title: "",
    isOpen: false,
  });

  const openLightbox = (images: string[], index: number, title: string) => {
    setLightboxData({ images, index, title, isOpen: true });
  };

  const closeLightbox = () => {
    setLightboxData((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <SiteLayout>
      <PageIntro
        eyebrow="03 / design"
        title="Creative works & event campaigns"
        description="A growing archive of event campaigns, promotional flyers, visual identities and design explorations — crafted for university, community and global initiatives."
      />

      <div className="py-12">
        <CreativeAccordion works={creative} />
      </div>

      <div className="grid gap-6 pb-20 md:grid-cols-2">
        {creative.map((work, i) => {
          const flyerList =
            Array.isArray(work.images) && work.images.length > 0
              ? work.images
              : work.image
                ? [work.image]
                : [];

          return (
            <Reveal key={work.slug} delay={(i % 4) * 90}>
              <div
                data-cursor-target
                data-cursor-label={work.title}
                className="cursor-target group flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-6 sm:p-7 transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
              >
                <div>
                  {/* Top metadata */}
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-primary font-bold">
                      {String(i + 1).padStart(2, "0")} / {work.year}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-primary">
                      {flyerList.length > 1 ? (
                        <>
                          <Images size={11} /> {flyerList.length} flyers
                        </>
                      ) : (
                        work.category
                      )}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-foreground font-bold">
                    {work.title}
                  </h2>
                  <p className="my-3 text-sm leading-relaxed text-muted-foreground">
                    {work.context}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    <Tag>{work.category}</Tag>
                  </div>
                </div>

                {/* Flyers Gallery Section */}
                {flyerList.length > 0 ? (
                  <div className="mt-4 pt-4 border-t border-border/60">
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-3">
                      <span>Designed flyers & visuals ({flyerList.length}):</span>
                      <button
                        type="button"
                        onClick={() => openLightbox(flyerList, 0, work.title)}
                        className="text-primary hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Eye size={12} /> View all
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {flyerList.slice(0, 4).map((flyer, fIdx) => (
                        <div
                          key={`${flyer}-${fIdx}`}
                          onClick={() => openLightbox(flyerList, fIdx, work.title)}
                          className="group/thumb relative aspect-[3/4] rounded-lg overflow-hidden border border-border/80 bg-black/40 cursor-pointer hover:border-primary transition-all"
                        >
                          <img
                            src={flyer}
                            alt={`${work.title} flyer ${fIdx + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                          />
                          {fIdx === 3 && flyerList.length > 4 && (
                            <div className="absolute inset-0 bg-black/75 flex items-center justify-center font-mono text-xs font-bold text-white">
                              +{flyerList.length - 4} more
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-border/40 text-xs font-mono text-muted-foreground/60 flex items-center gap-2">
                    <Sparkles size={13} className="text-primary/60" />
                    <span>Flyer assets will be displayed here once uploaded.</span>
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <FlyerLightbox
        images={lightboxData.images}
        initialIndex={lightboxData.index}
        title={lightboxData.title}
        isOpen={lightboxData.isOpen}
        onClose={closeLightbox}
      />
    </SiteLayout>
  );
}
