import handleRequest from "../build/server/index";

export const onRequest = async (context) => {
  const request = context.request;
  return await handleRequest(request);
};
