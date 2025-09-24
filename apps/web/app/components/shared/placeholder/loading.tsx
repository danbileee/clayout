import { SpinnerIcon } from "@/icons/spinner";
import { useTheme } from "styled-components";

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
