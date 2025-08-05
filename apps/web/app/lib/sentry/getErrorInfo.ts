import * as Sentry from "@sentry/react-router";
import { isAxiosError } from "axios";
import { getErrorMessage } from "../axios/getErrorMessage";
import { isRouteErrorResponse } from "react-router";

export function getErrorInfo(error: unknown): {
  message: string;
  details: string;
  stack?: string;
} {
  const defaultMessage = `Oops!`;
  const defaultDetails = `An unexpected error occurred.`;

  if (isRouteErrorResponse(error)) {
    return {
      message: error.status === 404 ? "404" : "Error",
      details:
        error.status === 404
          ? "The requested page could not be found."
          : error.statusText || defaultDetails,
    };
  }

  // you only want to capture non 404-errors that reach the boundary
  Sentry.captureException(error);

  if (!error || import.meta.env.PROD) {
    return {
      message: defaultMessage,
      details: defaultDetails,
    };
  }

  if (isAxiosError(error)) {
    return {
      message: getErrorMessage(error),
      details: error.response?.statusText ?? `Axios error`,
      stack: error.stack,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      details: error.cause ? JSON.stringify(error.cause) : `Unknown error`,
      stack: error.stack,
    };
  }

  return {
    message: defaultMessage,
    details: defaultDetails,
  };
}
