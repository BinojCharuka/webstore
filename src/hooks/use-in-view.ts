import { useEffect, useRef, useState } from "react";

type Options = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

/** Track when an element scrolls into the viewport. */
export function useInView<T extends HTMLElement>(options: Options = {}) {
  const { threshold = 0.15, rootMargin = "0px 0px -8% 0px", once = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
