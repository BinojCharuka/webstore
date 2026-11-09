import { cn } from "@/lib/utils";

/** Endless horizontal ticker of words. */
export function Marquee({
  items,
  reverse = false,
  className,
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div className={cn("flex w-max gap-12", reverse ? "animate-marquee-rev" : "animate-marquee")}>
        {[false, true].map((hidden) => (
          <div
            key={String(hidden)}
            className="flex shrink-0 items-center gap-12"
            aria-hidden={hidden}
          >
            {items.map((item) => (
              <span
                key={item}
                className="flex items-center gap-12 font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground"
              >
                {item}
                <span className="text-primary">✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
