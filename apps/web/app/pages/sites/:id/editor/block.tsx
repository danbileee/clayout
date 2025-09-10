import { BlockRegistry } from "@clayout/kit";
import { SiteBlockSchema, type SiteBlock } from "@clayout/interface";
import { styled } from "styled-components";
import { useSiteContext } from "../contexts/site.context";

interface Props {
  block: SiteBlock;
}

export function Block({ block: blockProp }: Props) {
  const { setBlock } = useSiteContext();
  const parsedBlock = SiteBlockSchema.parse(blockProp);
  const block = new BlockRegistry().find(parsedBlock);

  const handleClickBlock = () => {
    setBlock(blockProp);
  };

  return (
    <BlockBase onClick={handleClickBlock}>{block.renderToJsx()}</BlockBase>
  );
}

const BlockBase = styled.div``;
