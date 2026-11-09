import { useRef, type MouseEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Card whose glow tracks the pointer, with a lift on hover. */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn("spotlight group rounded-2xl border bg-card p-7", className)}
    >
      {children}
    </div>
  );
}
