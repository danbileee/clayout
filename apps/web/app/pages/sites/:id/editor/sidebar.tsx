import { styled } from "styled-components";
import { BLOCKBAR_WIDTH, MENU_WIDTH, SIDEBAR_WIDTH } from "./constants";
import { Button } from "@/components/ui/button";

export function EditorSidebar() {
  return (
    <Aside>
      <Menu>Menu</Menu>
      <Blockbar>
        <Buttons>
          <Button>Text</Button>
          <Button>Image</Button>
          <Button>Button</Button>
        </Buttons>
      </Blockbar>
    </Aside>
  );
}

const Aside = styled.aside`
  display: flex;
  width: ${SIDEBAR_WIDTH}px;
`;

const Menu = styled.div`
  width: ${MENU_WIDTH}px;
`;

const Blockbar = styled.div`
  width: ${BLOCKBAR_WIDTH}px;
  padding: 20px;
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;
