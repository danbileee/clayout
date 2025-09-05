import { SiteBlockTypes } from "@clayout/interface";
import { TextBlockData } from "./modules/Text";
import { ImageBlockData } from "./modules/Image";
import { ButtonBlockData } from "./modules/Button";

export const BlockData = {
  [SiteBlockTypes.Text]: TextBlockData,
  [SiteBlockTypes.Image]: ImageBlockData,
  [SiteBlockTypes.Button]: ButtonBlockData,
} as const;
