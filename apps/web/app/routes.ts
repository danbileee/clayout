import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/_index.tsx"),
  route("counter", "./routes/counter.tsx"), // dummy route for API test
  route("login", "./routes/login.tsx"),
  route("logout", "./routes/logout.tsx"),
  route("protected", "./routes/protected.tsx"),
  route("auth/oauth", "./routes/auth.oauth.tsx"),
  route("auth/error", "./routes/auth.error.tsx"),
] satisfies RouteConfig;
