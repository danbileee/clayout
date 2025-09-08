import { styled } from "styled-components";
import { SIDEBAR_WIDTH } from "../shared/constants";
import { rem } from "@/utils/rem";
import { SiteMenus, useSiteContext } from "../contexts/site.context";
import { Menu } from "./menu";
import { Blockbar } from "./blockbar";
import { Pagebar } from "./pagebar";
import { SavedBlockbar } from "./saved-blockbar";

export function EditorSidebar() {
  const { menu } = useSiteContext();

  return (
    <Aside>
      <Menu />
      {menu === SiteMenus.Blocks && <Blockbar />}
      {menu === SiteMenus.Pages && <Pagebar />}
      {menu === SiteMenus["Saved Blocks"] && <SavedBlockbar />}
    </Aside>
  );
}

const Aside = styled.aside`
  display: flex;
  width: ${rem(SIDEBAR_WIDTH)};
  height: 100svh;
`;
