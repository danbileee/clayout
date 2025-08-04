import { createAxiosInstance } from "@/lib/axios/instance";
import type { Tables } from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * POST
 */

interface PostEndpointParams {}

interface PostQueryParams {}

interface PostBody extends Pick<Tables<"users">, "password"> {
  token: string;
}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {
  message: string;
}

export async function postAuthResetPassword(args: {
  params: PostParams;
  request?: Request;
}) {
  const {
    params: { token, password },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostParams>,
    PostParams
  >(`/auth/reset-password`, { token, password });
}
