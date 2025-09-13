import { css, styled } from "styled-components";
import useMeasure from "react-use-measure";
import { SIDEBAR_WIDTH } from "./constants";
import { Page } from "./page";
import { Header } from "./header";
import { rem } from "@/utils/rem";
import { useSiteContext } from "../contexts/site.context";

export function EditorViewer() {
  const { closeBlockEditor } = useSiteContext();
  const [headerRef, { height: headerHeight }] = useMeasure();

  const handleMainClick = () => {
    closeBlockEditor();
  };

  return (
    <Wrapper>
      <Header ref={headerRef} />
      <Main $headerHeight={headerHeight} onClick={handleMainClick}>
        <Canvas>
          <Page />
        </Canvas>
      </Main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - ${rem(SIDEBAR_WIDTH)});
`;

const Main = styled.main<{ $headerHeight: number }>`
  ${({ $headerHeight }) => css`
    width: 100%;
    max-height: calc(100svh - ${rem($headerHeight)});
    padding: ${rem(40)} 0;
    margin-top: ${rem($headerHeight)};
    overflow-y: auto;
  `}
`;

const Canvas = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  margin: 0 auto;
`;
