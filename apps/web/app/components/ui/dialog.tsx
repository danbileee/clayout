import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import { IconX } from "@tabler/icons-react";
import { ThemeProvider } from "styled-components";
import { theme } from "@/themes";

export function Root({
  ...props
}: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

export function Trigger({
  ...props
}: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger data-slot="dialog-trigger" asChild {...props} />
  );
}

export function Portal({
  ...props
}: ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

export function Close({
  ...props
}: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

export function Overlay({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

export function Content({
  className,
  children,
  showCloseButton = true,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <Portal data-slot="dialog-portal">
      <Overlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-lg max-w-[calc(100%-2rem)] max-h-[calc(100svh-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-[calc(100%-1rem)] sm:max-h-[calc(100svh-1rem)]",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-6 right-6 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <Icon>{IconX}</Icon>
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </Portal>
  );
}

export function Header({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-4 text-center sm:text-left", className)}
      {...props}
    />
  );
}

export function Footer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

export function Title({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

export function Description({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

type DialogProviderContextValue = {
  openDialog: (props: { content: ReactNode }) => void;
  closeDialog: () => void;
};

const DialogProviderContext = createContext<DialogProviderContextValue | null>(
  null
);

type Props = {
  children: ReactNode;
};

export function DialogProvider({ children }: Props) {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    content: ReactNode;
  }>({
    isOpen: false,
    content: null,
  });

  const openDialog = useCallback(({ content }: { content: ReactNode }) => {
    setDialogState({ isOpen: true, content });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState({ isOpen: false, content: null });
  }, []);

  const contextValue = useMemo<DialogProviderContextValue>(
    () => ({
      openDialog,
      closeDialog,
    }),
    [openDialog, closeDialog]
  );

  return (
    <DialogProviderContext.Provider value={contextValue}>
      {children}
      <Root open={dialogState.isOpen} onOpenChange={closeDialog}>
        <Portal>
          <ThemeProvider theme={theme}>{dialogState.content}</ThemeProvider>
        </Portal>
      </Root>
    </DialogProviderContext.Provider>
  );
}

export function useDialog(): DialogProviderContextValue {
  const context = useContext(DialogProviderContext);

  if (!context) {
    throw new Error("useDialog should be called within DialogProvider");
  }

  return context;
}
