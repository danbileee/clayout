import { createAxiosInstance } from "@/lib/axios/instance";
import type { RecordEmailClickDto } from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * POST
 */

interface PostEndpointParams {
  id: string;
}

interface PostQueryParams {}

interface PostBody extends RecordEmailClickDto {}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {}

export async function postEmailsTrackClick(args: {
  params: PostParams;
  request?: Request;
}) {
  const {
    params: { id, link, buttonText },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostBody>,
    PostBody
  >(`/emails/${id}/track-click`, { link, buttonText });
}
