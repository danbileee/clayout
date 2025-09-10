import { rem } from "@/utils/rem";
import { css, styled } from "styled-components";
import { BAR_WIDTH } from "./constants";

export const BarBase = styled.div`
  ${({ theme }) => css`
    width: ${rem(BAR_WIDTH)};
    background-color: ${theme.colors.neutral[50]};
    border-right: 1px solid ${theme.colors.neutral[100]};
    padding: ${rem(20)} ${rem(16)};
  `}
`;
