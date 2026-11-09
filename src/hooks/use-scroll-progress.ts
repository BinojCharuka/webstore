import { useEffect, useRef, useState } from "react";

/** Current vertical scroll offset in pixels (0 until hydrated). */
export function useScrollY() {
  const [y, setY] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setY(window.scrollY);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return y;
}

/**
 * How far an element has travelled through the viewport, from 0 (entering)
 * to 1 (leaving). `offset` is the fraction of viewport height used as the
 * reference line.
 */
export function useScrollProgress<T extends HTMLElement>(offset = 0.6) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight * offset;
      const passed = window.innerHeight * offset - rect.top;
      setProgress(total > 0 ? Math.min(1, Math.max(0, passed / total)) : 1);
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
  }, [offset]);

  return { ref, progress };
}
