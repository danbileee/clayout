import { z, ZodTypeAny } from "zod";
import { SitePageSchema } from "./page.schema";
import { metaShape, slugSchema } from "./shared.schema";
import { PaginationSchema } from "../pagination.schema";
import { Constants, Tables } from "../../types";

export const SiteMetaSchema = z.object(metaShape);

const siteShape = {
  name: z.string(),
  slug: slugSchema,
  meta: SiteMetaSchema.optional(),
  category: z.enum(Constants.sites_category_enum).optional(),
  status: z.enum(Constants.sites_status_enum).optional(),
  pages: z.array(SitePageSchema),
} satisfies Record<
  keyof Pick<Tables<"sites">, "slug" | "name" | "status" | "meta" | "category">,
  ZodTypeAny
> & {
  pages: ZodTypeAny;
};

export const SiteSchema = z.object(siteShape);

export const PaginateSiteSchema = PaginationSchema.createWithConfig<
  Tables<"sites">
>({
  allowedSortProperties: ["createdAt", "updatedAt", "lastPublishedAt"],
  allowedFilterProperties: ["createdAt", "updatedAt", "id", "category"],
});
