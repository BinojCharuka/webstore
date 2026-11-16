"use client";

import React, { useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

export type ThemeAnimationType =
  | "none"
  | "circle-spread"
  | "round-morph"
  | "swipe-left"
  | "swipe-up"
  | "diag-down-right"
  | "fade-in-out"
  | "shrink-grow"
  | "flip-x-in"
  | "split-vertical"
  | "swipe-right"
  | "swipe-down"
  | "wave-ripple";

export interface ThemeToggleProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
  animationType?: ThemeAnimationType;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  duration = 500,
  animationType = "circle-spread",
  ...props
}) => {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = theme === "dark";

  const handleToggle = useCallback(async () => {
    if (!buttonRef.current) {
      toggleTheme();
      return;
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fallback if View Transitions API is not supported or user prefers reduced motion
    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document) ||
      reduceMotion ||
      animationType === "none"
    ) {
      toggleTheme();
      return;
    }

    // Get origin coordinates from the toggle button
    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Start View Transition and wait for DOM update
    const transition = (document as any).startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    });

    try {
      await transition.ready;
    } catch {
      return;
    }

    switch (animationType) {
      case "circle-spread":
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "round-morph":
        document.documentElement.animate(
          [
            { opacity: 0, transform: "scale(0.8) rotate(5deg)" },
            { opacity: 1, transform: "scale(1) rotate(0deg)" },
          ],
          {
            duration: duration * 1.2,
            easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "swipe-left":
        document.documentElement.animate(
          {
            clipPath: [
              `inset(0 0 0 ${viewportWidth}px)`,
              `inset(0 0 0 0)`,
            ],
          },
          {
            duration,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "swipe-right":
        document.documentElement.animate(
          {
            clipPath: [
              `inset(0 ${viewportWidth}px 0 0)`,
              `inset(0 0 0 0)`,
            ],
          },
          {
            duration,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "swipe-up":
        document.documentElement.animate(
          {
            clipPath: [
              `inset(${viewportHeight}px 0 0 0)`,
              `inset(0 0 0 0)`,
            ],
          },
          {
            duration,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "swipe-down":
        document.documentElement.animate(
          {
            clipPath: [
              `inset(0 0 ${viewportHeight}px 0)`,
              `inset(0 0 0 0)`,
            ],
          },
          {
            duration,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "diag-down-right":
        document.documentElement.animate(
          {
            clipPath: [
              `polygon(0 0, 0 0, 0 0, 0 0)`,
              `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
            ],
          },
          {
            duration: duration * 1.5,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "fade-in-out":
        document.documentElement.animate(
          {
            opacity: [0, 1],
          },
          {
            duration: duration * 0.5,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      case "shrink-grow":
        document.documentElement.animate(
          [
            { transform: "scale(0.9)", opacity: 0 },
            { transform: "scale(1)", opacity: 1 },
          ],
          {
            duration: duration * 1.2,
            easing: "cubic-bezier(0.19, 1, 0.22, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        document.documentElement.animate(
          [
            { transform: "scale(1)", opacity: 1 },
            { transform: "scale(1.05)", opacity: 0 },
          ],
          {
            duration: duration * 1.2,
            easing: "cubic-bezier(0.19, 1, 0.22, 1)",
            pseudoElement: "::view-transition-old(root)",
          }
        );
        break;

      case "split-vertical":
        document.documentElement.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          {
            duration: duration * 0.75,
            easing: "ease-in",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        document.documentElement.animate(
          [
            { clipPath: "inset(0 0 0 0)", transform: "none" },
            { clipPath: "inset(0 40% 0 40%)", transform: "scale(1.2)" },
            { clipPath: "inset(0 50% 0 50%)", transform: "scale(1)" },
          ],
          {
            duration: duration * 1.5,
            easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            pseudoElement: "::view-transition-old(root)",
          }
        );
        break;

      case "wave-ripple":
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0% at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: duration * 1.4,
            easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
        break;

      default:
        break;
    }
  }, [toggleTheme, duration, animationType]);

  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      aria-label={label}
      title={label}
      data-cursor-label="Theme"
      className={cn(
        "cursor-target relative flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background/80 text-foreground shadow-xs backdrop-blur-xs transition-all duration-300 hover:border-primary/60 hover:text-primary active:scale-90",
        isDark ? "hover:border-amber-400/60 hover:text-amber-400" : "hover:border-primary/60 hover:text-primary",
        className
      )}
      {...props}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <Sun
          className={cn(
            "h-4 w-4 transition-all duration-300",
            isDark ? "rotate-0 scale-100 text-amber-400" : "-rotate-90 scale-0 absolute text-foreground"
          )}
          aria-hidden="true"
        />
        <Moon
          className={cn(
            "h-4 w-4 transition-all duration-300",
            isDark ? "rotate-90 scale-0 absolute text-amber-400" : "rotate-0 scale-100 text-foreground"
          )}
          aria-hidden="true"
        />
      </span>
    </button>
  );
};

export const ToggleTheme = ThemeToggle;
export default ThemeToggle;
