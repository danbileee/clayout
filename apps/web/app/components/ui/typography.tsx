import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLElement> {
  children: string;
}

export function H1({ children, color, ...props }: Props) {
  return (
    <h1
      {...props}
      style={{ color }}
      className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance"
    >
      {children}
    </h1>
  );
}

export function H2({ children, color, ...props }: Props) {
  return (
    <h2
      {...props}
      style={{ color }}
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
    >
      {children}
    </h2>
  );
}

export function H3({ children, color, ...props }: Props) {
  return (
    <h3
      {...props}
      style={{ color }}
      className="scroll-m-20 text-2xl font-semibold tracking-tight"
    >
      {children}
    </h3>
  );
}

export function H4({ children, color, ...props }: Props) {
  return (
    <h4
      {...props}
      style={{ color }}
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
  ...props
}: Props & {
  size?: "base" | "lg" | "sm" | "xs";
  weight?: "normal" | "medium" | "semibold" | "bold";
}) {
  return (
    <p
      {...props}
      style={{ color }}
      className={`leading-5 text-${size} font-${weight} [&:not(:first-child)]:mt-6`}
    >
      {children}
    </p>
  );
}

export function Small({ children, color, ...props }: Props) {
  return (
    <small
      {...props}
      style={{ color }}
      className="text-sm leading-none font-medium"
    >
      {children}
    </small>
  );
}

export function Blackquote({ children, color, ...props }: Props) {
  return (
    <blockquote
      {...props}
      style={{ color }}
      className="mt-6 border-l-2 pl-6 italic"
    >
      {children}
    </blockquote>
  );
}
