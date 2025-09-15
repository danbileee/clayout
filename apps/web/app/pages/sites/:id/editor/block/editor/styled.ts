import { rem } from "@/utils/rem";
import { css, styled } from "styled-components";

export const List = styled.ul`
  width: 100%;

  > li:not(:last-of-type) {
    margin-bottom: ${rem(24)};
  }
`;

export const Item = styled.li`
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${rem(12)};
  margin-bottom: 8px;
`;

export const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => {
    const nonForwardedProps = ["selected"];

    return !nonForwardedProps.includes(prop);
  },
})<{ selected?: boolean }>`
  ${({ theme, selected = false }) => css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.slate[900]};
    background-color: ${theme.colors.white};
    padding: ${rem(8)};
    border-radius: ${rem(4)};
    border: 1px solid ${theme.colors.slate[200]};
    transition: background-color, border-color ease-in-out 200ms;

    &:hover {
      background-color: ${theme.colors.slate[100]};
      border-color: ${theme.colors.slate[300]};
    }

    &:active {
      background-color: ${theme.colors.slate[200]};
      border-color: ${theme.colors.slate[400]};
    }

    ${selected &&
    css`
      background-color: ${theme.colors.slate[100]};
      border-color: ${theme.colors.slate[300]};

      &:active {
        background-color: ${theme.colors.slate[100]};
        border-color: ${theme.colors.slate[300]};
      }
    `}
  `}
`;
