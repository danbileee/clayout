import { SiteBlockTypes, type SiteBlockType } from "@clayout/interface";
import { TextBlockData } from "./modules/Text";
import { ImageBlockData } from "./modules/Image";
import { ButtonBlockData } from "./modules/Button";

export const BlockData: Omit<
  Record<
    SiteBlockType,
    typeof TextBlockData | typeof ImageBlockData | typeof ButtonBlockData
  >,
  "None"
> = {
  [SiteBlockTypes.Text]: TextBlockData,
  [SiteBlockTypes.Image]: ImageBlockData,
  [SiteBlockTypes.Button]: ButtonBlockData,
} as const;
