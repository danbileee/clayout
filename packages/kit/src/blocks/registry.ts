import type { z } from "zod";
import type { SiteBlockSchema } from "@clayout/interface";
import { TextBlock } from "./modules/Text";
import { ImageBlock } from "./modules/Image";
import { ButtonBlock } from "./modules/Button";

const SiteBlocks = [TextBlock, ImageBlock, ButtonBlock];

export class BlockRegistry {
  find(block: z.infer<typeof SiteBlockSchema>) {
    const { type } = block;

    if (!type) {
      throw new Error("Block type is required.");
    }

    const Block = SiteBlocks.find(
      (BlockConstructor) => BlockConstructor.type === type
    );

    if (!Block) {
      throw new Error("Block data is wrong!");
    }

    return new Block(block as never);
  }
}
