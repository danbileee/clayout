import { rem } from "@/utils/rem";
import { styled } from "styled-components";

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
