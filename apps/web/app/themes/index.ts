import { colors } from "./colors";
import { shadow } from "./shadow";

export const theme = {
  colors,
  shadow,
} as const;

export type Theme = typeof theme;
