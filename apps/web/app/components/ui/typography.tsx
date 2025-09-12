import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function H1({ children, color, style, ...props }: Props) {
  return (
    <h1
      {...props}
      style={{ color, ...style }}
      className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance"
    >
      {children}
    </h1>
  );
}

export function H2({ children, color, style, ...props }: Props) {
  return (
    <h2
      {...props}
      style={{ color, ...style }}
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
    >
      {children}
    </h2>
  );
}

export function H3({ children, color, style, ...props }: Props) {
  return (
    <h3
      {...props}
      style={{ color, ...style }}
      className="scroll-m-20 text-2xl font-semibold tracking-tight"
    >
      {children}
    </h3>
  );
}

export function H4({ children, color, style, ...props }: Props) {
  return (
    <h4
      {...props}
      style={{ color, ...style }}
      className="scroll-m-20 text-xl font-semibold tracking-tight"
    >
      {children}
    </h4>
  );
}

export function P({
  children,
  color,
  size = "base",
  weight = "normal",
  style,
  flex = false,
  ...props
}: Props & {
  size?: "base" | "lg" | "sm" | "xs";
  weight?: "normal" | "medium" | "semibold" | "bold";
  flex?: boolean;
}) {
  return (
    <p
      {...props}
      style={{ color, ...style }}
      className={cn(
        `leading-5 text-${size} font-${weight} [&:not(:first-child)]:mt-6`,
        flex ? `flex items-center gap-2` : undefined
      )}
    >
      {children}
    </p>
  );
}

export function Small({ children, color, style, ...props }: Props) {
  return (
    <small
      {...props}
      style={{ color, ...style }}
      className="text-sm leading-none font-medium"
    >
      {children}
    </small>
  );
}

export function Blackquote({ children, color, style, ...props }: Props) {
  return (
    <blockquote
      {...props}
      style={{ color, ...style }}
      className="mt-6 border-l-2 pl-6 italic"
    >
      {children}
    </blockquote>
  );
}
