export const SiteStatuses = {
  Draft: "Draft",
  Published: "Published",
  Reviewing: "Reviewing",
  Updating: "Updating",
  Error: "Error",
} as const;

export type SiteStatus = keyof typeof SiteStatuses;

export const SiteCategories = {
  None: "None",
  Blog: "Blog",
  "Landing Page": "Landing Page",
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

export type SiteBlockType = keyof typeof SiteBlockTypes;

export const SiteDomainStatuses = {
  Pending: "Pending",
  Verified: "Verified",
  Error: "Error",
} as const;

export type SitedomainStatus = keyof typeof SiteDomainStatuses;

export const SiteContentFits = {
  sm: "sm",
  md: "md",
  lg: "lg",
  full: "full",
} as const;

export type SiteContentFit = keyof typeof SiteContentFits;

export const SiteContentFitWidth: Record<SiteContentFit, string> = {
  sm: "375px",
  md: "768px",
  lg: "1440px",
  full: "100%",
};

export const SiteContentFitLabel: Record<SiteContentFit, string> = {
  sm: "Small (375px)",
  md: "Medium (768px)",
  lg: "Large (1440px)",
  full: "Full (100%)",
};
