import { createAxiosInstance } from "@/lib/axios/instance";
import type { SiteWithRelations, Tables } from "@clayout/interface";
import { type AxiosResponse } from "axios";

/**
 * PATCH
 */

interface PatchEndpointParams extends Pick<Tables<"sites">, "id"> {}

interface PatchQueryParams {}

interface PatchBody {}

interface PatchParams
  extends PatchEndpointParams,
    PatchQueryParams,
    PatchBody {}

interface PatchResponse {
  site: SiteWithRelations;
}

export async function patchSitePublish(args: {
  params: PatchParams;
  request?: Request;
}) {
  const {
    params: { id },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.patch<
    PatchResponse,
    AxiosResponse<PatchResponse, PatchParams>,
    PatchParams
  >(`/sites/${id}/publish`);
}
