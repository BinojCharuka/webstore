import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, HeartHandshake, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { PageIntro, SiteLayout } from "@/components/portfolio/SiteLayout";
import { usePortfolio } from "@/data/use-portfolio";

export const Route = createFileRoute("/events_/$slug")({ component: EventDetails });

function EventDetails() {
  const { slug } = Route.useParams();
  const { events } = usePortfolio();
  const event = events.find((e) => e.slug === slug);
  if (!event)
    return (
      <SiteLayout>
        <div className="py-24">
          <h1 className="font-serif text-4xl">Event not found.</h1>
          <a href="/events" className="mt-6 inline-flex items-center gap-2 text-primary">
            <ArrowLeft size={16} /> All events
          </a>
        </div>
      </SiteLayout>
    );
  return (
    <SiteLayout>
      <PageIntro
        eyebrow={`${event.group} / ${event.year}`}
        title={event.title}
        description={event.summary}
        backHref="/events"
        backLabel="All events"
      />
      <div className="grid gap-10 py-12 md:grid-cols-[minmax(0,1.6fr)_minmax(230px,1fr)]">
        <div>
          <Reveal>
            <h2 className="font-serif text-3xl">My contribution</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{event.role}</p>
          </Reveal>
          <Reveal delay={100}>
            <h3 className="mt-10 font-serif text-2xl">Highlights</h3>
            <ul className="mt-6 space-y-4">
              {event.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {highlight}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-12 rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
              Event photos and design assets can be added to the{" "}
              <a href="/gallery" className="text-primary underline">
                gallery
              </a>{" "}
              once you upload them.
            </div>
          </Reveal>
        </div>
        <Reveal variant="right">
          <SpotlightCard className="h-fit">
            <HeartHandshake className="mb-5 h-7 w-7 text-primary" />
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              Event snapshot
            </p>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Community</dt>
                <dd className="mt-1 font-serif text-lg">{event.group}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Role</dt>
                <dd className="mt-1 font-serif text-lg">{event.role}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-muted-foreground">Year</dt>
                <dd className="mt-1 font-serif text-lg">{event.year}</dd>
              </div>
            </dl>
          </SpotlightCard>
        </Reveal>
      </div>
      <div className="border-t py-12">
        <a href="/events" className="inline-flex items-center gap-2 text-sm text-primary">
          <ArrowLeft size={16} /> Back to all events
        </a>
      </div>
    </SiteLayout>
  );
}
