import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PageIntro, SiteLayout } from "@/components/portfolio/SiteLayout";
import { usePortfolio } from "@/data/use-portfolio";

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [{ title: "Events & Volunteering — Binoj Charuka" }] }),
  component: EventsPage,
});

function EventsPage() {
  const { events } = usePortfolio();
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="02 / community"
        title="Events & contributions"
        description="The people and projects beyond the screen — student communities, event collaborations and volunteer experiences."
      />
      <div className="grid gap-4 py-12 pb-20">
        {events.map((event, i) => (
          <Reveal key={event.slug} delay={(i % 5) * 80}>
            <a
              href={`/events/${encodeURIComponent(event.slug)}`}
              className="group flex flex-col justify-between gap-4 rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-4">
                <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-mono text-xs text-primary">
                    {event.group} · {event.year}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl">{event.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{event.role}</p>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {event.summary}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                className="shrink-0 self-end text-primary transition-transform group-hover:translate-x-1 sm:self-auto"
                size={21}
              />
            </a>
          </Reveal>
        ))}
      </div>
    </SiteLayout>
  );
}
