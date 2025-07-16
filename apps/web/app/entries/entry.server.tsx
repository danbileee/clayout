import {
  createStaticHandler,
  createStaticRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import { renderToReadableStream } from "react-dom/server";
import routesPromise from "../routes";

export default async function handleRequest(req: Request) {
  const routes = await routesPromise;
  const handler = createStaticHandler(routes as RouteObject[]);
  const context = await handler.query(req);

  if (context instanceof Response) return context; // redirect or error

  const router = createStaticRouter(handler.dataRoutes, context);

  const stream = await renderToReadableStream(
    <RouterProvider router={router} />,
    {
      bootstrapScripts: ["/assets/index.js"], // Adjust if hashed
    }
  );

  return new Response(stream, {
    headers: { "Content-Type": "text/html" },
  });
}
