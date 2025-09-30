import * as Popover from "@/components/ui/popover";
import { rem } from "@/utils/rem";
import { css, styled } from "styled-components";
import Sketch from "@uiw/react-color-sketch";
import Compact from "@uiw/react-color-compact";
import { HFlexBox, HInlineFlexBox, VFlexBox } from "@/components/ui/box";
import * as Typo from "@/components/ui/typography";
import * as Tooltip from "@/components/ui/tooltip";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IconChevronLeft } from "@tabler/icons-react";
import { colors } from "@/themes/colors";
import omit from "lodash/omit";

const TRANSPARENT = "transparent";
const presetColors: string[] = Object.entries(omit(colors, ["white", "black"]))
  .map(([, value]) => Object.values(value))
  .flat();
const defaultColors: string[] = [TRANSPARENT, colors.white, colors.black];

const Tabs = {
  Presets: "Presets",
  Custom: "Custom",
} as const;

type Tab = keyof typeof Tabs;

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export function PickColorPopover({ value = TRANSPARENT, onChange }: Props) {
  const [tab, setTab] = useState<Tab>(
    [...presetColors, ...defaultColors].includes(value)
      ? Tabs.Presets
      : Tabs.Custom
  );

  return (
    <Popover.Root>
      <Popover.Trigger>
        <TriggerButton backgroundColor={value} />
      </Popover.Trigger>
      <Popover.Content
        align="start"
        alignOffset={-8}
        side="right"
        style={{ width: 265 }}
      >
        <VFlexBox gap={8}>
          {tab === Tabs.Presets && (
            <>
              <HFlexBox gap={4}>
                <Typo.P size="sm" weight="semibold">
                  Presets
                </Typo.P>
              </HFlexBox>
              <PresetColors
                color={value}
                colors={presetColors}
                onChange={({ hex }) => onChange(hex)}
                addonAfter={
                  <HInlineFlexBox gap={5} style={{ marginBottom: 12 }}>
                    <Tooltip.Root>
                      <Tooltip.Trigger>
                        <ColorButton
                          color={TRANSPARENT}
                          selected={value === TRANSPARENT}
                          onClick={() => onChange(TRANSPARENT)}
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Content>transparent</Tooltip.Content>
                    </Tooltip.Root>
                    <Tooltip.Root>
                      <Tooltip.Trigger>
                        <ColorButton
                          color={colors.white}
                          selected={value === colors.white}
                          onClick={() => onChange(colors.white)}
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Content>white</Tooltip.Content>
                    </Tooltip.Root>
                    <Tooltip.Root>
                      <Tooltip.Trigger>
                        <ColorButton
                          color={colors.black}
                          selected={value === colors.black}
                          onClick={() => onChange(colors.black)}
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Content>black</Tooltip.Content>
                    </Tooltip.Root>
                    <Tooltip.Root>
                      <Tooltip.Trigger>
                        <CustomButton onClick={() => setTab(Tabs.Custom)} />
                      </Tooltip.Trigger>
                      <Tooltip.Content>custom color</Tooltip.Content>
                    </Tooltip.Root>
                  </HInlineFlexBox>
                }
              />
            </>
          )}
          {tab === Tabs.Custom && (
            <>
              <HFlexBox gap={4}>
                <Button
                  isSquare
                  size="sm"
                  variant="ghost"
                  onClick={() => setTab(Tabs.Presets)}
                >
                  <Icon>{IconChevronLeft}</Icon>
                </Button>
                <Typo.P size="sm" weight="semibold">
                  Custom
                </Typo.P>
              </HFlexBox>
              <CustomColors
                color={value}
                onChange={({ hex }) => onChange(hex)}
              />
            </>
          )}
        </VFlexBox>
      </Popover.Content>
    </Popover.Root>
  );
}

const TriggerButton = styled.button.withConfig({
  shouldForwardProp: (prop) => {
    const nonForwardedProps = ["backgroundColor"];

    return !nonForwardedProps.includes(prop);
  },
})<{ selected?: boolean; backgroundColor: string }>`
  ${({ theme, backgroundColor }) => css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${rem(20)};
    height: ${rem(20)};
    background-color: ${backgroundColor};
    border-radius: ${rem(20)};
    border: 1px solid ${theme.colors.slate[200]};
    transition: border-color ease-in-out 200ms;

    &:hover {
      border-color: ${theme.colors.slate[300]};
      &::after {
        background-color: ${theme.colors.slate[200]};
      }
    }

    &:active {
      border-color: ${theme.colors.slate[400]};
      &::after {
        background-color: ${theme.colors.slate[300]};
      }
    }

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: transparent;
      transition: background-color ease-in-out 200ms;
      z-index: 1;
    }
  `}
`;

const CustomColors = styled(Sketch)`
  width: ${rem(242)} !important;
  box-shadow: none !important;
  margin: ${rem(-10)} !important;

  .w-color-swatch {
    display: none !important;
  }
`;

const PresetColors = styled(Compact)`
  width: ${rem(230)} !important;
  background-color: transparent !important;
`;

type ColorButtonProps = {
  color: string;
  selected: boolean;
};

const ColorButton = styled.div.withConfig({
  shouldForwardProp: (prop) => {
    const nonForwardedProps = ["color", "selected"];

    return !nonForwardedProps.includes(prop);
  },
})<ColorButtonProps>`
  position: relative;
  cursor: pointer;
  width: ${rem(15)};
  height: ${rem(15)};
  background-color: ${({ color }) => color};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: ${rem(2)};
  overflow: hidden;

  ${({ color, theme }) =>
    color === TRANSPARENT &&
    css`
      &::before {
        content: "";
        position: absolute;
        display: block;
        z-index: 1;
        width: ${rem(1)};
        height: ${rem(20)};
        background-color: ${theme.colors.slate[300]};
        transform: rotate(45deg);
        top: ${rem(-2)};
        left: ${rem(5)};
      }
    `}

  ${({ color, theme, selected }) =>
    selected &&
    css`
      &::after {
        content: "";
        position: absolute;
        display: block;
        z-index: 2;
        width: ${rem(4)};
        height: ${rem(4)};
        background-color: ${color === theme.colors.black
          ? theme.colors.white
          : theme.colors.black};
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `}
`;

const CustomButton = styled.div`
  cursor: pointer;
  width: ${rem(15)};
  height: ${rem(15)};
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: 2px;
  background: conic-gradient(red, yellow, lime, cyan, blue, magenta, red);
`;
