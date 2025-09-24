import { HFlexBox } from "@/components/ui/box";
import { rem } from "@/utils/rem";
import { css, styled } from "styled-components";

export const InputsWrapper = styled(HFlexBox)`
  position: absolute;
  top: ${rem(58)};
  right: ${rem(24)};
`;

export const ImageCardWrapper = styled.div`
  ${({ theme }) => css`
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: ${theme.colors.slate[50]};
    border: 1px solid ${theme.colors.slate[200]};
    border-radius: ${rem(6)};
    overflow: hidden;
  `}

  &:hover {
    &::after {
      background-color: rgba(255, 255, 255, 0.4);
    }
    > div {
      opacity: 0.99;
    }
  }

  &::after {
    position: absolute;
    display: block;
    content: "";
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    border-radius: ${rem(6)};
    z-index: 1;
    transition: background-color ease-in-out 200ms;
  }
`;

export const ImageCard = styled.img`
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ButtonsWrapper = styled(HFlexBox)`
  opacity: 0;
  position: absolute;
  top: ${rem(8)};
  right: ${rem(8)};
  transition: opacity ease-in-out 200ms;
  z-index: 2;
`;
