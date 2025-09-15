import type { ReactNode } from "react";
import { useTheme } from "styled-components";
import type { BlockContainerStyle } from "@clayout/interface";
import { Icon } from "@/components/ui/icon";
import {
  IconBoxMultiple,
  IconBorderSides,
  IconBoxPadding,
  IconBoxMargin,
} from "@tabler/icons-react";
import { HFlexBox, VFlexBox } from "@/components/ui/box";
import * as Typo from "@/components/ui/typography";
import * as Popover from "@/components/ui/popover";
import * as Tooltip from "@/components/ui/tooltip";
import { PickColorPopover } from "@/components/shared/popovers/pick-color";
import { Input } from "@/components/ui/input";
import { rem } from "@/utils/rem";
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
  value: BorderProperties;
  onChange: (value: BorderProperties) => Promise<void>;
}

export function Borders({
  value: { borderColor, borderRadius = "", borderStyle, borderWidth = "" },
  onChange,
}: BorderProps) {
  const theme = useTheme();

  return (
    <Popover.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Popover.Trigger>
            <BlockEditor.Button>
              <Icon size={20}>{IconBorderSides}</Icon>
              <TriggerIndicator />
            </BlockEditor.Button>
          </Popover.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">Borders</Tooltip.Content>
      </Tooltip.Root>
      <Popover.Content align="start">
        <VFlexBox gap={16}>
          <Typo.P size="sm" weight="semibold">
            Borders
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
              <Input
                type="tel"
                placeholder="Enter a number value"
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
              <Input
                type="tel"
                placeholder="Enter a number value"
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
            <BlockEditor.Button>
              <Icon size={20}>{IconBoxMargin}</Icon>
              <TriggerIndicator />
            </BlockEditor.Button>
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
              <Input
                type="tel"
                placeholder="Enter a number value"
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
              <Input
                type="tel"
                placeholder="Enter a number value"
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
              <Input
                type="tel"
                placeholder="Enter a number value"
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
              <Input
                type="tel"
                placeholder="Enter a number value"
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

function TriggerIndicator() {
  const theme = useTheme();

  return (
    <svg
      width="5"
      height="5"
      viewBox="0 0 5 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer", position: "absolute", bottom: 2, right: 2 }}
    >
      <path d="M5 5H0L5 0V5Z" fill={theme.colors.slate[600]} />
    </svg>
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
        <BlockEditor.Button
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
        </BlockEditor.Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">{type}</Tooltip.Content>
    </Tooltip.Root>
  );
}

interface SpacingValue {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

function parseSpacingValue(value: string): SpacingValue {
  if (!value) {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }

  const splitted = value.split(" ");

  if (splitted.length !== 4) {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }

  const [top, right, bottom, left] = splitted.map(
    (s) => parseInt(s.replace("px", "")),
    10
  );

  return {
    top,
    bottom,
    left,
    right,
  };
}

function composeSpacingValue({
  top,
  right,
  bottom,
  left,
}: SpacingValue): string {
  return `${top}px ${right}px ${bottom}px ${left}px`;
}
