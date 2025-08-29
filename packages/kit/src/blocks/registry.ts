import type { z } from "zod";
import type { SiteBlockSchema } from "@clayout/interface";
import { TextBlock } from "./modules/Text";
import { ImageBlock } from "./modules/Image";
import { ButtonBlock } from "./modules/Button";

const SiteBlocks = [TextBlock, ImageBlock, ButtonBlock];

interface Options {
  renderType: "site" | "email" | "form";
}

export class BlockRegistry {
  find(block: z.infer<typeof SiteBlockSchema>, options?: Options) {
    const blocksMap: Record<Options["renderType"], typeof SiteBlocks> = {
      site: SiteBlocks,
      email: [],
      form: [],
    };

    const { type, ...data } = block;
    const { renderType = "site" } = options ?? {};

    if (!type) {
      throw new Error("Block type is wrong!");
    }

    const Block = blocksMap[renderType].find(
      (BlockConstructor) => BlockConstructor.type === type
    );

    if (!Block) {
      throw new Error("Block data is wrong!");
    }

    return new Block(data);
  }
}
