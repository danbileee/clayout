import { SpinnerIcon } from "@/icons/spinner";
import { styled, useTheme } from "styled-components";

interface Props {
  color?: string;
}

export function LoadingPlaceholder({ color }: Props) {
  const theme = useTheme();

  return (
    <main className="flex items-center justify-center w-full h-full">
      <div className="text-center">
        <SpinnerIcon color={color ?? theme.colors.slate[900]} />
      </div>
    </main>
  );
}

export const LoadingWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  z-index: 1;
`;
