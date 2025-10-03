import { z } from "zod";
import { Tables } from "./supabase";
import {
  ButtonBlockSchema,
  ImageBlockSchema,
  PaginateSiteSchema,
  SiteBlockSchema,
  SiteMetaSchema,
  SitePageMetaSchema,
  SitePageSchema,
  SiteSchema,
  TextBlockSchema,
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
  domains: Tables<"site_domains">[];
};

export type SitesWithRelations = Omit<Tables<"sites">, "authorId"> & {
  author: Tables<"users">;
};

export type CreateSiteDto = z.infer<typeof SiteSchema>;

export type UpdateSiteDto = Partial<CreateSiteDto>;

export type PaginateSiteDto = z.infer<typeof PaginateSiteSchema>;

export type SiteMeta = z.infer<typeof SiteMetaSchema>;

export type SitePageMeta = z.infer<typeof SitePageMetaSchema>;

export type SitePageContainerStyle = z.infer<
  (typeof SitePageSchema)["shape"]["containerStyle"]
>;

export type SiteBlockContainerStyle = BlockSchema["containerStyle"];

export type PageSchema = z.infer<typeof SitePageSchema>;

export type CreateSitePageDto = PageSchema;

export type UpdateSitePageDto = Partial<PageSchema>;

export type ChangeSiteHomePageDto = {
  newPageId: number;
};

export type BlockSchema = z.infer<typeof SiteBlockSchema>;

export type CreateSiteBlockDto = BlockSchema;

export type UpdateSiteBlockDto = Partial<BlockSchema>;

export const BlockSchemaByType = {
  Text: TextBlockSchema,
  Image: ImageBlockSchema,
  Button: ButtonBlockSchema,
} as const;

export type BlockOf<T extends keyof typeof BlockSchemaByType> = z.infer<
  (typeof BlockSchemaByType)[T]
>;

export const isBlockOfType = <T extends keyof typeof BlockSchemaByType>(
  block: BlockSchema,
  type: T
): block is BlockOf<T> => block.type === type;

export type BlockDataOf<T extends BlockSchema["type"]> = BlockOf<T>["data"];
export type BlockStyleOf<T extends BlockSchema["type"]> = BlockOf<T>["style"];
export type BlockContainerStyleOf<T extends BlockSchema["type"]> =
  BlockOf<T>["containerStyle"];
export type BlockData = NonNullable<BlockSchema["data"]>;
export type BlockStyle = NonNullable<BlockSchema["style"]>;
export type BlockContainerStyle = NonNullable<BlockSchema["containerStyle"]>;
