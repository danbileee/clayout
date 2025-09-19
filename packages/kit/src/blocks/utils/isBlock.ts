import type { z } from "zod";
import {
  ButtonBlockSchema,
  ImageBlockSchema,
  SiteBlockSchema,
  SiteBlockTypes,
  TextBlockSchema,
} from "@clayout/interface";

type AnySiteBlock = z.infer<typeof SiteBlockSchema>;

// Overloads for precise narrowing by discriminant
export function isBlock(
  block: AnySiteBlock,
  type: typeof SiteBlockTypes.Text
): block is z.infer<typeof TextBlockSchema>;
export function isBlock(
  block: AnySiteBlock,
  type: typeof SiteBlockTypes.Image
): block is z.infer<typeof ImageBlockSchema>;
export function isBlock(
  block: AnySiteBlock,
  type: typeof SiteBlockTypes.Button
): block is z.infer<typeof ButtonBlockSchema>;
// Generic fallback
export function isBlock<T extends AnySiteBlock["type"]>(
  block: AnySiteBlock,
  type: T
): block is Extract<AnySiteBlock, { type: T }>;

export function isBlock(
  block: AnySiteBlock,
  type: AnySiteBlock["type"]
): boolean {
  return block?.type === type;
}
