import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  size?: "md" | "sm";
}

export function Input({ className, type, size = "md", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Size variants
        {
          "h-9 px-3 py-1 file:h-7 file:text-sm md:text-sm rounded-md":
            size === "md",
          "h-6 px-2 py-1 file:h-5 file:text-xs text-sm rounded-sm":
            size === "sm",
        },
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}
