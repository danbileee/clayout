import { z, ZodTypeAny } from "zod";
import { SiteBlockTypes } from "../../constants";
import { Tables } from "../../types";

type BlockSchemaObject = Record<
  keyof Pick<
    Tables<"site_blocks">,
    "id" | "slug" | "name" | "type" | "data" | "style" | "containerStyle"
  >,
  ZodTypeAny
>;

const siteBlockShapeBase = {
  id: z.number().optional(),
  slug: z.string(),
  name: z.string(),
} satisfies Pick<BlockSchemaObject, "id" | "slug" | "name">;

const aligns = {
  left: "left",
  right: "right",
  center: "center",
  justify: "justify",
} as const;

const containerStyleShapeBase = {
  width: z.string().optional(),
  align: z.nativeEnum(aligns).optional(),
  backgroundColor: z.string().optional(),
  backgroundSize: z.string().optional(),
  backgroundPosition: z.string().optional(),
  backgroundRepeat: z.string().optional(),
  backgroundImage: z.string().optional(),
  borderWidth: z.string().optional(),
  borderStyle: z.string().optional(),
  borderColor: z.string().optional(),
  borderRadius: z.string().optional(),
  padding: z.string().optional(),
  margin: z.string().optional(),
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
      color: z.string(),
      fontFamily: z.string(),
      fontSize: z.string(),
      fontWeight: z.string(),
      lineHeight: z.string(),
      margin: z.string(),
    })
    .optional(),
  containerStyle: z.object(containerStyleShapeBase).optional(),
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
  containerStyle: z.object(containerStyleShapeBase).optional(),
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
  containerStyle: z.object(containerStyleShapeBase).optional(),
});

export const SiteBlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  ImageBlockSchema,
  ButtonBlockSchema,
]);
