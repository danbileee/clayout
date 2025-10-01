import { useTheme } from "styled-components";
import * as Popover from "@/components/ui/popover";
import * as Tooltip from "@/components/ui/tooltip";
import * as Typo from "@/components/ui/typography";
import * as Editor from "@/pages/sites/:id/editor/styled/editor";
import type { BlockContainerStyle } from "@clayout/interface";
import { Icon } from "@/components/ui/icon";
import { IconBorderSides } from "@tabler/icons-react";
import { TriggerIndicator } from "@/icons/trigger-indicator";
import { HFlexBox, VFlexBox } from "@/components/ui/box";
import { PickColorPopover } from "@/components/shared/popovers/pick-color";
import { NumberInput } from "@/components/ui/input";
import { rem } from "@/utils/rem";

type BorderProperties = Pick<
  BlockContainerStyle,
  "borderColor" | "borderRadius" | "borderStyle" | "borderWidth"
>;

interface BorderProps {
  value: BorderProperties;
  onChange: (value: BorderProperties) => Promise<void>;
}

export function Border({
  value: {
    borderColor = "transparent",
    borderRadius = "",
    borderStyle,
    borderWidth = "",
  },
  onChange,
}: BorderProps) {
  const theme = useTheme();

  return (
    <Popover.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Popover.Trigger>
            <Editor.Button>
              <Icon size={20}>{IconBorderSides}</Icon>
              <TriggerIndicator />
            </Editor.Button>
          </Popover.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">Border</Tooltip.Content>
      </Tooltip.Root>
      <Popover.Content align="start">
        <VFlexBox gap={16}>
          <Typo.P size="sm" weight="semibold">
            Border
          </Typo.P>
          <HFlexBox gap={12}>
            <Typo.Small color={theme.colors.slate[600]}>Color</Typo.Small>
            <PickColorPopover
              value={borderColor}
              onChange={(v) => onChange({ borderColor: v })}
            />
          </HFlexBox>
          <VFlexBox gap={8}>
            <Typo.Small color={theme.colors.slate[600]}>Width</Typo.Small>
            <HFlexBox gap={8}>
              <NumberInput
                value={borderWidth.replace("px", "")}
                onChange={(e) =>
                  onChange({ borderWidth: `${e.target.value}px` })
                }
                autoFocus
              />
              <Typo.Small>px</Typo.Small>
            </HFlexBox>
          </VFlexBox>
          <VFlexBox gap={8}>
            <Typo.Small color={theme.colors.slate[600]}>Radius</Typo.Small>
            <HFlexBox gap={8}>
              <NumberInput
                value={borderRadius.replace("px", "")}
                onChange={(e) =>
                  onChange({ borderRadius: `${e.target.value}px` })
                }
              />
              <Typo.Small>px</Typo.Small>
            </HFlexBox>
          </VFlexBox>
          <VFlexBox gap={8}>
            <Typo.Small color={theme.colors.slate[600]}>
              Stroke style
            </Typo.Small>
            <HFlexBox gap={8}>
              <BorderStyleButton
                type="solid"
                selected={borderStyle === "solid"}
                onClick={() => onChange({ borderStyle: "solid" })}
              />
              <BorderStyleButton
                type="dashed"
                selected={borderStyle === "dashed"}
                onClick={() => onChange({ borderStyle: "dashed" })}
              />
              <BorderStyleButton
                type="dotted"
                selected={borderStyle === "dotted"}
                onClick={() => onChange({ borderStyle: "dotted" })}
              />
            </HFlexBox>
          </VFlexBox>
        </VFlexBox>
      </Popover.Content>
    </Popover.Root>
  );
}

function BorderStyleButton({
  type,
  selected,
  onClick,
}: {
  type: "solid" | "dashed" | "dotted";
  selected: boolean;
  onClick: VoidFunction;
}) {
  const theme = useTheme();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Editor.Button
          style={{ padding: rem(12) }}
          selected={selected}
          onClick={onClick}
        >
          <div
            style={{
              width: 54,
              height: 1,
              border: `1px ${type} ${theme.colors.slate[700]}`,
            }}
          />
        </Editor.Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">{type}</Tooltip.Content>
    </Tooltip.Root>
  );
}
