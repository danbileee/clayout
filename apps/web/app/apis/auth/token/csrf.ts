import { createAxiosInstance } from "@/lib/axios/instance";
import { getQueryKey } from "@/lib/react-query/getQueryKey";
import { type AxiosResponse } from "axios";

/**
 * GET
 */

interface GetEndpointParams {}

interface GetQueryParams {}

interface GetParams extends GetEndpointParams, GetQueryParams {
  csrfToken: string;
}

interface GetResponse {
  csrfToken: string;
}

export function getAuthTokenCsrfKey(params?: Partial<GetParams>) {
  return getQueryKey("/auth/token/csrf", params);
}

export async function getAuthTokenCsrf(params?: GetParams, request?: Request) {
  const axios = createAxiosInstance(request);
  return await axios.get<
    GetResponse,
    AxiosResponse<GetResponse, GetParams>,
    GetParams
  >("/auth/token/csrf");
}
