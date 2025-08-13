export const SiteStatuses = {
  Draft: "Draft",
  Published: "Published",
  Reviewing: "Reviewing",
  Fixing: "Fixing",
} as const;

export type SiteStatus = keyof typeof SiteStatuses;

export const SiteCategories = {
  None: "None",
  Blog: "Blog",
  Newsletter: "Newsletter",
  Portfolio: "Portfolio",
  Hyperlink: "Hyperlink",
  Commerce: "Commerce",
} as const;

export type SiteCategory = keyof typeof SiteCategories;

export const SitePageCategories = {
  Static: "Static",
  List: "List",
  Article: "Article",
} as const;

export type SitePageCategory = keyof typeof SitePageCategories;

export const SiteBlockTypes = {
  None: "None",
  Text: "Text",
  Image: "Image",
  Button: "Button",
} as const;

export type StieBlockType = keyof typeof SiteBlockTypes;
