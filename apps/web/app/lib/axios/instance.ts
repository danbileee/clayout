import axios, {
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  extractClientSideTokens,
  extractServerSideTokens,
} from "../cookie/extractTokens";

const baseConfig: CreateAxiosDefaults = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
};

function addCsrfTokenToHeader(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: InternalAxiosRequestConfig<any>,
  csrfToken?: string
) {
  // Only add CSRF token for non-GET requests
  if (config.method && config.method.toLowerCase() !== "get" && csrfToken) {
    config.headers["x-csrf-token"] = csrfToken;
  }

  return config;
}

function createClientAxiosInstance() {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    ...baseConfig,
  });

  instance.interceptors.request.use(
    (config) => {
      const { csrfToken } = extractClientSideTokens();

      return addCsrfTokenToHeader(config, csrfToken);
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
}

function createServerAxiosInstance(request: Request) {
  const instance = axios.create({
    baseURL: process.env.VITE_API_HOST,
    ...baseConfig,
  });

  instance.interceptors.request.use(
    (config) => {
      const { csrfToken } = extractServerSideTokens(request);

      const newConfig = addCsrfTokenToHeader(config, csrfToken);
      return newConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
}

export function createAxiosInstance(request?: Request) {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return createClientAxiosInstance();
  } else if (request) {
    return createServerAxiosInstance(request);
  } else {
    throw new Error(`Couldn't create the axios instance.`);
  }
}
