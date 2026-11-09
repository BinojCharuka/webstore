import type { ReactNode } from "react";

import { varStyle } from "@/lib/anim";
import { cn } from "@/lib/utils";

/** Headline line that slides up out of a clipping mask on load. */
export function MaskLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
      <span
        className={cn("reveal-mask", className)}
        style={varStyle({ "--reveal-delay": `${delay}ms` })}
      >
        {children}
      </span>
    </span>
  );
}
