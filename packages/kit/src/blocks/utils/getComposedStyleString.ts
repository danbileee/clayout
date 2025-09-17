import type { CSSProperties } from "react";

export function getComposedStyleString(style: CSSProperties) {
  return Object.entries(style)
    .map(([key, value]) => {
      const newKey = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

      if (newKey === "background-image") {
        return `${newKey}: url("${value}")`;
      }

      return `${newKey}: ${value};`;
    })
    .filter((newStyle) => {
      const [newKey, value] = newStyle.split(":");
      return (
        !newKey.startsWith("align:") && Boolean(value.trim().replace(";", ""))
      );
    })
    .join(" ");
}
