import { z, ZodTypeAny } from "zod";
import { SiteBlockSchema } from "./block.schema";
import { Constants, Tables } from "../../types";
import { SitePageFits } from "../../constants";
import {
  containerStyleShapeBase,
  metaShape,
  slugSchema,
} from "./shared.schema";

export const SitePageMetaSchema = z.object(metaShape);

const sitePageShape = {
  id: z.number().optional(),
  slug: slugSchema,
  name: z.string().max(100),
  category: z.enum(Constants.site_pages_category_enum),
  meta: SitePageMetaSchema.optional(),
  containerStyle: z.object({
    ...containerStyleShapeBase,
    pageFit: z.nativeEnum(SitePageFits).optional(),
  }),
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
    | "containerStyle"
    | "order"
    | "isHome"
    | "isVisible"
  >,
  ZodTypeAny
> & { blocks: ZodTypeAny };

export const SitePageSchema = z.object(sitePageShape);
