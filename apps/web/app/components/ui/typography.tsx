import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLElement> {
  children: string;
}

export function H1({ children, ...props }: Props) {
  return (
    <h1
      {...props}
      className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance"
    >
      {children}
    </h1>
  );
}

export function H2({ children, ...props }: Props) {
  return (
    <h2
      {...props}
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
    >
      {children}
    </h2>
  );
}

export function H3({ children, ...props }: Props) {
  return (
    <h3
      {...props}
      className="scroll-m-20 text-2xl font-semibold tracking-tight"
    >
      {children}
    </h3>
  );
}

export function H4({ children, ...props }: Props) {
  return (
    <h4 {...props} className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
}

export function P({ children, ...props }: Props) {
  return (
    <p {...props} className="leading-7 [&:not(:first-child)]:mt-6">
      {children}
    </p>
  );
}

export function Large({ children, ...props }: Props) {
  return (
    <p {...props} className="text-lg font-semibold">
      {children}
    </p>
  );
}

export function Small({ children, ...props }: Props) {
  return (
    <small {...props} className="text-sm leading-none font-medium">
      {children}
    </small>
  );
}

export function Blackquote({ children, ...props }: Props) {
  return (
    <blockquote {...props} className="mt-6 border-l-2 pl-6 italic">
      {children}
    </blockquote>
  );
}
