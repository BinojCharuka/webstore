import { useEffect, useState } from "react";

/** Types `text` out one character at a time after mounting. */
export function Typewriter({
  text,
  speed = 55,
  startDelay = 500,
  className,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length && interval) clearInterval(interval);
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
    </span>
  );
}
