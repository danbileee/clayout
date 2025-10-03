import { rem } from "@/utils/rem";
import { css, styled } from "styled-components";
import { BAR_WIDTH } from "../../constants";

export const BarBase = styled.div`
  ${({ theme }) => css`
    width: ${rem(BAR_WIDTH)};
    background-color: ${theme.colors.slate[50]};
    border-right: 1px solid ${theme.colors.slate[100]};
    padding: ${rem(20)} ${rem(16)};
  `}
`;

export const EditorBase = styled.div`
  ${({ theme }) => css`
    width: ${rem(BAR_WIDTH)};
    padding: ${rem(14)} ${rem(16)} ${rem(24)};
    border-right: 1px solid ${theme.colors.slate[100]};
  `}
`;
