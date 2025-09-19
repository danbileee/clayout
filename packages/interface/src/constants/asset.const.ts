export const AssetTargetTypes = {
  None: "None",
  Site: "Site",
} as const;

export type AssetTargetType = keyof typeof AssetTargetTypes;

export const AssetPaths: Record<AssetTargetType, string> = {
  [AssetTargetTypes.None]: "",
  [AssetTargetTypes.Site]: "sites",
};
