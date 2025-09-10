import { BlockRegistry } from "@clayout/kit";
import { SiteBlockSchema, type SiteBlock } from "@clayout/interface";
import { styled } from "styled-components";
import { useSiteContext } from "../../contexts/site.context";
import type { MouseEvent } from "react";

interface Props {
  block: SiteBlock;
}

export function Block({ block: blockProp }: Props) {
  const { block: selected, openBlockEditor } = useSiteContext();
  const parsedBlock = SiteBlockSchema.parse(blockProp);
  const block = new BlockRegistry().find(parsedBlock);

  const handleClickBlock = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (selected === blockProp) return;

    openBlockEditor(blockProp);
  };

  return (
    <BlockBase onClick={handleClickBlock}>
      {block.renderToJsx()}
      <BlockCover />
    </BlockBase>
  );
}

const BlockBase = styled.div`
  position: relative;
  width: 100%;
  height: auto;
`;

const BlockCover = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 1;
`;
