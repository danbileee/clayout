import { createAxiosInstance } from "@/lib/axios/instance";
import type { Tables } from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * POST
 */

interface PostEndpointParams {
  id: string;
}

interface PostQueryParams {}

interface PostBody
  extends Pick<Tables<"email_click_events">, "link" | "buttonText"> {}

interface PostResponse {}

export async function postEmailsTrackClick(args: {
  params: PostEndpointParams & PostQueryParams & PostBody;
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
