import { createAxiosInstance } from "@/lib/axios/instance";
import type { ReorderDto } from "@clayout/interface";
import type { AxiosResponse } from "axios";

interface PostEndpointParams {
  siteId: number;
  pageId: number;
}

interface PostQueryParams {}

interface PostBody extends ReorderDto {}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {
  success: boolean;
}

export async function postSiteBlockReorder(args: {
  params: PostParams;
  request?: Request;
}) {
  const {
    params: { siteId, pageId, sourceId, targetId },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, ReorderDto>,
    ReorderDto
  >(`/sites/${siteId}/pages/${pageId}/blocks/reorder`, { sourceId, targetId });
}
