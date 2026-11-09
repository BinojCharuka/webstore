import React from "react";
import { ArrowDown, ArrowUpRight, Github, Globe, Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MinimalistHeroProps {
  headlineLeft?: { line1: string; line2: string; line3: string };
  headlineRight?: { line1: string; line2: string; line3: string };
  imageSrc: string;
  imageAlt?: string;
  socialLinks?: { icon: React.ElementType; href: string; label: string }[];
  locationText?: string;
  availability?: string;
  className?: string;
}

export const MinimalistHero: React.FC<MinimalistHeroProps> = ({
  headlineLeft = { line1: "Web &", line2: "UI/UX", line3: "Developer" },
  headlineRight = { line1: "I design.", line2: "I build.", line3: "I elevate." },
  imageSrc,
  imageAlt = "Binoj Charuka portrait",
  socialLinks = [],
  locationText = "Sri Lanka",
  availability = "Open to collaborations",
  className,
}) => {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-background dark:bg-black p-6 pt-6 pb-6 font-sans md:px-12 md:pt-8 md:pb-8",
        className,
      )}
    >
      <style>{`
        @keyframes glitch-shake {
          0%, 88% { transform: translate(0, 0) skew(0deg); filter: hue-rotate(0deg) saturate(1); }
          89% { transform: translate(-6px, 3px) skew(3deg); filter: hue-rotate(90deg) saturate(2.5); }
          91% { transform: translate(6px, -3px) skew(-3deg); filter: hue-rotate(-90deg) saturate(2.5); }
          93% { transform: translate(-3px, 0px) skew(1.5deg); filter: hue-rotate(45deg) saturate(1.8); }
          95%, 100% { transform: translate(0, 0) skew(0deg); filter: hue-rotate(0deg) saturate(1); }
        }
        .hero-glitch-wrapper {
          animation: glitch-shake 7s infinite ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-glitch-wrapper {
            animation: none !important;
          }
        }
      `}</style>

      {/* Top Header Bar */}
      <header className="z-30 flex w-full max-w-7xl items-center justify-between border-b border-border/40 pb-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="inline-block animate-spin text-primary [animation-duration:9s] text-sm"
          >
            ✳
          </span>
          <span className="font-serif text-base font-semibold tracking-tight text-foreground">
            Binoj Charuka
          </span>
          <span className="text-muted-foreground/40 hidden sm:inline">/</span>
          <span className="text-muted-foreground text-xs hidden sm:inline">Portfolio</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground/90">{availability}</span>
          </span>
          <span className="text-muted-foreground/40 hidden md:inline">✦</span>
          <span className="hidden md:inline text-xs text-muted-foreground">{locationText}</span>
        </div>
      </header>

      {/* Decorative Pill Badge */}
      <div className="z-20 mt-3 mb-1 flex items-center justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1 text-xs font-mono text-primary backdrop-blur-xs">
          <span>Creative Engineering & UI/UX</span>
          <span className="text-primary/40">•</span>
          <span>Electronics Undergraduate</span>
        </span>
      </div>

      {/* Main 3-column Hero Grid */}
      <div className="relative my-auto grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-6 py-2 md:grid-cols-3 md:gap-0">
        {/* Left Column: Title */}
        <div className="z-20 order-1 text-center md:text-right flex items-center justify-center md:justify-end">
          <div className="max-w-[500px] w-full">
            <h1 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] leading-[0.88] tracking-[-0.05em] text-foreground">
              {headlineLeft.line1}
              <br />
              <span className="text-primary">{headlineLeft.line2}</span>
              <br />
              {headlineLeft.line3}
            </h1>
          </div>
        </div>

        {/* Center Column: Portrait with Circular Glowing Aura Behind and Soft Gradient Fade at Bottom */}
        <div className="relative order-2 flex items-center justify-center py-2 sm:py-4">
          <div className="relative flex items-center justify-center">
            {/* Soft Ambient Glow Halos Behind the Circle */}
            <div
              className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] md:h-[380px] md:w-[380px] lg:h-[420px] lg:w-[420px] rounded-full bg-primary/25 blur-3xl dark:bg-primary/35 transition-all duration-700"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 h-[220px] w-[220px] sm:h-[280px] sm:w-[280px] md:h-[340px] md:w-[340px] lg:h-[380px] lg:w-[380px] rounded-full bg-primary/20 blur-xl dark:bg-primary/30"
              aria-hidden="true"
            />

            {/* Glowing Emerald Circular Disc / Spotlight Aura Behind Subject */}
            <div
              className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 h-[230px] w-[230px] sm:h-[290px] sm:w-[290px] md:h-[350px] md:w-[350px] lg:h-[390px] lg:w-[390px] rounded-full bg-[radial-gradient(circle_at_50%_45%,#1c8764_0%,#157153_55%,rgba(21,113,83,0)_74%)] dark:bg-[radial-gradient(circle_at_50%_45%,#24dca5_0%,#168e69_55%,rgba(22,142,105,0)_74%)]"
              aria-hidden="true"
            />

            {/* Portrait Image (Natural proportions, sits in front of circle, bottom fades seamlessly) */}
            <div className="relative z-10 flex flex-col items-center justify-end">
              <div className="hero-glitch-wrapper relative flex items-center justify-center [mask-image:linear-gradient(to_bottom,black_62%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,black_62%,transparent_98%)]">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="h-[280px] sm:h-[350px] md:h-[420px] lg:h-[470px] w-auto max-w-none object-contain object-top drop-shadow-[0_16px_36px_rgba(0,0,0,0.3)] transition-transform duration-500 hover:scale-[1.02]"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith("/profile.png")) {
                      target.src = "/profile.png";
                    }
                  }}
                />
              </div>

              {/* Bottom Soft Vignette to guarantee seamless fade into page background */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-background via-background/60 to-transparent z-20"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Statement */}
        <div className="z-20 order-3 text-center md:text-left flex items-center justify-center md:justify-start">
          <div className="max-w-[500px] w-full">
            <h2 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] leading-[0.88] tracking-[-0.05em] text-foreground">
              {headlineRight.line1}
              <br />
              <span className="text-foreground/80">{headlineRight.line2}</span>
              <br />
              <span className="text-primary">{headlineRight.line3}</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <footer className="z-30 flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-border/40 pt-4 text-muted-foreground sm:flex-row">
        <div className="flex items-center space-x-5">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="flex items-center gap-1.5 text-xs font-mono transition-colors hover:text-primary"
            >
              <link.icon className="h-4 w-4" />
              <span className="hidden md:inline">{link.label}</span>
            </a>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground/90">{availability}</span>
          </span>
          <span className="text-muted-foreground/40">+</span>
          <span className="text-muted-foreground">{locationText}</span>
          <span className="text-muted-foreground/40">+</span>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("about");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <span>Scroll to explore</span>
            <ArrowDown size={13} className="animate-bounce" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default MinimalistHero;
