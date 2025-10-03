import { useTheme } from "styled-components";
import type { BlockContainerStyle } from "@clayout/interface";
import { Icon } from "@/components/ui/icon";
import { IconBoxMargin } from "@tabler/icons-react";
import { HFlexBox, VFlexBox } from "@/components/ui/box";
import * as Typo from "@/components/ui/typography";
import * as Popover from "@/components/ui/popover";
import * as Tooltip from "@/components/ui/tooltip";
import { NumberInput } from "@/components/ui/input";
import * as Editor from "@/pages/sites/:id/editor/shared/styled/editor";
import { TriggerIndicator } from "@/icons/trigger-indicator";
import { composeSpacingValue, parseSpacingValue } from "./utils/spacing";

type MarginProperties = Pick<BlockContainerStyle, "margin">;

interface MarginProps {
  value: MarginProperties;
  onChange: (value: MarginProperties) => Promise<void>;
}

export function Margin({ value: { margin = "" }, onChange }: MarginProps) {
  const theme = useTheme();
  const parsed = parseSpacingValue(margin);

  return (
    <Popover.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Popover.Trigger>
            <Editor.Button>
              <Icon size={20}>{IconBoxMargin}</Icon>
              <TriggerIndicator />
            </Editor.Button>
          </Popover.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">Margin</Tooltip.Content>
      </Tooltip.Root>
      <Popover.Content align="start">
        <VFlexBox gap={16}>
          <Typo.P size="sm" weight="semibold">
            Margin
          </Typo.P>
          <VFlexBox gap={8}>
            <Typo.Small color={theme.colors.slate[600]}>Top</Typo.Small>
            <HFlexBox gap={8}>
              <NumberInput
                value={parsed.top}
                onChange={(e) =>
                  onChange({
                    margin: composeSpacingValue({
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
              <NumberInput
                value={parsed.bottom}
                onChange={(e) =>
                  onChange({
                    margin: composeSpacingValue({
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
              <NumberInput
                value={parsed.left}
                onChange={(e) =>
                  onChange({
                    margin: composeSpacingValue({
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
              <NumberInput
                value={parsed.right}
                onChange={(e) =>
                  onChange({
                    margin: composeSpacingValue({
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
