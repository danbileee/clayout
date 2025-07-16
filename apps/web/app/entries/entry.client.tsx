import React from "react";
import { hydrateRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import routesPromise from "../routes";

async function main() {
  const routes = await routesPromise;
  const router = createBrowserRouter(routes as RouteObject[]);
  const root = document.getElementById("root");

  if (!root) throw new Error("Missing #root element");

  hydrateRoot(
    root,
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

main();
