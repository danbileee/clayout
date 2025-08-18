import { z, ZodTypeAny } from "zod";
import { Constants, Tables } from "../../types";
import { SiteBlockSchema } from "./block.schema";

export const SitePageMetaSchema = z.object({});

const sitePageShape = {
  slug: z.string(),
  name: z.string(),
  category: z.enum(Constants.site_pages_category_enum),
  meta: SitePageMetaSchema.optional(),
  blocks: z.array(SiteBlockSchema),
} satisfies Record<
  keyof Pick<Tables<"site_pages">, "slug" | "name" | "category" | "meta">,
  ZodTypeAny
> & { blocks: ZodTypeAny };

export const SitePageSchema = z.object(sitePageShape);
