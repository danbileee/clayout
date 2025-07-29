import axios, {
  type AxiosInstance,
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
  },
  timeout: 15000,
};

let isRefreshingCsrf = false;
let isRefreshingToken = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let csrfQueue: any[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tokenQueue: any[] = [];

function processCsrfQueue(error: unknown, ok: boolean = false) {
  csrfQueue.forEach((prom) => {
    if (ok) prom.resolve();
    else prom.reject(error);
  });
  csrfQueue = [];
}

function processTokenQueue(error: unknown, ok: boolean = false) {
  tokenQueue.forEach((prom) => {
    if (ok) prom.resolve();
    else prom.reject(error);
  });
  tokenQueue = [];
}

async function getCsrfToken(request?: Request): Promise<void> {
  const instance = createAxiosInstance(request);

  return instance.get("/auth/token/csrf");
}

async function getAccessToken(request?: Request): Promise<void> {
  const instance = createAxiosInstance(request);

  return instance.post("/auth/token/refresh");
}

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

async function refreshAccessTokenAndRetry(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  instance: AxiosInstance,
  refreshToken?: string
) {
  const originalRequest = error.config;

  if (!refreshToken) {
    return Promise.reject(error);
  }

  if (isRefreshingToken) {
    return new Promise((resolve, reject) => {
      tokenQueue.push({
        resolve: () => {
          originalRequest._retry = true;
          resolve(instance(originalRequest));
        },
        reject: (err: unknown) => reject(err),
      });
    });
  }

  originalRequest._retry = true;
  isRefreshingToken = true;

  try {
    await getAccessToken(); // This will update the cookies
    processTokenQueue(null, true);
    return instance(originalRequest); // retry original request
  } catch (err) {
    processTokenQueue(err, false);
    return Promise.reject(err);
  } finally {
    isRefreshingToken = false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function refreshCsrfTokenAndRetry(error: any, instance: AxiosInstance) {
  const originalRequest = error.config;

  if (isRefreshingCsrf) {
    return new Promise((resolve, reject) => {
      csrfQueue.push({
        resolve: () => {
          originalRequest._csrfRetry = true;
          resolve(instance(originalRequest));
        },
        reject: (err: unknown) => reject(err),
      });
    });
  }

  originalRequest._csrfRetry = true;
  isRefreshingCsrf = true;

  try {
    await getCsrfToken(); // will reset cookie
    processCsrfQueue(null, true);
    return instance(originalRequest); // retry original request
  } catch (err) {
    processCsrfQueue(err, false);
    return Promise.reject(err);
  } finally {
    isRefreshingCsrf = false;
  }
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

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        const { refreshToken } = extractClientSideTokens();

        refreshAccessTokenAndRetry(error, instance, refreshToken);
      }

      // Handle CSRF token refresh for non-GET requests
      if (
        error.response?.status === 401 &&
        !originalRequest._csrfRetry &&
        originalRequest.method &&
        originalRequest.method.toLowerCase() !== "get"
      ) {
        refreshCsrfTokenAndRetry(error, instance);
      }

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

      return addCsrfTokenToHeader(config, csrfToken);
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    /**
     * on response fulfilled
     */
    (response) => response,
    /**
     * on response rejected
     */
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        const { refreshToken } = extractServerSideTokens(request);

        refreshAccessTokenAndRetry(error, instance, refreshToken);
      }

      // Handle CSRF token refresh for non-GET requests
      if (
        error.response?.status === 401 &&
        !originalRequest._csrfRetry &&
        originalRequest.method &&
        originalRequest.method.toLowerCase() !== "get"
      ) {
        refreshCsrfTokenAndRetry(error, instance);
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

export function createAxiosInstance(request?: Request) {
  if (typeof window !== "undefined" && typeof import.meta !== "undefined") {
    return createClientAxiosInstance();
  } else if (request) {
    return createServerAxiosInstance(request);
  } else {
    throw new Error(`Couldn't create the axios instance.`);
  }
}
