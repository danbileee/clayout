import { styled } from "styled-components";
import { SIDEBAR_WIDTH } from "./constants";
import { rem } from "@/utils/rem";
import { SiteMenus, useSiteContext } from "../contexts/site.context";
import { Menu } from "./menu";
import { BlockBar } from "./block/bar";
import { PageBar } from "./page/bar";
import { SavedBlockBar } from "./saved-block/bar";
import { PageEditor } from "./page/editor";
import { BlockEditor } from "./block/editor";

export function EditorSidebar() {
  const { menu } = useSiteContext();

  return (
    <Aside>
      <Menu />
      {menu === SiteMenus.Pages && <PageBar />}
      {menu === SiteMenus.Page && <PageEditor />}
      {menu === SiteMenus.Blocks && <BlockBar />}
      {menu === SiteMenus.Block && <BlockEditor />}
      {menu === SiteMenus["Saved Blocks"] && <SavedBlockBar />}
    </Aside>
  );
}

const Aside = styled.aside`
  display: flex;
  width: ${rem(SIDEBAR_WIDTH)};
  height: 100svh;
`;
