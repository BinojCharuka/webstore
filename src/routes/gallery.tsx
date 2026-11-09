import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Images } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PageIntro, SiteLayout } from "@/components/portfolio/SiteLayout";
import { usePortfolio } from "@/data/use-portfolio";
import { JellyRadio } from "@/components/ui/JellyRadio";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [{ title: "Gallery — Binoj Charuka" }] }),
  component: Gallery,
});

function Gallery() {
  const { creative, certificates } = usePortfolio();
  const [filter, setFilter] = useState("All");

  const creativeItems = creative
    .filter((v) => !!v.image)
    .map((v) => ({ title: v.title, src: v.image!, category: "Creative Works" }));
  const certItems = certificates
    .filter((v) => !!v.image)
    .map((v) => ({ title: v.title, src: v.image!, category: "Certificates" }));
  const allImages = [...creativeItems, ...certItems];

  const filteredImages =
    filter === "All" ? allImages : allImages.filter((item) => item.category === filter);

  return (
    <SiteLayout>
      <PageIntro
        eyebrow="05 / moments"
        title="Gallery"
        description="Photographs, creative outputs and milestones from the work behind the scenes."
      />

      {allImages.length > 0 && (
        <div className="pt-8 pb-4 flex items-center justify-start overflow-x-auto max-w-full">
          <JellyRadio
            items={["All", "Creative Works", "Certificates"]}
            value={filter}
            onChange={(val) => setFilter(val)}
            ariaLabel="Filter gallery by category"
            size="md"
            radius={9999}
            swell={0.16}
            bounce={0.25}
          />
        </div>
      )}

      {filteredImages.length ? (
        <div className="grid gap-5 py-8 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {filteredImages.map((item, i) => (
            <Reveal key={`${item.src}-${i}`} delay={(i % 3) * 100}>
              <figure className="overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/40">
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <figcaption className="p-4 font-serif text-lg flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="font-mono text-xs text-muted-foreground">{item.category}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <div className="my-12 rounded-3xl border border-dashed bg-card p-12 text-center">
            <Images className="mx-auto h-9 w-9 text-primary" />
            <h2 className="mt-5 font-serif text-2xl">A space for real moments.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              No images have been added yet in this section. Upload your photos in Content Studio to
              populate this gallery.
            </p>
          </div>
        </Reveal>
      )}
    </SiteLayout>
  );
}
