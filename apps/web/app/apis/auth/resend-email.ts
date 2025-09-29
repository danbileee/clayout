import { createAxiosInstance } from "@/lib/axios/instance";
import type { ResendAuthEmailDto } from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * POST
 */

interface PostEndpointParams {}

interface PostQueryParams {}

interface PostBody extends ResendAuthEmailDto {}

interface PostParams extends PostEndpointParams, PostQueryParams, PostBody {}

interface PostResponse {
  message: string;
}

export async function postAuthResendEmail(args: {
  params: PostParams;
  request?: Request;
}) {
  const {
    params: { key },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.post<
    PostResponse,
    AxiosResponse<PostResponse, PostParams>,
    PostParams
  >(`/auth/resend-email`, { key });
}
