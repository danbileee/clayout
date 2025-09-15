import type { ReactNode } from "react";
import type { BlockContainerStyle } from "@clayout/interface";
import { Icon } from "@/components/ui/icon";
import {
  IconBoxMultiple,
  IconBorderSides,
  IconBoxPadding,
  IconBoxMargin,
} from "@tabler/icons-react";
import { HFlexBox } from "@/components/ui/box";
import * as Typo from "@/components/ui/typography";
import * as Tooltip from "@/components/ui/tooltip";
import * as BlockEditor from "../styled";

interface RootProps {
  children: ReactNode;
}

export function Root({ children }: RootProps) {
  return (
    <BlockEditor.Item>
      <BlockEditor.Header>
        <Typo.P size="sm" flex>
          <Icon>{IconBoxMultiple}</Icon>
          <span>Box model</span>
        </Typo.P>
      </BlockEditor.Header>
      <HFlexBox gap={12}>{children}</HFlexBox>
    </BlockEditor.Item>
  );
}

type BorderProperties = Pick<
  BlockContainerStyle,
  "borderColor" | "borderRadius" | "borderStyle" | "borderWidth"
>;

interface BorderProps {
  value?: BorderProperties;
  onChange: (value: BorderProperties) => Promise<void>;
}

export function Borders({ value, onChange }: BorderProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <BlockEditor.Button>
          <Icon size={20}>{IconBorderSides}</Icon>
        </BlockEditor.Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">Borders</Tooltip.Content>
    </Tooltip.Root>
  );
}

type PaddingProperties = Pick<BlockContainerStyle, "padding">;

interface PaddingProps {
  value?: PaddingProperties;
  onChange: (value: PaddingProperties) => Promise<void>;
}

export function Padding({ value, onChange }: PaddingProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <BlockEditor.Button>
          <Icon size={20}>{IconBoxPadding}</Icon>
        </BlockEditor.Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">Padding</Tooltip.Content>
    </Tooltip.Root>
  );
}

type MarginProperties = Pick<BlockContainerStyle, "margin">;

interface MarginProps {
  value?: MarginProperties;
  onChange: (value: MarginProperties) => Promise<void>;
}

export function Margin({ value, onChange }: MarginProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <BlockEditor.Button>
          <Icon size={20}>{IconBoxMargin}</Icon>
        </BlockEditor.Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">Margin</Tooltip.Content>
    </Tooltip.Root>
  );
}
