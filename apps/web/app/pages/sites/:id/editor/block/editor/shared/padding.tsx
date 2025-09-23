import { useTheme } from "styled-components";
import type { BlockContainerStyle } from "@clayout/interface";
import { Icon } from "@/components/ui/icon";
import { IconBoxPadding } from "@tabler/icons-react";
import { HFlexBox, VFlexBox } from "@/components/ui/box";
import * as Typo from "@/components/ui/typography";
import * as Popover from "@/components/ui/popover";
import * as Tooltip from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import * as BlockEditor from "../styled";
import { TriggerIndicator } from "@/icons/trigger-indicator";
import { composeSpacingValue, parseSpacingValue } from "./utils/spacing";

type PaddingProperties = Pick<BlockContainerStyle, "padding">;

interface PaddingProps {
  value: PaddingProperties;
  onChange: (value: PaddingProperties) => Promise<void>;
}

export function Padding({ value: { padding = "" }, onChange }: PaddingProps) {
  const theme = useTheme();
  const parsed = parseSpacingValue(padding);

  return (
    <Popover.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Popover.Trigger>
            <BlockEditor.Button>
              <Icon size={20}>{IconBoxPadding}</Icon>
              <TriggerIndicator />
            </BlockEditor.Button>
          </Popover.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">Padding</Tooltip.Content>
      </Tooltip.Root>
      <Popover.Content align="start">
        <VFlexBox gap={16}>
          <Typo.P size="sm" weight="semibold">
            Padding
          </Typo.P>
          <VFlexBox gap={8}>
            <Typo.Small color={theme.colors.slate[600]}>Top</Typo.Small>
            <HFlexBox gap={8}>
              <Input
                type="tel"
                placeholder="Enter a number value"
                value={parsed.top}
                onChange={(e) =>
                  onChange({
                    padding: composeSpacingValue({
                      ...parsed,
                      top: parseInt(e.target.value, 10),
                    }),
                  })
                }
              />
              <Typo.Small>px</Typo.Small>
            </HFlexBox>
          </VFlexBox>
          <VFlexBox gap={8}>
            <Typo.Small color={theme.colors.slate[600]}>Bottom</Typo.Small>
            <HFlexBox gap={8}>
              <Input
                type="tel"
                placeholder="Enter a number value"
                value={parsed.bottom}
                onChange={(e) =>
                  onChange({
                    padding: composeSpacingValue({
                      ...parsed,
                      bottom: parseInt(e.target.value, 10),
                    }),
                  })
                }
              />
              <Typo.Small>px</Typo.Small>
            </HFlexBox>
          </VFlexBox>
          <VFlexBox gap={8}>
            <Typo.Small color={theme.colors.slate[600]}>Left</Typo.Small>
            <HFlexBox gap={8}>
              <Input
                type="tel"
                placeholder="Enter a number value"
                value={parsed.left}
                onChange={(e) =>
                  onChange({
                    padding: composeSpacingValue({
                      ...parsed,
                      left: parseInt(e.target.value, 10),
                    }),
                  })
                }
              />
              <Typo.Small>px</Typo.Small>
            </HFlexBox>
          </VFlexBox>
          <VFlexBox gap={8}>
            <Typo.Small color={theme.colors.slate[600]}>Right</Typo.Small>
            <HFlexBox gap={8}>
              <Input
                type="tel"
                placeholder="Enter a number value"
                value={parsed.right}
                onChange={(e) =>
                  onChange({
                    padding: composeSpacingValue({
                      ...parsed,
                      right: parseInt(e.target.value, 10),
                    }),
                  })
                }
              />
              <Typo.Small>px</Typo.Small>
            </HFlexBox>
          </VFlexBox>
        </VFlexBox>
      </Popover.Content>
    </Popover.Root>
  );
}
