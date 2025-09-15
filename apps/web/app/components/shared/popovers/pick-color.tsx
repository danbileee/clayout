import * as Popover from "@/components/ui/popover";
import { rem } from "@/utils/rem";
import { css, styled } from "styled-components";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export function PickColorPopover({ value = "transparent", onChange }: Props) {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <TriggerButton backgroundColor={value} />
      </Popover.Trigger>
      <Popover.Content
        align="start"
        alignOffset={-8}
        side="right"
      ></Popover.Content>
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
