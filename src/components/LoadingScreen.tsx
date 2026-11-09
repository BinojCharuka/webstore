import { useEffect, useRef, useState, type ReactNode } from "react";
import { waitForPageReady } from "@/lib/page-ready";
import "./BlueprintLoader.css";

const LABELS = [
  "Establishing canvas",
  "Drawing navigation",
  "Structuring hero section",
  "Placing project cards",
  "Applying the visual language",
  "Interface assembled",
];

const STEP_SCHEDULE: [number, number][] = [
  [170, 1],
  [620, 2],
  [1160, 3],
  [1690, 4],
  [2330, 5],
];

// In-memory flag for in-app client navigation only
let appLoadedInMemory = false;

export function LoadingScreen({ imageSrc, children }: { imageSrc: string; children: ReactNode }) {
  // Only skip loader if this is an in-memory client navigation within the same SPA session
  const alreadyLoaded = appLoadedInMemory;
  const [ready, setReady] = useState(alreadyLoaded);
  const [step, setStep] = useState(alreadyLoaded ? 5 : 0);
  const [exit, setExit] = useState(alreadyLoaded);
  const [statusText, setStatusText] = useState(alreadyLoaded ? "Ready to explore" : LABELS[0]);
  const pageReadyRef = useRef(alreadyLoaded);

  useEffect(() => {
    // Prevent browser from auto-scrolling to a previous scroll offset on reload
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // If page just loaded fresh and has an old leftover hash, clear it and start at top
      if (!alreadyLoaded) {
        let targetSection: string | null = null;
        try {
          targetSection = sessionStorage.getItem("nav_target_section");
        } catch {}
        if (!targetSection && window.location.hash) {
          try {
            window.history.replaceState(null, "", window.location.pathname);
          } catch {}
        }
        window.scrollTo(0, 0);
      }
    }

    if (alreadyLoaded) {
      // Check if user specifically requested a section via navbar navigation
      let targetSection: string | null = null;
      try {
        targetSection = sessionStorage.getItem("nav_target_section");
      } catch {}
      if (targetSection) {
        try {
          sessionStorage.removeItem("nav_target_section");
        } catch {}
        const sectionId = targetSection.startsWith("#") ? targetSection.slice(1) : targetSection;
        const timer = setTimeout(() => {
          const el =
            document.getElementById(sectionId) ||
            (sectionId === "projects" ? document.getElementById("work") : null);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        return () => clearTimeout(timer);
      } else {
        window.scrollTo(0, 0);
      }
      return;
    }

    // Check prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      appLoadedInMemory = true;
      setReady(true);
      window.scrollTo(0, 0);
      return;
    }

    const controller = new AbortController();
    const timers: NodeJS.Timeout[] = [];

    // 1. Wait for page assets (fonts, images, document load)
    void waitForPageReady(imageSrc, controller.signal, () => {}).then(() => {
      pageReadyRef.current = true;
    });

    // 2. Play blueprint sequence
    for (const [delay, s] of STEP_SCHEDULE) {
      timers.push(
        setTimeout(() => {
          if (controller.signal.aborted) return;
          setStep(s);
          setStatusText(LABELS[s]);
        }, delay),
      );
    }

    // 3. Coordinate exit when animation completes and assets are ready
    const finishCheck = () => {
      if (controller.signal.aborted) return;
      if (pageReadyRef.current) {
        setStatusText("Ready to explore");
        setExit(true);
        timers.push(
          setTimeout(() => {
            if (!controller.signal.aborted) {
              appLoadedInMemory = true;
              setReady(true);

              // Only scroll to a section if user explicitly navigated to it via nav bar
              let targetSection: string | null = null;
              try {
                targetSection = sessionStorage.getItem("nav_target_section");
              } catch {}
              if (targetSection) {
                try {
                  sessionStorage.removeItem("nav_target_section");
                } catch {}
                const sectionId = targetSection.startsWith("#")
                  ? targetSection.slice(1)
                  : targetSection;
                setTimeout(() => {
                  const el =
                    document.getElementById(sectionId) ||
                    (sectionId === "projects" ? document.getElementById("work") : null);
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 80);
              } else {
                // Otherwise always stay at top (Hero section)
                window.scrollTo(0, 0);
              }
            }
          }, 720),
        );
      } else {
        // Assets still loading, check again shortly
        timers.push(setTimeout(finishCheck, 100));
      }
    };

    timers.push(setTimeout(finishCheck, 2750));

    return () => {
      controller.abort();
      timers.forEach(clearTimeout);
    };
  }, [imageSrc, alreadyLoaded]);

  useEffect(() => {
    if (ready) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [ready]);

  const pct = Math.min(100, step * 20);

  return (
    <>
      {!ready && (
        <div
          className="blueprint-loader"
          data-step={String(step)}
          data-exit={exit ? "true" : "false"}
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          <div className="bp-grid-texture" aria-hidden="true" />
          <div className="bp-shell">
            <header className="bp-overline">
              <span className="bp-status-dot" />
              <span>BC / DIGITAL WORKSPACE</span>
              <span className="bp-overline-right">DESIGN SYSTEM · 001</span>
            </header>

            <div className="bp-browser" aria-hidden="true">
              <div className="bp-browser-header">
                <div className="bp-window-dots">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="bp-url">binoj.charuka / portfolio</span>
                <span className="bp-code-icon">&lt;/&gt;</span>
              </div>

              <div className="bp-browser-body">
                <div className="bp-navbar" id="navbar" data-built={step >= 1 ? "true" : "false"}>
                  <div className="bp-brand-mark" />
                  <div className="bp-nav-items">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>

                <div className="bp-hero" id="hero" data-built={step >= 2 ? "true" : "false"}>
                  <div className="bp-hero-copy">
                    <span className="bp-eyebrow">01 / INTRODUCTION</span>
                    <div className="bp-heading-wires">
                      <i />
                      <i />
                    </div>
                    <div className="bp-finished-heading">
                      Binoj
                      <br />
                      Charuka<span>.</span>
                    </div>
                    <div className="bp-copy-wires">
                      <i />
                      <i />
                      <i />
                    </div>
                    <span className="bp-button-wire">
                      <i /> EXPLORE WORK <span>↗</span>
                    </span>
                  </div>

                  <div className="bp-portrait-wire">
                    <div className="bp-portrait-cross bp-cross-a" />
                    <div className="bp-portrait-cross bp-cross-b" />
                    <span className="bp-image-guides">IMAGE / 01</span>
                    <span className="bp-portrait-symbol">◈</span>
                  </div>
                </div>

                <div
                  className="bp-work-grid"
                  id="projects"
                  data-built={step >= 3 ? "true" : "false"}
                >
                  <div className="bp-work-card">
                    <span>01 / PROJECT</span>
                    <i className="bp-card-wide" />
                    <i className="bp-card-short" />
                    <b>↗</b>
                  </div>
                  <div className="bp-work-card">
                    <span>02 / PROJECT</span>
                    <i className="bp-card-wide" />
                    <i className="bp-card-short" />
                    <b>↗</b>
                  </div>
                  <div className="bp-work-card">
                    <span>03 / PROJECT</span>
                    <i className="bp-card-wide" />
                    <i className="bp-card-short" />
                    <b>↗</b>
                  </div>
                </div>
              </div>
            </div>

            <footer className="bp-footer">
              <div className="bp-footer-line">
                <span>
                  <span className="bp-footer-prompt">&gt;</span> <span>{statusText}</span>
                </span>
                <span className="bp-percent">{String(pct).padStart(2, "0")}%</span>
              </div>
              <div
                className="bp-progress-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <div className="bp-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="bp-bottom-caption">
                <span>WIREFRAME → INTERFACE</span>
                <span>CODE + CREATIVITY</span>
              </div>
            </footer>
          </div>
        </div>
      )}

      <div
        className="portfolio-content"
        hidden={!ready}
        inert={!ready}
        aria-busy={!ready}
        key={ready ? "ready" : "loading"}
      >
        {children}
      </div>

      <noscript>
        <style>
          {
            ".blueprint-loader{display:none !important}.portfolio-content[hidden]{display:block !important}"
          }
        </style>
      </noscript>
    </>
  );
}
