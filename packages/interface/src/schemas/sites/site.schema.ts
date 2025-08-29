import { z, ZodTypeAny } from "zod";
import { Constants, Tables } from "../../types";
import { SitePageSchema } from "./page.schema";
import { PaginationSchema } from "../pagination";

export const SiteMetaSchema = z.object({});

const siteShape = {
  name: z.string(),
  slug: z.string(),
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
  allowedSortFields: ["createdAt", "updatedAt", "lastPublishedAt"],
  allowedFilterFields: ["createdAt", "updatedAt", "id", "category"],
});
