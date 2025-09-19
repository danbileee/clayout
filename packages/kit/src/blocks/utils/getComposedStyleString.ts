import type { CSSProperties } from "react";

export function getComposedStyleString(style: CSSProperties) {
  return Object.entries(style)
    .map(([key, value]) => {
      const newKey = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

      if (newKey === "background-image") {
        // Properly encode the URL for CSS using built-in encoding
        const encodedUrl = encodeURIComponent(value.trim());
        return `${newKey}: url(&quot;${encodedUrl}&quot;);`;
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
