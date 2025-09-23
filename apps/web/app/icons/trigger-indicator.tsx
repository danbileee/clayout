import { useTheme } from "styled-components";

export function TriggerIndicator() {
  const theme = useTheme();

  return (
    <svg
      width="5"
      height="5"
      viewBox="0 0 5 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer", position: "absolute", bottom: 2, right: 2 }}
    >
      <path d="M5 5H0L5 0V5Z" fill={theme.colors.slate[600]} />
    </svg>
  );
}
