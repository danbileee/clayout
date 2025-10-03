import { Icon } from "@/components/ui/icon";
import {
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconSpacingHorizontal,
} from "@tabler/icons-react";
import { HFlexBox } from "@/components/ui/box";
import * as Typo from "@/components/ui/typography";
import * as Tooltip from "@/components/ui/tooltip";
import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import type { BlockContainerStyle } from "@clayout/interface";

type AlignProperties = Pick<BlockContainerStyle, "align">;

interface Props {
  value?: AlignProperties;
  onChange: (value: AlignProperties) => Promise<void>;
}

export function Alignment({ value, onChange }: Props) {
  const { align } = value ?? {};

  return (
    <Editor.Item>
      <Editor.Header>
        <Typo.P size="sm" flex>
          <Icon>{IconSpacingHorizontal}</Icon>
          <span>Alignment</span>
        </Typo.P>
      </Editor.Header>
      <HFlexBox gap={12}>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Editor.Button
              selected={align === "left"}
              onClick={() => {
                if (align === "left") return;
                onChange({ align: "left" });
              }}
            >
              <Icon size={20}>{IconLayoutAlignLeft}</Icon>
            </Editor.Button>
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">left</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Editor.Button
              selected={align === "center"}
              onClick={() => {
                if (align === "center") return;
                onChange({ align: "center" });
              }}
            >
              <Icon size={20}>{IconLayoutAlignCenter}</Icon>
            </Editor.Button>
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">center</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Editor.Button
              selected={align === "right"}
              onClick={() => {
                if (align === "right") return;
                onChange({ align: "right" });
              }}
            >
              <Icon size={20}>{IconLayoutAlignRight}</Icon>
            </Editor.Button>
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">right</Tooltip.Content>
        </Tooltip.Root>
      </HFlexBox>
    </Editor.Item>
  );
}
