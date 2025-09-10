import { postAuthTokenRefresh } from "@/apis/auth/token/refresh";
import { AxiosError, isAxiosError, type AxiosResponse } from "axios";
import { getErrorMessage } from "./getErrorMessage";

export interface AxiosErrorData {
  error: string;
  message: string;
  statusCode: number;
}

interface Params<Data extends AxiosResponse> {
  onRetry?: () => Promise<Data | void>;
  onRedirect?: () => Promise<void>;
}

interface Returns<Data extends AxiosResponse> {
  message: string;
  error?: AxiosError<AxiosErrorData> | Error;
  data?: Data;
}

export async function handleError<Data extends AxiosResponse>(
  error: unknown,
  params?: Params<Data>
): Promise<Returns<Data>> {
  const { onRetry, onRedirect } = params ?? {};

  if (isAxiosError(error) && error.response?.status === 401) {
    try {
      await postAuthTokenRefresh();
      const data = await onRetry?.();

      return {
        data: isAxiosResponse(data) ? data : undefined,
        message: getErrorMessage(error),
      };
    } catch (retryError: unknown) {
      if (isAxiosError(retryError) && retryError.response?.status === 401) {
        await onRedirect?.();
      }

      const retryErrorMessage = getErrorMessage(retryError);

      return {
        error:
          retryError instanceof Error
            ? retryError
            : new Error(retryErrorMessage),
        message: retryErrorMessage,
      };
    }
  }

  const errorMessage = getErrorMessage(error);

  return {
    error: error instanceof Error ? error : new Error(errorMessage),
    message: errorMessage,
  };
}

function isAxiosResponse(data: unknown): data is AxiosResponse {
  if (!data) return false;

  return typeof data === "object" && "data" in data && "status" in data;
}

export function isAxiosErrorData(data: unknown): data is AxiosErrorData {
  if (!data) return false;

  return (
    typeof data === "object" &&
    "error" in data &&
    "message" in data &&
    "statusCode" in data
  );
}
