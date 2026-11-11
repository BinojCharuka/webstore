import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Calendar,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Github,
  Globe,
  GraduationCap,
  HeartHandshake,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MaskLine } from "@/components/MaskLine";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { ScrambleText } from "@/components/ScrambleText";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Typewriter } from "@/components/Typewriter";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { varStyle } from "@/lib/anim";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/data/use-portfolio";
import { defaultPortfolio } from "@/data/portfolio";
import { CreativeAccordion } from "@/components/portfolio/CreativeAccordion";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { ExternalAction, SectionTitle, SiteLayout, Tag } from "@/components/portfolio/SiteLayout";
import { ScrollExpand } from "@/components/ui/ScrollExpand";
import { MinimalistHero } from "@/components/ui/minimalist-hero";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Binoj Charuka — Developer, Designer & Electronics Undergraduate" },
      {
        name: "description",
        content:
          "Portfolio of Binoj Charuka: web projects, creative design, electronics and IEEE volunteering.",
      },
      { property: "og:title", content: "Binoj Charuka — Personal Portfolio" },
      {
        property: "og:description",
        content: "Building useful digital experiences through code, design and community.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ticker = [
  "web development",
  "electronics",
  "creative design",
  "ieee volunteering",
  "student projects",
  "community",
  "problem solving",
];
const techTicker = [
  "react",
  "next.js",
  "typescript",
  "java",
  "sql",
  "tailwind",
  "figma",
  "github",
  "canva",
];

function Index() {
  const data = usePortfolio();
  const portraitImg =
    data.profile.portrait && !data.profile.portrait.endsWith(".svg")
      ? data.profile.portrait
      : "/profile.png";

  return (
    <LoadingScreen imageSrc={portraitImg}>
      <SiteLayout
        fullWidthTop={
          <ScrollExpand
            title={data.profile.shortName || "Binoj Charuka"}
            scrollHint="SCROLL TO DISCOVER"
            useWindowScroll
            scrollDistance={1.2}
            holdDistance={2.5}
          >
            <MinimalistHero
              headlineLeft={{ line1: "Web &", line2: "UI/UX", line3: "Developer" }}
              headlineRight={{ line1: "I design.", line2: "I build.", line3: "I elevate." }}
              imageSrc={portraitImg}
              imageAlt={`Portrait of ${data.profile.name}`}
              locationText={data.profile.location || "Sri Lanka"}
              availability={data.profile.availability || "Open to collaborations"}
              socialLinks={[
                {
                  icon: Github,
                  href: data.profile.github || "https://github.com",
                  label: "GitHub",
                },
                {
                  icon: Linkedin,
                  href: data.profile.linkedin || "https://linkedin.com",
                  label: "LinkedIn",
                },
                {
                  icon: Globe,
                  href: data.profile.website || "https://charudesignstudio.us",
                  label: "Website",
                },
                {
                  icon: Mail,
                  href: data.profile.email ? `mailto:${data.profile.email}` : "#contact",
                  label: "Contact",
                },
              ]}
            />
          </ScrollExpand>
        }
      >
        <div className="border-y py-5">
          <Marquee items={ticker} />
        </div>
        <About />
        <Skills />
        <Education />
        <Work />
        <Leadership />
        <Events />
        <Creative />
        <Journey />
        <Certificates />
        <Contact />
      </SiteLayout>
    </LoadingScreen>
  );
}

function Hero() {
  const { profile } = usePortfolio();
  return (
    <section
      aria-label="Introduction"
      className="relative flex flex-col items-center py-12 text-center md:py-16"
    >
      <Reveal variant="scale" className="relative mb-6">
        <div className="h-40 w-40 overflow-hidden rounded-full border border-primary/60 bg-secondary p-1.5 md:h-48 md:w-48">
          <img
            src={profile.portrait}
            alt={`Profile visual for ${profile.shortName}`}
            width="800"
            height="1000"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="kenburns h-full w-full rounded-full object-cover"
          />
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 h-4 w-4 animate-pulse-ring rounded-full border-4 border-background bg-primary"
        />
      </Reveal>
      <p className="mb-3 font-mono text-xs text-primary">
        ~/hello $ <Typewriter text="whoami" />
        <span className="caret">▍</span>
      </p>
      <h1 className="font-serif text-5xl leading-tight md:text-7xl">
        <MaskLine delay={120}>
          {profile.shortName}
          <span className="text-primary">.</span>
        </MaskLine>
      </h1>
      <Reveal delay={260} variant="none" className="mt-3">
        <p className="max-w-2xl font-serif text-xl md:text-2xl">{profile.headline}</p>
      </Reveal>
      <Reveal
        delay={380}
        className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
      >
        {profile.intro}
      </Reveal>
      <Reveal delay={500} variant="scale" className="mt-7 flex flex-wrap justify-center gap-3">
        <a
          href="#work"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="shine inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Explore my work <ArrowUpRight size={17} />
        </a>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium hover:border-primary/50"
        >
          Let's connect
        </a>
      </Reveal>
      <Reveal
        delay={620}
        variant="none"
        className="mt-7 flex items-center gap-2 font-mono text-xs text-muted-foreground"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        {profile.availability}
      </Reveal>
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        aria-label="Explore my profile"
        title="Explore my profile"
        className="mt-6 text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowDown aria-hidden="true" className="h-4 w-4 animate-bob" />
      </a>
    </section>
  );
}

function About() {
  const { profile } = usePortfolio();
  const facts = [
    { icon: MapPin, label: "Based in", value: profile.location },
    { icon: GraduationCap, label: "Education", value: "Electronics undergraduate" },
    { icon: Sparkles, label: "Focus", value: profile.focus },
  ];
  return (
    <section id="about" className="py-16 scroll-mt-24">
      <SectionTitle
        n="01"
        title="About me"
        caption="A little about the person behind the projects."
      />
      <div className="grid items-center gap-12 md:grid-cols-[minmax(0,290px)_1fr] md:gap-14">
        <Reveal variant="left" className="mx-auto w-full max-w-[290px]">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-7 -z-10 animate-drift rounded-full bg-primary/12 blur-3xl"
            />
            <div className="photo-frame p-[3px] shadow-sm">
              <div className="relative overflow-hidden rounded-[1.6rem] bg-secondary">
                <img
                  src={profile.portrait}
                  alt={`Profile visual for ${profile.shortName}`}
                  width="800"
                  height="1000"
                  loading="lazy"
                  decoding="async"
                  className="kenburns aspect-[4/5] w-full object-cover"
                />
              </div>
            </div>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 animate-float whitespace-nowrap rounded-full border bg-card px-4 py-1.5 font-mono text-xs text-muted-foreground shadow-sm">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
              {profile.availability}
            </span>
          </div>
        </Reveal>
        <Reveal variant="right" delay={140}>
          <h3 className="font-serif text-3xl md:text-4xl">
            Hi, I'm {profile.shortName.split(" ")[0]}.
          </h3>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{profile.bio}</p>
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="group rounded-xl border bg-card p-4 transition-colors hover:border-primary/45"
              >
                <fact.icon className="h-4 w-4 text-primary" />
                <dt className="mt-3 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="mt-1 font-serif text-base">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-7 font-mono text-xs text-muted-foreground">
            <span className="text-primary">↳</span> {profile.university}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Skills() {
  const { skills } = usePortfolio();
  return (
    <section id="skills" className="py-16">
      <SectionTitle
        n="02"
        title="Skills & toolkit"
        caption="Technologies and disciplines I use — and areas I keep learning."
      />
      <div className="grid gap-8 md:grid-cols-3">
        {skills.map((group, gi) => (
          <Reveal key={group.group} delay={gi * 120} variant="left">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {group.group}
            </h3>
            <ul className="space-y-2">
              {group.items.map((item, i) => (
                <li
                  key={item}
                  className="skill-row border-b pb-2 font-serif text-lg"
                  style={varStyle({ transitionDelay: `${i * 25}ms` })}
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 border-t pt-6">
        <Marquee items={techTicker} reverse />
      </div>
    </section>
  );
}

function Education() {
  const { education } = usePortfolio();
  const list = education && education.length > 0 ? education : defaultPortfolio.education ?? [];
  if (!list.length) return null;

  return (
    <section id="education" className="py-16 scroll-mt-24">
      <SectionTitle
        n="03"
        title="Education"
        caption="Academic background, degree programs and university coursework."
      />
      <div className="grid gap-6">
        {list.map((item, idx) => (
          <Reveal key={`${item.institution}-${idx}`} delay={idx * 120} variant="blur">
            <SpotlightCard className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                      <GraduationCap size={13} />
                      {item.institution}
                    </span>
                    {item.field && (
                      <span className="rounded-full border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                        {item.field}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-foreground">
                    {item.degree}
                  </h3>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 font-mono text-xs text-muted-foreground">
                    <Calendar size={13} />
                    {item.period}
                  </span>
                </div>
              </div>

              {item.description && (
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-3xl">
                  {item.description}
                </p>
              )}

              {item.highlights && item.highlights.length > 0 && (
                <div className="mt-6 border-t border-border/50 pt-5">
                  <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">
                    Highlights & Focus Areas
                  </p>
                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                        <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Work() {
  const { projects } = usePortfolio();
  return (
    <section id="projects" className="py-16 scroll-mt-24">
      <div id="work" className="sr-only" />
      <SectionTitle
        n="04"
        title="Selected work"
        caption="Web applications and projects shaped by real student needs."
        action={{ label: "All projects", href: "/projects" }}
      />
      <div className="grid gap-5 md:grid-cols-2">
        {projects
          .filter((project) => project.featured)
          .slice(0, 4)
          .map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
      </div>
    </section>
  );
}

function Leadership() {
  const { roles } = usePortfolio();
  return (
    <section id="leadership" className="py-16 scroll-mt-24">
      <SectionTitle
        n="05"
        title="Leadership & volunteering"
        caption="Building communities, supporting teams and making things happen together."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role, i) => (
          <Reveal key={`${role.title}-${role.group}`} variant="up" delay={(i % 4) * 90}>
            <SpotlightCard className="h-full">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-primary">
                  {role.title}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{role.year}</span>
              </div>
              <h3 className="mt-4 font-serif text-xl">{role.group}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {role.description}
              </p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Events() {
  const { events } = usePortfolio();
  return (
    <section id="events" className="py-16 scroll-mt-24">
      <SectionTitle
        n="06"
        title="Events & contributions"
        caption="Selected experiences across IEEE, student activities and community projects."
        action={{ label: "All events", href: "/events" }}
      />
      <div className="divide-y border-y">
        {events.slice(0, 4).map((event, i) => (
          <Reveal key={event.slug} delay={i * 70} variant="up">
            <a
              href={`/events/${encodeURIComponent(event.slug)}`}
              className="group flex flex-col justify-between gap-4 py-6 transition-colors hover:text-primary sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-4">
                <span className="pt-1 font-mono text-xs text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-foreground transition-colors group-hover:text-primary md:text-2xl">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.role} · {event.group}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 pl-8 font-mono text-xs text-muted-foreground sm:pl-0">
                {event.year}
                <ArrowUpRight
                  size={18}
                  className="text-primary transition-transform group-hover:translate-x-1"
                />
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Creative() {
  const { creative } = usePortfolio();
  return (
    <section id="creative" className="py-16 scroll-mt-24">
      <SectionTitle
        n="07"
        title="Creative works"
        caption="Where visual storytelling meets engineering and student events."
        action={{ label: "Explore creative work", href: "/creative-works" }}
      />
      <CreativeAccordion works={creative.slice(0, 5)} />
      <p className="mt-4 font-mono text-xs text-muted-foreground">
        Select a panel to explore a concept. Add your own artwork images in the content data.
      </p>
    </section>
  );
}

function Journey() {
  const { journey } = usePortfolio();
  const { ref, progress } = useScrollProgress<HTMLOListElement>(0.65);
  return (
    <section id="journey" className="py-16 scroll-mt-24">
      <SectionTitle
        n="08"
        title="My journey"
        caption="The work, communities and learning experiences shaping what comes next."
      />
      <ol ref={ref} className="relative border-l border-border/60 pl-8 space-y-6">
        <span
          aria-hidden="true"
          className="absolute -left-px top-0 h-full w-[2px] origin-top bg-gradient-to-b from-primary via-primary-glow to-primary shadow-[0_0_8px_var(--color-primary-glow)] transition-transform duration-100 ease-out"
          style={varStyle({ transform: `scaleY(${progress})` })}
        />
        {journey.map((item, i) => {
          const isReached = progress >= i / Math.max(1, journey.length - 1);
          return (
            <Reveal
              as="li"
              key={`${item.when}-${item.what}`}
              delay={i * 80}
              variant="right"
              className="relative list-none group"
            >
              {/* Timeline marker node */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -left-[41px] top-4.5 h-4 w-4 rounded-full border-2 transition-all duration-500",
                  isReached
                    ? "border-primary bg-primary shadow-[0_0_12px_2px_var(--color-primary)] ring-4 ring-primary/20 scale-110"
                    : "border-border/80 bg-background scale-90",
                )}
              />
              <div
                className={cn(
                  "rounded-2xl border p-5 sm:p-6 transition-all duration-500",
                  isReached
                    ? "border-primary/40 bg-card/90 shadow-[0_4px_24px_-8px_rgba(20,184,166,0.15)]"
                    : "border-border/40 bg-card/40 opacity-85 hover:border-primary/30 hover:opacity-100",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs transition-colors",
                      isReached
                        ? "bg-primary/15 text-primary font-semibold"
                        : "bg-muted/60 text-muted-foreground",
                    )}
                  >
                    {item.when}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Milestone {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-2.5 font-serif text-xl sm:text-2xl text-foreground">
                  {item.what}
                </h3>
                <p className="mt-1 font-sans text-sm font-medium text-muted-foreground">
                  {item.where}
                </p>
                {item.detail && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground/90 border-t border-border/40 pt-3">
                    {item.detail}
                  </p>
                )}
              </div>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}

function Certificates() {
  const { certificates } = usePortfolio();
  return (
    <section id="certificates" className="py-16">
      <SectionTitle
        n="09"
        title="Certificates & achievements"
        caption="A growing collection of verified learning milestones."
        action={{ label: "Certificates page", href: "/certificates" }}
      />
      {certificates.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {certificates.slice(0, 2).map((c, i) => (
            <Reveal key={`${c.title}-${i}`}>
              <SpotlightCard>
                <GraduationCap className="mb-4 h-6 w-6 text-primary" />
                <h3 className="font-serif text-xl">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {c.issuer} · {c.year}
                </p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border bg-card p-7">
            <div className="flex items-start gap-4">
              <GraduationCap className="h-7 w-7 shrink-0 text-primary" />
              <div>
                <h3 className="font-serif text-xl">Proof of progress, not placeholder awards.</h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  No certificates have been added yet. Verified certificates can be added from the
                  Content Studio or content file.
                </p>
              </div>
            </div>
            <a href="/certificates" className="inline-flex items-center gap-2 text-sm text-primary">
              View section <ArrowUpRight size={16} />
            </a>
          </div>
        </Reveal>
      )}
    </section>
  );
}

function Contact() {
  const { profile } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const emailToCopy = profile.email || "charudesignstudio@gmail.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  return (
    <section id="contact" className="py-16 scroll-mt-24">
      <Reveal
        variant="scale"
        className="relative overflow-hidden rounded-3xl bg-ink p-10 text-ink-foreground md:p-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-hue-pan opacity-70"
          style={varStyle({
            background:
              "radial-gradient(60% 80% at 20% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%), radial-gradient(50% 70% at 90% 100%, color-mix(in oklab, var(--primary-glow) 18%, transparent), transparent 70%)",
          })}
        />
        <p className="relative font-mono text-sm text-primary">10 — contact</p>
        <h2 className="relative mt-4 font-serif text-4xl md:text-5xl">
          <ScrambleText text="Let's build something together." speed={18} />
        </h2>
        <p className="relative mt-4 max-w-lg opacity-70">
          Happy to connect over technology, collaborative projects, design and student initiatives.
        </p>
        <div className="relative mt-8 flex flex-wrap items-center gap-3">
          {profile.email && (
            <ExternalAction href={`mailto:${profile.email}`} primary>
              Email me
            </ExternalAction>
          )}
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/20 bg-ink-foreground/5 px-5 py-3 font-mono text-xs text-ink-foreground transition-all duration-300 hover:border-primary hover:text-primary active:scale-95"
            aria-label={copied ? "Email address copied to clipboard" : "Copy email address to clipboard"}
          >
            {copied ? (
              <>
                <Check size={14} className="text-primary animate-bounce" />
                <span className="text-primary font-semibold">Email copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy email</span>
              </>
            )}
          </button>
          {profile.github && (
            <ExternalAction href={profile.github} primary={!profile.email}>
              GitHub
            </ExternalAction>
          )}
          {profile.linkedin && <ExternalAction href={profile.linkedin}>LinkedIn</ExternalAction>}
          {profile.website && <ExternalAction href={profile.website}>My website</ExternalAction>}
        </div>
        <div className="relative mt-10 flex flex-wrap gap-5 border-t border-ink-foreground/10 pt-6 font-mono text-xs opacity-70">
          <span className="inline-flex items-center gap-2">
            <Code2 size={15} /> Development
          </span>
          <span className="inline-flex items-center gap-2">
            <Sparkles size={15} /> Design
          </span>
          <span className="inline-flex items-center gap-2">
            <HeartHandshake size={15} /> Volunteering
          </span>
        </div>
      </Reveal>
    </section>
  );
}
