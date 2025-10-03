import { HFlexBox } from "@/components/ui/box";
import { EditorBase } from "../../shared/styled";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import * as Typo from "@/components/ui/typography";
import * as Tab from "@/components/ui/tabs";
import { Icon } from "@/components/ui/icon";
import {
  EditorTabs,
  useSiteContext,
} from "@/pages/sites/:id/contexts/site.context";
import { BlockEditorContent } from "./content";
import { BlockEditorDesign } from "./design";
import { BlockNames } from "../../constants";

export function BlockEditor() {
  const { selectedBlock: block, closeBlockEditor } = useSiteContext();

  const handleBack = () => {
    closeBlockEditor();
  };

  if (!block) {
    return (
      <div>
        <div>No block</div>
      </div>
    );
  }

  return (
    <EditorBase>
      <HFlexBox gap={8} style={{ marginBottom: 12 }}>
        <Button isSquare variant="ghost" onClick={handleBack}>
          <Icon>{IconChevronLeft}</Icon>
        </Button>
        <Typo.P weight="medium">
          {`${BlockNames[block.type]} properties`}
        </Typo.P>
      </HFlexBox>
      <Tab.Root defaultValue={EditorTabs.Content}>
        <Tab.List>
          <Tab.Trigger value={EditorTabs.Content}>
            {EditorTabs.Content}
          </Tab.Trigger>
          <Tab.Trigger value={EditorTabs.Design}>
            {EditorTabs.Design}
          </Tab.Trigger>
        </Tab.List>
        <Tab.Content value={EditorTabs.Content}>
          <BlockEditorContent />
        </Tab.Content>
        <Tab.Content value={EditorTabs.Design}>
          <BlockEditorDesign />
        </Tab.Content>
      </Tab.Root>
    </EditorBase>
  );
}
