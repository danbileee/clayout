import { postAuthTokenRefresh } from "@/apis/auth/token/refresh";
import { isAxiosError, type AxiosResponse } from "axios";
import { getErrorMessage } from "./getErrorMessage";

interface Params<Data extends AxiosResponse> {
  onRetry?: () => Promise<Data>;
  onRedirect?: () => void;
}

interface Returns<Data extends AxiosResponse> {
  message: string;
  error?: Error;
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
        data,
        message: getErrorMessage(error),
      };
    } catch (retryError: unknown) {
      if (isAxiosError(retryError) && retryError.response?.status === 401) {
        onRedirect?.();
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
