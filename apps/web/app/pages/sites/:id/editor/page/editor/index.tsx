import * as Typo from "@/components/ui/typography";
import * as Tab from "@/components/ui/tabs";
import { HFlexBox } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import { Icon } from "@/components/ui/icon";
import {
  EditorTabs,
  useSiteContext,
} from "@/pages/sites/:id/contexts/site.context";
import { EditorBase } from "../../styled";
import { PageEditorContent } from "./content";
import { PageEditorDesign } from "./design";

export function PageEditor() {
  const { selectedPage, closePageEditor } = useSiteContext();

  const handleBack = () => {
    closePageEditor();
  };

  if (!selectedPage) {
    return (
      <div>
        <div>No page</div>
      </div>
    );
  }

  return (
    <EditorBase>
      <HFlexBox gap={8} style={{ marginBottom: 12 }}>
        <Button isSquare variant="ghost" onClick={handleBack}>
          <Icon>{IconChevronLeft}</Icon>
        </Button>
        <Typo.P weight="medium">Page properties</Typo.P>
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
          <PageEditorContent />
        </Tab.Content>
        <Tab.Content value={EditorTabs.Design}>
          <PageEditorDesign />
        </Tab.Content>
      </Tab.Root>
    </EditorBase>
  );
}
