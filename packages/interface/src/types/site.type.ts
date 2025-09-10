import { z } from "zod";
import { Tables } from "./supabase";
import {
  PaginateSiteSchema,
  SiteBlockSchema,
  SiteMetaSchema,
  SitePageMetaSchema,
  SitePageSchema,
  SiteSchema,
} from "../schemas";

export type SiteBlock = Omit<Tables<"site_blocks">, "siteId" | "pageId">;

export type SitePageWithRelations = Omit<
  Tables<"site_pages">,
  "siteId" | "meta"
> & {
  site: Omit<Tables<"sites">, "authorId" | "meta"> & {
    author: Tables<"users">;
    meta: SiteMeta;
  };
  meta: SitePageMeta;
  blocks: SiteBlock[];
};

export type SiteWithRelations = Omit<Tables<"sites">, "authorId" | "meta"> & {
  author: Tables<"users">;
  meta: SiteMeta;
  pages: SitePageWithRelations[];
};

export type SitesWithRelations = Omit<Tables<"sites">, "authorId"> & {
  author: Tables<"users">;
};

export type CreateSiteDto = z.infer<typeof SiteSchema>;

export type UpdateSiteDto = Partial<CreateSiteDto>;

export type PaginateSiteDto = z.infer<typeof PaginateSiteSchema>;

export type SiteMeta = z.infer<typeof SiteMetaSchema>;

export type SitePageMeta = z.infer<typeof SitePageMetaSchema>;

export type CreateSitePageDto = z.infer<typeof SitePageSchema>;

export type UpdateSitePageDto = Partial<CreateSitePageDto>;

export type ChangeSiteHomePageDto = {
  newPageId: number;
};

export type CreateSiteBlockDto = z.infer<typeof SiteBlockSchema>;

export type UpdateSiteBlockDto = Partial<CreateSiteBlockDto>;
