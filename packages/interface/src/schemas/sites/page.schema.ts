import { z, ZodTypeAny } from "zod";
import { SiteBlockSchema } from "./block.schema";
import { siteMetaShape } from "./site.schema";
import { Constants, Tables } from "../../types";
import { SitePageFits } from "../../constants";
import { KebabCase } from "../patterns";

export const SitePageMetaSchema = z.object({
  ...siteMetaShape,
  pageFit: z.nativeEnum(SitePageFits).optional(),
});

const sitePageShape = {
  id: z.number().optional(),
  slug: z
    .string()
    .min(1, "Slug must contain at least 1 character.")
    .max(120, "Slug could contain maximum 120 characters.")
    .regex(
      KebabCase,
      `Slug must be in kebab-case\n(lowercase letters, numbers, and hyphens only)`
    ),
  name: z.string(),
  category: z.enum(Constants.site_pages_category_enum),
  meta: SitePageMetaSchema.optional(),
  order: z.number(),
  isHome: z.boolean(),
  isVisible: z.boolean(),
  blocks: z.array(SiteBlockSchema),
} satisfies Record<
  keyof Pick<
    Tables<"site_pages">,
    | "id"
    | "slug"
    | "name"
    | "category"
    | "meta"
    | "order"
    | "isHome"
    | "isVisible"
  >,
  ZodTypeAny
> & { blocks: ZodTypeAny };

export const SitePageSchema = z.object(sitePageShape);
