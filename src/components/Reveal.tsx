import type { ElementType, ReactNode } from "react";

import { useInView } from "@/hooks/use-in-view";
import { varStyle } from "@/lib/anim";
import { cn } from "@/lib/utils";

type Variant = "up" | "left" | "right" | "scale" | "blur" | "none";

/** Fades and slides its children in the first time they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  as = "div",
  threshold,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
  as?: ElementType;
  threshold?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(threshold === undefined ? {} : { threshold });
  const Comp = as as ElementType;

  return (
    <Comp
      ref={ref}
      data-in={inView ? "true" : "false"}
      data-variant={variant}
      style={varStyle({ "--reveal-delay": `${delay}ms` })}
      className={cn("reveal", className)}
    >
      {children}
    </Comp>
  );
}
