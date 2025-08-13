import { z, ZodTypeAny } from "zod";
import { Constants, Tables } from "../../types";
import { SitePageSchema } from "./page.schema";

export const SiteMetaSchema = z.object({});

const siteShape = {
  slug: z.string(),
  name: z.string(),
  status: z.enum(Constants.sites_status_enum),
  category: z.enum(Constants.sites_category_enum),
  meta: SiteMetaSchema,
  pages: z.array(SitePageSchema),
} satisfies Record<
  keyof Pick<Tables<"sites">, "slug" | "name" | "status" | "meta" | "category">,
  ZodTypeAny
> & {
  pages: ZodTypeAny;
};

export const SiteSchema = z.object(siteShape);
