import { Outlet } from "react-router";
import { styled } from "styled-components";

export default function Layout() {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
`;
