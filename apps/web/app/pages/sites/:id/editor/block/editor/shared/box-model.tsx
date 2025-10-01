import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { IconBoxMultiple } from "@tabler/icons-react";
import { HFlexBox } from "@/components/ui/box";
import * as Typo from "@/components/ui/typography";
import * as Editor from "@/pages/sites/:id/editor/styled/editor";

interface RootProps {
  children: ReactNode;
}

export function Root({ children }: RootProps) {
  return (
    <Editor.Item>
      <Editor.Header>
        <Typo.P size="sm" flex>
          <Icon>{IconBoxMultiple}</Icon>
          <span>Box model</span>
        </Typo.P>
      </Editor.Header>
      <HFlexBox gap={12}>{children}</HFlexBox>
    </Editor.Item>
  );
}

export { Border } from "./border";
export { Padding } from "./padding";
export { Margin } from "./margin";
