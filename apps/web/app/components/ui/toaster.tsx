import { Toaster as Sonner, type ToasterProps } from "sonner";
import { Icon } from "./icon";
import { IconExclamationCircle } from "@tabler/icons-react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={"system"}
      className="toaster group"
      icons={{
        error: <Icon color="var(--destructive)">{IconExclamationCircle}</Icon>,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
