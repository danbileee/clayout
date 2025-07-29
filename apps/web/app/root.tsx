import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./style.css";
import { QueryClientProvider } from "./lib/react-query/QuernClientProvider";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <QueryClientProvider>
      <Outlet />
    </QueryClientProvider>
  );
}
