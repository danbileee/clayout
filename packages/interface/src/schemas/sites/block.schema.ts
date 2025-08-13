import { z, ZodTypeAny } from "zod";
import { SiteBlockTypes } from "../../constants";
import { Tables } from "../../types";

export const TextBlockSchema = z.object({
  type: z.literal(SiteBlockTypes.Text),
  data: z.object({
    value: z.string(),
  }),
});

export const ImageBlockSchema = z.object({
  type: z.literal(SiteBlockTypes.Image),
  data: z.object({
    url: z.string().url(),
    alt: z.string(),
  }),
});

export const ButtonBlockSchema = z.object({
  type: z.literal(SiteBlockTypes.Button),
  data: z.object({
    link: z.string().url(),
    text: z.string(),
  }),
});

const BlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  ImageBlockSchema,
  ButtonBlockSchema,
]);

const siteBlockShape = {
  slug: z.string(),
  name: z.string(),
} satisfies Record<
  keyof Pick<Tables<"site_blocks">, "slug" | "name">,
  ZodTypeAny
>;

export const SiteBlockSchema = z.object(siteBlockShape).and(BlockSchema);
