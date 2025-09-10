import { SiteBlockTypes, type SiteBlockType } from "@clayout/interface";
import {
  IconHandFinger,
  IconPhoto,
  IconTextSize,
  IconX,
  type TablerIcon,
} from "@tabler/icons-react";

export const MENU_WIDTH = 72;
export const BAR_WIDTH = 288;
export const SIDEBAR_WIDTH = MENU_WIDTH + BAR_WIDTH;

export const BlockIcons: Record<SiteBlockType, TablerIcon> = {
  [SiteBlockTypes.None]: IconX,
  [SiteBlockTypes.Text]: IconTextSize,
  [SiteBlockTypes.Image]: IconPhoto,
  [SiteBlockTypes.Button]: IconHandFinger,
} as const;

export const BlockNames: Record<SiteBlockType, string> = {
  [SiteBlockTypes.None]: "None",
  [SiteBlockTypes.Text]: "Text",
  [SiteBlockTypes.Image]: "Image",
  [SiteBlockTypes.Button]: "Button",
} as const;
