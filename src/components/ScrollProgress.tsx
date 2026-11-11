import { useEffect, useState } from "react";

import { varStyle } from "@/lib/anim";

/**
 * Precision scroll progress bar pinned to the viewport top edge.
 * Features an organic gradient track and a luminous leading-edge beacon.
 */
export function ScrollProgress() {
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setRatio(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent"
    >
      <div
        className="relative h-full origin-left bg-gradient-to-r from-primary via-primary to-primary-glow transition-transform duration-75 ease-out"
        style={varStyle({ transform: `scaleX(${ratio})` })}
      >
        {/* Luminous beacon at the leading edge */}
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-[3px] h-[9px] w-[9px] rounded-full bg-primary-glow shadow-[0_0_12px_2px_var(--color-primary-glow)] transition-opacity duration-300"
          style={{ opacity: ratio > 0.01 && ratio < 0.99 ? 1 : 0 }}
        />
      </div>
    </div>
  );
}
