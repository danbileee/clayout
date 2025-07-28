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

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {}

export async function postEmailsTrackClick({
  id,
  link,
  button_text,
}: PostParams) {
  const axios = createAxiosInstance();
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostParams>,
    PostParams
  >(`/emails/${id}/track-click`, { id, link, button_text });
}
