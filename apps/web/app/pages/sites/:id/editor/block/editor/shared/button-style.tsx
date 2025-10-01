import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconDroplet,
  IconPencilStar,
  IconTypography,
} from "@tabler/icons-react";
import * as Popover from "@/components/ui/popover";
import * as Select from "@/components/ui/select";
import * as Tooltip from "@/components/ui/tooltip";
import * as Typo from "@/components/ui/typography";
import * as Editor from "@/pages/sites/:id/editor/styled/editor";
import type { BlockStyleOf, SiteBlockTypes } from "@clayout/interface";
import { TriggerIndicator } from "@/icons/trigger-indicator";
import { HFlexBox, VFlexBox } from "@/components/ui/box";
import { useTheme } from "styled-components";
import { PickColorPopover } from "@/components/shared/popovers/pick-color";
import { rem } from "@/utils/rem";
import { Checkbox } from "@/components/ui/checkbox";

interface RootProps {
  children: ReactNode;
}

export function Root({ children }: RootProps) {
  return (
    <Editor.Item>
      <Editor.Header>
        <Typo.P size="sm" flex>
          <Icon>{IconPencilStar}</Icon>
          <span>Button style</span>
        </Typo.P>
      </Editor.Header>
      <HFlexBox gap={12}>{children}</HFlexBox>
    </Editor.Item>
  );
}

type ButtonProperties = NonNullable<BlockStyleOf<typeof SiteBlockTypes.Button>>;

type ColorPropertis = Pick<ButtonProperties, "backgroundColor" | "color">;

interface ColorProps {
  value: ColorPropertis;
  onChange: (value: ColorPropertis) => Promise<void>;
}

export function Color({ value, onChange }: ColorProps) {
  const { backgroundColor, color } = value;
  const theme = useTheme();

  return (
    <Popover.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Popover.Trigger>
            <Editor.Button>
              <Icon size={20}>{IconDroplet}</Icon>
              <TriggerIndicator />
            </Editor.Button>
          </Popover.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">Colors</Tooltip.Content>
      </Tooltip.Root>
      <Popover.Content align="start">
        <VFlexBox gap={16}>
          <Typo.P size="sm" weight="semibold">
            Colors
          </Typo.P>
          <HFlexBox gap={12}>
            <Typo.Small color={theme.colors.slate[600]}>Text color</Typo.Small>
            <PickColorPopover
              value={color}
              onChange={(v) => onChange({ color: v })}
            />
          </HFlexBox>
          <HFlexBox gap={12}>
            <Typo.Small color={theme.colors.slate[600]}>
              Background color
            </Typo.Small>
            <PickColorPopover
              value={backgroundColor}
              onChange={(v) => onChange({ backgroundColor: v })}
            />
          </HFlexBox>
        </VFlexBox>
      </Popover.Content>
    </Popover.Root>
  );
}

const FontSizes = [
  12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 38, 40, 42, 44, 46, 48, 50,
];
const FontWeights = ["normal", "bold"];

type FontPropertis = Pick<
  ButtonProperties,
  "fontSize" | "fontWeight" | "textDecoration" | "textAlign"
>;

interface FontProps {
  value: FontPropertis;
  onChange: (value: FontPropertis) => Promise<void>;
}

export function Font({ value, onChange }: FontProps) {
  const { fontSize, fontWeight, textDecoration, textAlign } = value;
  const parsedFontSize = fontSize?.replace("px", "") ?? "";
  const theme = useTheme();

  return (
    <Popover.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Popover.Trigger>
            <Editor.Button>
              <Icon size={20}>{IconTypography}</Icon>
              <TriggerIndicator />
            </Editor.Button>
          </Popover.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">Font</Tooltip.Content>
      </Tooltip.Root>
      <Popover.Content align="start">
        <VFlexBox gap={16}>
          <Typo.P size="sm" weight="semibold">
            Font
          </Typo.P>
          <HFlexBox gap={12}>
            <Typo.Small
              color={theme.colors.slate[600]}
              style={{ width: rem(65), flexShrink: 0 }}
            >
              Size
            </Typo.Small>
            <Select.Root
              defaultValue={parsedFontSize}
              onValueChange={(v) => onChange({ fontSize: `${v}px` })}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select font size" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {FontSizes.map((size) => (
                    <Select.Item key={size} value={size.toString()}>
                      {size}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </HFlexBox>
          <HFlexBox gap={12}>
            <Typo.Small
              color={theme.colors.slate[600]}
              style={{ width: rem(65), flexShrink: 0 }}
            >
              Weight
            </Typo.Small>
            <Select.Root
              defaultValue={fontWeight}
              onValueChange={(v) => onChange({ fontWeight: v })}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select font weight" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {FontWeights.map((weight) => (
                    <Select.Item key={weight} value={weight}>
                      {weight}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </HFlexBox>
          <HFlexBox gap={12} style={{ height: rem(36) }}>
            <Typo.Small
              color={theme.colors.slate[600]}
              style={{ width: rem(65), flexShrink: 0 }}
            >
              Underline
            </Typo.Small>
            <Checkbox
              id="button-text-decoration"
              checked={textDecoration === "underline"}
              onCheckedChange={(v) =>
                onChange({ textDecoration: v ? "underline" : "none" })
              }
            />
          </HFlexBox>
          <HFlexBox gap={12} style={{ height: rem(36) }}>
            <Typo.Small
              color={theme.colors.slate[600]}
              style={{ width: rem(65), flexShrink: 0 }}
            >
              Text align
            </Typo.Small>
            <HFlexBox gap={8}>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <Editor.Button
                    selected={textAlign === "left"}
                    onClick={() => {
                      if (textAlign === "left") return;
                      onChange({ textAlign: "left" });
                    }}
                  >
                    <Icon size={14}>{IconAlignLeft}</Icon>
                  </Editor.Button>
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom">left</Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <Editor.Button
                    selected={textAlign === "center"}
                    onClick={() => {
                      if (textAlign === "center") return;
                      onChange({ textAlign: "center" });
                    }}
                  >
                    <Icon size={14}>{IconAlignCenter}</Icon>
                  </Editor.Button>
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom">center</Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <Editor.Button
                    selected={textAlign === "right"}
                    onClick={() => {
                      if (textAlign === "right") return;
                      onChange({ textAlign: "right" });
                    }}
                  >
                    <Icon size={14}>{IconAlignRight}</Icon>
                  </Editor.Button>
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom">right</Tooltip.Content>
              </Tooltip.Root>
            </HFlexBox>
          </HFlexBox>
        </VFlexBox>
      </Popover.Content>
    </Popover.Root>
  );
}

export { Border } from "./border";
export { Padding } from "./padding";
