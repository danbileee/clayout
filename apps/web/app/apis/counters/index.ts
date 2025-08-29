import { createAxiosInstance } from "@/lib/axios/instance";
import { getQueryKey } from "@/lib/react-query/getQueryKey";
import { type AxiosResponse } from "axios";
import type { Tables, TablesInsert } from "@clayout/interface";

/**
 * GET
 */

interface GetEndpointParams {
  ts: string;
}

interface GetQueryParams {}

interface GetParams extends GetEndpointParams, GetQueryParams {}

interface GetResponse {
  counters: Tables<"counters">[];
  ts: string;
}

export function getCoutnersKey(params?: Partial<GetParams>) {
  return getQueryKey("/counters", params);
}

export async function getCoutners(args: {
  params: GetParams;
  request?: Request;
}) {
  const { params, request } = args;
  const axios = createAxiosInstance(request);
  return await axios.get<
    GetResponse,
    AxiosResponse<GetResponse, GetParams>,
    GetParams
  >(`/counters/${params.ts}`);
}

/**
 * POST
 */

interface PostEndpointParams {}

interface PostQueryParams {}

interface PostBody extends Pick<TablesInsert<"counters">, "value"> {}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {
  counter: Tables<"counters">;
}

export async function postCounters(args: {
  params: PostParams;
  request?: Request;
}) {
  const { params, request } = args;
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostParams>,
    PostParams
  >(`/counters`, params);
}

/**
 * PATCH
 */

interface PatchEndpointParams extends Pick<Tables<"counters">, "id"> {}

interface PatchQueryParams {}

interface PatchBody extends Pick<TablesInsert<"counters">, "value"> {}

interface PatchParams
  extends PatchEndpointParams,
    PatchQueryParams,
    PatchBody {}

interface PatchResponse {
  counter: Tables<"counters">;
}

export async function patchCounters(args: {
  params: PatchParams;
  request?: Request;
}) {
  const {
    params: { id, value },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.patch<
    PatchResponse,
    AxiosResponse<PatchResponse, PatchBody>,
    PatchBody
  >(`/counters/${id}`, { value });
}
