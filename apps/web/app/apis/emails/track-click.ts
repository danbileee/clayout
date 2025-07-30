import { createAxiosInstance } from "@/lib/axios/instance";
import type { DB } from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * POST
 */

interface PostEndpointParams {
  id: string;
}

interface PostQueryParams {}

interface PostBody
  extends Pick<DB<"email_click_events">, "link" | "button_text"> {}

interface PostResponse {}

export async function postEmailsTrackClick(
  { id, link, button_text }: PostEndpointParams & PostQueryParams & PostBody,
  request?: Request
) {
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostBody>,
    PostBody
  >(`/emails/${id}/track-click`, { link, button_text });
}
