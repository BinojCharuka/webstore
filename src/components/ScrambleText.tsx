import { useEffect, useRef, useState } from "react";

import { useInView } from "@/hooks/use-in-view";

const GLYPHS = "!<>-_\\/[]{}=+*^?#~%&$@";

/** Decodes text from random glyphs the first time it scrolls into view. */
export function ScrambleText({
  text,
  className,
  speed = 26,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.6 });
  const [out, setOut] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    let revealed = 0;
    const id = setInterval(() => {
      revealed += 1;
      setOut(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < revealed) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? " ";
          })
          .join(""),
      );
      if (revealed >= text.length) {
        clearInterval(id);
        setOut(text);
      }
    }, speed);
    return () => clearInterval(id);
  }, [inView, text, speed]);

  return (
    <span ref={ref} className={className}>
      {out}
    </span>
  );
}
