import type { CSSProperties } from "react";

/** Build an inline style object that may include CSS custom properties. */
export function varStyle(vars: Record<string, string | number>): CSSProperties {
  return vars as CSSProperties;
}
