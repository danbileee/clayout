import * as Select from "@/components/ui/select";
import * as Typo from "@/components/ui/typography";
import * as Editor from "./styled/editor";
import { Icon } from "@/components/ui/icon";
import { IconArrowAutofitWidth } from "@tabler/icons-react";
import {
  SiteContentFits,
  type SitePageContainerStyle,
  type SiteContentFit,
  SiteContentFitLabel,
} from "@clayout/interface";

type ContentFitProperties = Pick<SitePageContainerStyle, "contentFit">;

interface ContentFitProps {
  value: ContentFitProperties;
  onChange: (value: ContentFitProperties) => Promise<void>;
}

export function ContentFit({ value, onChange }: ContentFitProps) {
  const { contentFit } = value;

  return (
    <Editor.Item>
      <Editor.Header>
        <Typo.P size="sm" flex>
          <Icon>{IconArrowAutofitWidth}</Icon>
          <span>Content fit</span>
        </Typo.P>
      </Editor.Header>
      <Select.Root
        defaultValue={contentFit}
        onValueChange={(v) => onChange({ contentFit: v as SiteContentFit })}
      >
        <Select.Trigger>
          <Select.Value placeholder="Select the page fit" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>Options</Select.Label>
            {Object.values(SiteContentFits).map((pf) => (
              <Select.Item value={pf}>{SiteContentFitLabel[pf]}</Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Editor.Item>
  );
}
