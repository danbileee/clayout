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

const presetColors: string[] = Object.entries(omit(colors, ["white", "black"]))
  .map(([, value]) => Object.values(value))
  .flat();

const Tabs = {
  Presets: "Presets",
  Custom: "Custom",
} as const;

type Tab = keyof typeof Tabs;

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export function PickColorPopover({ value = "transparent", onChange }: Props) {
  const [tab, setTab] = useState<Tab>(
    presetColors.includes(value) ? Tabs.Presets : Tabs.Custom
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
                        <TransparentButton
                          onClick={() => onChange("transparent")}
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Content>transparent</Tooltip.Content>
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

const TransparentButton = styled.div`
  cursor: pointer;
  width: 15px;
  height: 15px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: 2px;
`;

const CustomButton = styled.div`
  cursor: pointer;
  width: 15px;
  height: 15px;
  border: 1px solid ${({ theme }) => theme.colors.slate[200]};
  border-radius: 2px;
  background: conic-gradient(red, yellow, lime, cyan, blue, magenta, red);
`;
