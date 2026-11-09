import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, ChevronUp, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Reveal } from "@/components/Reveal";
import { useScrollY } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/data/use-portfolio";

export const siteNav = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Leadership", href: "/#leadership" },
  { label: "Events", href: "/#events" },
  { label: "Creative", href: "/#creative" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader({ hasHero = false }: { hasHero?: boolean }) {
  const y = useScrollY();
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile } = usePortfolio();
  const [isPastHero, setIsPastHero] = useState(!hasHero);
  const [heroOffset, setHeroOffset] = useState(0);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.pathname !== "/") {
      if (window.location.pathname.startsWith("/projects")) {
        setActiveSection("projects");
      } else if (window.location.pathname.startsWith("/events")) {
        setActiveSection("events");
      } else if (window.location.pathname.startsWith("/creative-works")) {
        setActiveSection("creative");
      } else {
        setActiveSection("");
      }
      return;
    }

    const sections = ["about", "projects", "leadership", "events", "creative", "contact"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      let current = "";
      for (const id of sections) {
        const el =
          document.getElementById(id) ||
          (id === "projects" ? document.getElementById("work") : null);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!hasHero) {
      setIsPastHero(true);
      return;
    }

    const checkHero = () => {
      const marker = document.getElementById("hero-end-marker");
      if (!marker) {
        setIsPastHero(true);
        return;
      }
      const rect = marker.getBoundingClientRect();
      const past = rect.top <= 80;
      setIsPastHero(past);
      if (past) {
        setHeroOffset(Math.max(0, -rect.top + 80));
      } else {
        setHeroOffset(0);
      }
    };

    checkHero();
    window.addEventListener("scroll", checkHero, { passive: true });
    window.addEventListener("resize", checkHero);
    return () => {
      window.removeEventListener("scroll", checkHero);
      window.removeEventListener("resize", checkHero);
    };
  }, [hasHero]);

  useEffect(() => {
    if (hasHero && !isPastHero && menuOpen) {
      setMenuOpen(false);
    }
  }, [hasHero, isPastHero, menuOpen]);

  const isHidden = hasHero && !isPastHero;
  const isPill = hasHero ? heroOffset >= 80 : y >= 40;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
    if (href.startsWith("/#")) {
      const sectionId = href.slice(2);
      if (typeof window !== "undefined") {
        if (window.location.pathname === "/") {
          e.preventDefault();
          const target =
            document.getElementById(sectionId) ||
            (sectionId === "projects" ? document.getElementById("work") : null);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          // Check if user is on the dedicated page corresponding to this section
          const isSameDedicatedPage =
            (sectionId === "projects" && window.location.pathname.startsWith("/projects")) ||
            (sectionId === "events" && window.location.pathname.startsWith("/events")) ||
            (sectionId === "creative" && window.location.pathname.startsWith("/creative-works"));

          if (isSameDedicatedPage) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            // Navigating from another route (e.g. /projects -> /#about)
            // Remember target section only for this specific transition
            e.preventDefault();
            try {
              sessionStorage.setItem("nav_target_section", sectionId);
            } catch {}
            window.location.href = "/";
          }
        }
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out",
        isHidden ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100",
        isPill
          ? "top-3 sm:top-4 w-[94%] max-w-5xl rounded-full border border-primary/30 bg-background/85 px-4 sm:px-6 py-2 shadow-[0_12px_35px_-8px_rgba(0,0,0,0.35)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.7)] backdrop-blur-xl"
          : "top-0 w-full rounded-none border-b border-border/40 bg-background/80 px-6 py-3.5 backdrop-blur-md shadow-none",
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <a
          href="/"
          onClick={(e) => {
            if (typeof window !== "undefined") {
              try {
                sessionStorage.removeItem("nav_target_section");
              } catch {}
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }
          }}
          className="flex shrink-0 items-center gap-2 font-serif text-base sm:text-lg tracking-tight"
          aria-label="Portfolio home"
        >
          <span
            aria-hidden="true"
            className="inline-block animate-spin text-primary [animation-duration:9s] text-base"
          >
            ✳
          </span>
          <span className="font-semibold text-foreground transition-colors hover:text-primary">
            {profile.shortName}
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
            {siteNav.map((item) => {
              const sectionId = item.href.slice(2);
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-mono tracking-wide transition-all duration-200",
                    isActive
                      ? "bg-primary/15 text-primary font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="h-4 w-px bg-border/60 hidden md:block mx-1" />

          <ThemeToggle />

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border bg-card/80 text-foreground md:hidden transition-colors hover:border-primary/50"
            onClick={() => setMenuOpen((open) => !open)}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="mt-2 grid grid-cols-2 gap-2 rounded-2xl border border-primary/20 bg-background/95 p-4 shadow-xl backdrop-blur-2xl md:hidden"
        >
          {siteNav.map((item) => {
            const sectionId = item.href.slice(2);
            const isActive = activeSection === sectionId;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  "rounded-xl border px-4 py-2.5 text-xs font-mono transition-colors",
                  isActive
                    ? "border-primary/60 bg-primary/10 text-primary font-semibold"
                    : "border-border/50 bg-card/60 hover:border-primary/40 hover:text-primary",
                )}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href="/certificates"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl border border-border/50 bg-card/60 px-4 py-2.5 text-xs font-mono transition-colors hover:border-primary/40 hover:text-primary"
          >
            Certificates
          </a>
          <a
            href="/gallery"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl border border-border/50 bg-card/60 px-4 py-2.5 text-xs font-mono transition-colors hover:border-primary/40 hover:text-primary"
          >
            Gallery
          </a>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { profile } = usePortfolio();
  return (
    <footer className="mx-auto max-w-5xl border-t px-6 pb-10 pt-8 text-sm text-muted-foreground">
      <Reveal variant="none" className="flex flex-wrap items-center justify-between gap-6">
        <p className="font-mono text-xs">
          © {new Date().getFullYear()} {profile.shortName} <span className="text-primary">✳</span>{" "}
          Built with curiosity.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a className="hover:text-primary" href="/projects">
            Projects
          </a>
          <a className="hover:text-primary" href="/events">
            Events
          </a>
          <a className="hover:text-primary" href="/creative-works">
            Creative works
          </a>
          <a className="hover:text-primary" href="/certificates">
            Certificates
          </a>
          <a className="hover:text-primary" href="/gallery">
            Gallery
          </a>
          <a className="hover:text-primary" href="/admin">
            Local studio
          </a>
        </div>
      </Reveal>
    </footer>
  );
}

function BackToTop() {
  const show = useScrollY() > 480;
  return (
    <a
      href="#top"
      aria-label="Back to top"
      onClick={(e) => {
        if (typeof window !== "undefined") {
          try {
            sessionStorage.removeItem("nav_target_section");
          } catch {}
          if (window.location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      }}
      className={cn(
        "fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border bg-card text-foreground shadow-lg transition-all duration-500",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0",
      )}
    >
      <ChevronUp size={18} />
    </a>
  );
}

export function SiteLayout({
  children,
  fullWidthTop,
}: {
  children: ReactNode;
  fullWidthTop?: ReactNode;
}) {
  return (
    <div id="top" className="min-h-screen">
      <ScrollProgress />
      {fullWidthTop}
      <div id="hero-end-marker" className="h-0 w-full" />
      <SiteHeader hasHero={!!fullWidthTop} />
      <main
        className={cn("mx-auto min-h-[60vh] max-w-5xl px-6", !fullWidthTop && "pt-24 sm:pt-28")}
      >
        {children}
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}

export function SectionTitle({
  n,
  title,
  caption,
  action,
}: {
  n: string;
  title: string;
  caption?: string;
  action?: { label: string; href: string };
}) {
  return (
    <Reveal variant="none" className="mb-9 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="font-mono text-xs text-primary">{n}</span>
          <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>
        </div>
        {caption && (
          <p className="ml-8 mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {caption}
          </p>
        )}
      </div>
      {action && (
        <a
          href={action.href}
          className="group inline-flex items-center gap-2 font-mono text-xs text-primary hover:underline"
        >
          {action.label}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      )}
    </Reveal>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
  backHref = "/",
  backLabel = "Back to home",
}: {
  eyebrow: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="border-b pb-10 pt-12 md:pb-14 md:pt-20">
      <Reveal variant="none">
        <a
          href={backHref}
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={14} />
          {backLabel}
        </a>
      </Reveal>
      <Reveal delay={110}>
        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-primary">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">
          {title}
          <span className="text-primary">.</span>
        </h1>
      </Reveal>
      <Reveal delay={210}>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      </Reveal>
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 font-mono text-[0.7rem] text-accent-foreground">
      {children}
    </span>
  );
}

export function ExternalAction({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5",
        primary ? "shine bg-primary text-primary-foreground" : "border hover:border-primary/50",
      )}
    >
      {children}
      <ArrowUpRight size={16} />
    </a>
  );
}
