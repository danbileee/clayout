import { z, ZodTypeAny } from "zod";
import { SiteBlockTypes } from "../../constants";
import { Tables } from "../../types";

type BlockSchemaObject = Record<
  keyof Pick<
    Tables<"site_blocks">,
    "slug" | "name" | "type" | "data" | "style" | "container_style"
  >,
  ZodTypeAny
>;

const siteBlockShapeBase = {
  slug: z.string(),
  name: z.string(),
} satisfies Pick<BlockSchemaObject, "slug" | "name">;

const aligns = {
  left: "left",
  right: "right",
  center: "center",
  justify: "justify",
} as const;

const containerStyleShapeBase = {
  width: z.string(),
  align: z.nativeEnum(aligns),
  backgroundColor: z.string(),
  backgroundSize: z.string(),
  backgroundPosition: z.string(),
  backgroundRepeat: z.string(),
  backgroundImage: z.string(),
  borderWidth: z.string(),
  borderStyle: z.string(),
  borderColor: z.string(),
  borderRadius: z.string(),
  padding: z.string(),
  margin: z.string(),
};

export const TextBlockSchema = z.object({
  ...siteBlockShapeBase,
  type: z.literal(SiteBlockTypes.Text),
  data: z
    .object({
      value: z.string(),
    })
    .optional(),
  style: z
    .object({
      fontFamily: z.string(),
      fontSize: z.string(),
      lineHeight: z.string(),
      margin: z.string(),
    })
    .optional(),
  container_style: z.object(containerStyleShapeBase),
});

export const ImageBlockSchema = z.object({
  ...siteBlockShapeBase,
  type: z.literal(SiteBlockTypes.Image),
  data: z
    .object({
      url: z.string().url(),
      link: z.string().url(),
      alt: z.string(),
    })
    .optional(),
  style: z
    .object({
      width: z.string(),
    })
    .optional(),
  container_style: z.object(containerStyleShapeBase),
});

export const ButtonBlockSchema = z.object({
  ...siteBlockShapeBase,
  type: z.literal(SiteBlockTypes.Button),
  data: z
    .object({
      link: z.string().url(),
      text: z.string(),
    })
    .optional(),
  style: z
    .object({
      backgroundColor: z.string(),
      padding: z.string(),
      color: z.string(),
      fontFamily: z.string(),
      fontSize: z.string(),
      fontWeight: z.string(),
      borderWidth: z.string(),
      borderStyle: z.string(),
      borderColor: z.string(),
      borderRadius: z.string(),
      textDecoration: z.string(),
      textAlign: z.nativeEnum(aligns),
    })
    .optional(),
  container_style: z.object(containerStyleShapeBase),
});

export const SiteBlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  ImageBlockSchema,
  ButtonBlockSchema,
]);
