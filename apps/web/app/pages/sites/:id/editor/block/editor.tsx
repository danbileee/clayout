import { HFlexBox } from "@/components/ui/box";
import { EditorBase } from "../../shared/styled";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import * as Typo from "@/components/ui/typography";
import * as Tab from "@/components/ui/tabs";
import { Icon } from "@/components/ui/icon";
import { BlockNames } from "../../shared/constants";
import { BlockTabs, useSiteContext } from "../../contexts/site.context";
import { BlockEditorContent } from "./content";
import { BlockEditorDesign } from "./design";

export function BlockEditor() {
  const { block, closeBlockEditor } = useSiteContext();

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
      <Tab.Root defaultValue={BlockTabs.Content}>
        <Tab.List>
          <Tab.Trigger value={BlockTabs.Content}>
            {BlockTabs.Content}
          </Tab.Trigger>
          <Tab.Trigger value={BlockTabs.Design}>{BlockTabs.Design}</Tab.Trigger>
        </Tab.List>
        <Tab.Content value={BlockTabs.Content}>
          <BlockEditorContent />
        </Tab.Content>
        <Tab.Content value={BlockTabs.Design}>
          <BlockEditorDesign />
        </Tab.Content>
      </Tab.Root>
    </EditorBase>
  );
}
