import { createAxiosInstance } from "@/lib/axios/instance";
import { getQueryKey } from "@/lib/react-query/getQueryKey";
import type { Tables } from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * GET
 */

interface GetEndpointParams {}

interface GetQueryParams {}

interface GetParams extends GetEndpointParams, GetQueryParams {}

interface GetResponse {
  user: Tables<"users"> | null;
}

export function getAuthUserKey(params?: Partial<GetParams>) {
  return getQueryKey("/auth/user");
}

export async function getAuthUser(args?: {
  params?: GetParams;
  request?: Request;
}) {
  const { request } = args ?? {};
  const axios = createAxiosInstance(request);
  return await axios.get<
    GetResponse,
    AxiosResponse<GetResponse, GetParams>,
    GetParams
  >("/auth/user");
}
