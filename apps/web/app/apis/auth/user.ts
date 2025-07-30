import { createAxiosInstance } from "@/lib/axios/instance";
import { getQueryKey } from "@/lib/react-query/getQueryKey";
import type { DB } from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * GET
 */

interface GetEndpointParams {}

interface GetQueryParams {}

interface GetParams extends GetEndpointParams, GetQueryParams {}

interface GetResponse {
  user: DB<"users"> | null;
}

export function getAuthUserKey(params?: Partial<GetParams>) {
  return getQueryKey("/auth/user");
}

export async function getAuthUser(params?: GetParams, request?: Request) {
  const axios = createAxiosInstance(request);
  try {
    return await axios.get<
      GetResponse,
      AxiosResponse<GetResponse, GetParams>,
      GetParams
    >("/auth/user");
  } catch {
    // Return a default response structure when auth fails
    // This prevents React Query from receiving undefined
    return {
      data: {
        user: null,
      },
    } as AxiosResponse<GetResponse, GetParams>;
  }
}
