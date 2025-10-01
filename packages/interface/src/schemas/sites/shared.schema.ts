import { z } from "zod";
import { KebabCase } from "../patterns";

export const slugSchema = z
  .string()
  .min(1, "Slug must contain at least 1 character.")
  .max(100, "Slug could contain maximum 100 characters.")
  .regex(
    KebabCase,
    `Slug must be in kebab-case\n(lowercase letters, numbers, and hyphens only)`
  );

export const metaShape = {
  description: z.string().max(200).optional(),
  ogImagePath: z.string().optional(),
  faviconPath: z.string().optional(),
};

export const Aligns = {
  left: "left",
  right: "right",
  center: "center",
  justify: "justify",
} as const;

export const containerStyleShapeBase = {
  width: z.string().optional(),
  align: z.nativeEnum(Aligns).optional(),
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
