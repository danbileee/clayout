export const AssetTypes = {
  None: "None",
  Site: "Site",
  SitePage: "SitePage",
  SiteBlock: "SiteBlock",
} as const;

export type AssetType = keyof typeof AssetTypes;
