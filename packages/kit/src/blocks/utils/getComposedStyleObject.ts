import type { BlockSchema } from "@clayout/interface";

export function getComposedStyleObject(
  style: BlockSchema["containerStyle"]
): BlockSchema["containerStyle"] {
  const { backgroundImage } = style ?? {};

  return {
    ...style,
    backgroundImage: backgroundImage ? `url("${backgroundImage}")` : undefined,
  };
}
