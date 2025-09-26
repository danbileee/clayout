import { createAxiosInstance } from "@/lib/axios/instance";
import type { AxiosResponse } from "axios";

interface PostEndpointParams {
  siteId: number;
  pageId: number;
  blockId: number;
}

interface PostQueryParams {}

interface PostBody {}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {
  id: number;
}

export async function postSiteBlockDuplicate(args: {
  params: PostParams;
  request?: Request;
}) {
  const {
    params: { siteId, pageId, blockId },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostParams>,
    PostParams
  >(`/sites/${siteId}/pages/${pageId}/blocks/${blockId}/duplicate`);
}
