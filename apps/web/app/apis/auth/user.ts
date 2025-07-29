import { createAxiosInstance } from "@/lib/axios/instance";
import { getQueryKey } from "@/lib/react-query/getQueryKey";
import type { DB } from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * GET
 */

interface GetEndpointParams {}

interface GetQueryParams {}

interface GetParams extends GetEndpointParams, GetQueryParams {
  accessToken?: string;
  basicToken?: string;
}

interface GetResponse {
  user: DB<"users">;
}

export function getAuthUserKey(params?: Partial<GetParams>) {
  return getQueryKey("/auth/user", params);
}

export async function getAuthUser(params?: GetParams, request?: Request) {
  const axios = createAxiosInstance(request);
  return await axios.get<
    GetResponse,
    AxiosResponse<GetResponse, GetParams>,
    GetParams
  >("/auth/user");
}
