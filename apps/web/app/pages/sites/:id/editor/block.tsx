import { BlockRegistry } from "@clayout/kit";
import { SiteBlockSchema, type SiteBlock } from "@clayout/interface";

interface Props {
  block: SiteBlock;
}

export function Block({ block: blockProp }: Props) {
  const parsedBlock = SiteBlockSchema.parse(blockProp);
  const block = new BlockRegistry().find(parsedBlock);

  return block.renderToJsx();
}
