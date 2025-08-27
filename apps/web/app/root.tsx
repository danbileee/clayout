import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import "./styles/index.css";
import { QueryClientProvider } from "./providers/QueryClientProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { Toaster } from "./components/ui/toaster";
import { getErrorInfo } from "./lib/sentry/getErrorInfo";

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

export function ErrorBoundary() {
  const error = useRouteError();
  const { message, details, stack } = getErrorInfo(error);

  if (error instanceof Error && error.message.includes("useContext")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Loading...</h1>
          <p className="text-gray-600">Please wait while we load the page.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">{message}</h1>
        <p className="text-gray-600">{details}</p>
        {stack && !import.meta.env.PROD && (
          <pre>
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
export default function App() {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
