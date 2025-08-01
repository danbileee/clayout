/* eslint-disable sonarjs/no-hardcoded-passwords */
import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export const Paths = {
  /**
   * 1-Depth
   */
  home: "home",
  /**
   * Auth
   */
  auth: "auth",
  confirm: "confirm",
  error: "error",
  oauth: "oauth",
  verify: "verify",
  login: "login",
  signup: "signup",
  "forgot-password": "forgot-password",
  "reset-password": "reset-password",
  /**
   * Counter (dummy)
   */
  counter: "counter",
} as const;

export type Path = keyof typeof Paths;

export function joinPath(paths: Path[]) {
  return `/${paths.join("/")}`;
}

function getComponentEntry(paths: Path[]) {
  return `./pages${joinPath(paths)}.tsx`;
}

function getIndexEntry(paths: Path[]) {
  return `./pages${joinPath(paths)}/index.tsx`;
}

function getLayoutEntry(paths: Path[]) {
  return `./pages${joinPath(paths)}/layout.tsx`;
}

export default [
  /**
   * 1-Depth
   */
  index(getIndexEntry([Paths.home])),

  /**
   * Auth
   */
  layout(getLayoutEntry([Paths.auth]), [
    ...prefix(Paths.auth, [
      route(Paths.confirm, getComponentEntry([Paths.auth, Paths.confirm])),
      route(Paths.error, getComponentEntry([Paths.auth, Paths.error])),
      route(Paths.oauth, getComponentEntry([Paths.auth, Paths.oauth])),
      route(Paths.verify, getComponentEntry([Paths.auth, Paths.verify])),
    ]),
    route(Paths.login, getComponentEntry([Paths.auth, Paths.login])),
    route(Paths.signup, getComponentEntry([Paths.auth, Paths.signup])),
    route(
      Paths["forgot-password"],
      getComponentEntry([Paths.auth, Paths["forgot-password"]])
    ),
    route(
      Paths["reset-password"],
      getComponentEntry([Paths.auth, Paths["reset-password"]])
    ),
  ]),

  /**
   * Counter (dummy)
   */
  route(Paths.counter, getIndexEntry([Paths.counter])),
] satisfies RouteConfig;
