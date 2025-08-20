import { SIDEBAR_WIDTH } from "./constants";
import type { Tables } from "@clayout/interface";
import { styled } from "styled-components";

interface Props {
  site: Tables<"sites">;
}

export function EditorViewer({ site }: Props) {
  return (
    <Main>
      <Canvas></Canvas>
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - ${SIDEBAR_WIDTH}px);
  height: auto;
  padding: 40px;
`;

const Canvas = styled.div`
  width: 768px;
`;
