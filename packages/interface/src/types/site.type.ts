import { z } from "zod";
import { Tables } from "./supabase";
import { PaginateSiteSchema, SiteSchema } from "../schemas";

export type SiteBlock = Omit<Tables<"site_blocks">, "siteId" | "pageId">;

export type SitePageWithRelations = Omit<Tables<"site_pages">, "siteId"> & {
  blocks: SiteBlock[];
};

export type SiteWithRelations = Omit<Tables<"sites">, "authorId"> & {
  author: Tables<"users">;
  pages: SitePageWithRelations[];
};

export type SitesWithRelations = Omit<Tables<"sites">, "authorId"> & {
  author: Tables<"users">;
};

export type CreateSiteDto = z.infer<typeof SiteSchema>;

export type UpdateSiteDto = Partial<CreateSiteDto>;

export type PaginateSiteDto = z.infer<typeof PaginateSiteSchema>;
