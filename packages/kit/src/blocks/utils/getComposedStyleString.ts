import type { CSSProperties } from "react";

export function getComposedStyleString(style: CSSProperties) {
  return Object.entries(style)
    .map(([key, value]) => {
      const newKey = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      return `${newKey}: ${value};`;
    })
    .filter((newKey, value) => !newKey.startsWith("align:") && Boolean(value))
    .join(" ");
}
