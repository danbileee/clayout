import { createAxiosInstance } from "@/lib/axios/instance";
import { getQueryKey } from "@/lib/react-query/getQueryKey";
import type { PexelsSearchDto, PexelsSearchResult } from "@clayout/interface";
import { type AxiosResponse } from "axios";
import qs from "qs";

export function getPexelsSearchQueryKey(params?: Partial<PexelsSearchDto>) {
  return getQueryKey("/pexels/search", params);
}

export async function getPexelsSearch(args: {
  params: PexelsSearchDto;
  request?: Request;
}) {
  const { params, request } = args;
  const axios = createAxiosInstance(request);
  const queryString = qs.stringify(params, { addQueryPrefix: true });
  return await axios.get<
    PexelsSearchResult,
    AxiosResponse<PexelsSearchResult, PexelsSearchDto>,
    PexelsSearchDto
  >(`/pexels/search${queryString}`);
}
