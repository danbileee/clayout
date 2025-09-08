/**
 * PATCH
 */

import { createAxiosInstance } from "@/lib/axios/instance";
import type { ChangeSiteHomePageDto } from "@clayout/interface";
import type { AxiosResponse } from "axios";

interface PatchEndpointParams {
  siteId: number;
  pageId: number;
}

interface PatchQueryParams {}

interface PatchBody extends ChangeSiteHomePageDto {}

interface PatchParams
  extends PatchEndpointParams,
    PatchQueryParams,
    PatchBody {}

export async function patchSitePagesHome(args: {
  params: PatchParams;
  request?: Request;
}) {
  const {
    params: { siteId, pageId, ...params },
    request,
  } = args;
  const axios = createAxiosInstance(request);
  return await axios.patch<
    boolean,
    AxiosResponse<boolean, PatchBody>,
    PatchBody
  >(`/sites/${siteId}/pages/${pageId}/home`, params);
}
