import { z, ZodTypeAny } from "zod";
import { SiteBlockTypes } from "../../constants";
import { Tables } from "../../types";

type BlockSchemaObject = Record<
  keyof Pick<
    Tables<"site_blocks">,
    | "id"
    | "slug"
    | "name"
    | "type"
    | "data"
    | "style"
    | "containerStyle"
    | "order"
  >,
  ZodTypeAny
>;

const siteBlockShapeBase = {
  id: z.number().optional(),
  slug: z.string(),
  name: z.string().optional(),
  order: z.number(),
} satisfies Pick<BlockSchemaObject, "id" | "slug" | "name" | "order">;

const BlockAligns = {
  left: "left",
  right: "right",
  center: "center",
  justify: "justify",
} as const;

const containerStyleShapeBase = {
  width: z.string().optional(),
  align: z.nativeEnum(BlockAligns).optional(),
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
  data: z.object({
    value: z.string().optional(),
  }),
  style: z.object({
    width: z.string().optional(),
    color: z.string().optional(),
    fontFamily: z.string().optional(),
    fontSize: z.string().optional(),
    fontWeight: z.string().optional(),
    lineHeight: z.string().optional(),
    margin: z.string().optional(),
  }),
  containerStyle: z.object(containerStyleShapeBase),
});

export const ImageBlockSchema = z.object({
  ...siteBlockShapeBase,
  type: z.literal(SiteBlockTypes.Image),
  data: z.object({
    url: z.string().optional(),
    link: z.string().optional(),
    alt: z.string().optional(),
  }),
  style: z.object({
    width: z.string().optional(),
  }),
  containerStyle: z.object(containerStyleShapeBase),
});

export const ButtonBlockSchema = z.object({
  ...siteBlockShapeBase,
  type: z.literal(SiteBlockTypes.Button),
  data: z.object({
    link: z.string().optional(),
    text: z.string().optional(),
  }),
  style: z.object({
    width: z.string().optional(),
    backgroundColor: z.string().optional(),
    padding: z.string().optional(),
    color: z.string().optional(),
    fontFamily: z.string().optional(),
    fontSize: z.string().optional(),
    fontWeight: z.string().optional(),
    borderWidth: z.string().optional(),
    borderStyle: z.string().optional(),
    borderColor: z.string().optional(),
    borderRadius: z.string().optional(),
    textDecoration: z.string().optional(),
    textAlign: z.nativeEnum(BlockAligns),
  }),
  containerStyle: z.object(containerStyleShapeBase),
});

export const SiteBlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  ImageBlockSchema,
  ButtonBlockSchema,
]);
