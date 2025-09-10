import type { IconProps, Icon as IconComponent } from "@tabler/icons-react";

interface Props
  extends Omit<IconProps, "ref" | "size" | "stroke" | "color" | "children"> {
  size?: number;
  color?: string;
  stroke?: number;
  children: IconComponent;
}

export function Icon({
  size = 16,
  color = "currentColor",
  stroke = 2,
  style,
  className,
  children,
  ...props
}: Props) {
  const IconBase = children;

  return (
    <IconBase
      size={size}
      stroke={stroke}
      style={{
        color,
        flexShrink: 0,
        ...style,
      }}
      className={className}
      {...props}
    />
  );
}
