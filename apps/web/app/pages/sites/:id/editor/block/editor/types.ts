import type { z } from "zod";
import { SiteBlockSchema, type SiteBlock } from "@clayout/interface";

export interface BlockEditorProps<T extends z.infer<typeof SiteBlockSchema>>
  extends Pick<SiteBlock, "createdAt" | "updatedAt"> {
  block: T;
}
