import { cn } from "@/lib/tailwindcss/merge";
import type { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function H1({ children, color, style, className, ...props }: Props) {
  return (
    <h1
      {...props}
      style={{ color, ...style }}
      className={cn(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, color, style, className, ...props }: Props) {
  return (
    <h2
      {...props}
      style={{ color, ...style }}
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, color, style, className, ...props }: Props) {
  return (
    <h3
      {...props}
      style={{ color, ...style }}
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function H4({ children, color, style, className, ...props }: Props) {
  return (
    <h4
      {...props}
      style={{ color, ...style }}
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
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
  className,
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
        `leading-5 text-${size} font-${weight} [&:not(:first-child)]:mt-6 whitespace-pre-line`,
        flex ? `flex items-center gap-2` : undefined,
        className
      )}
    >
      {children}
    </p>
  );
}

export function ErrorMessage({ children, className, ...props }: Props) {
  return (
    <p className={cn("text-sm text-red-500", className)} {...props}>
      {children}
    </p>
  );
}

export function Small({ children, color, style, className, ...props }: Props) {
  return (
    <small
      {...props}
      style={{ color, ...style }}
      className={cn("text-sm leading-none font-medium", className)}
    >
      {children}
    </small>
  );
}

export function Blackquote({
  children,
  color,
  style,
  className,
  ...props
}: Props) {
  return (
    <blockquote
      {...props}
      style={{ color, ...style }}
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
    >
      {children}
    </blockquote>
  );
}
