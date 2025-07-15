import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/index.tsx"),
  route("counter", "./routes/counter.tsx"), // for dummy API test
] satisfies RouteConfig;
