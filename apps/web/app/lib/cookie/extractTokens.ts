import cookie from "cookie";

export function extractServerSideTokens(request: Request): {
  csrfToken?: string;
  accessToken?: string;
  refreshToken?: string;
  basicToken?: string;
} {
  const cookies = request?.headers?.get?.("cookie") ?? "";
  const { csrfToken, accessToken, refreshToken, basicToken } =
    cookie.parse(cookies);

  return {
    csrfToken,
    accessToken,
    refreshToken,
    basicToken,
  };
}

// Helper function to parse cookies manually
function parseCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  if (!cookieString) return cookies;

  cookieString.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}

export function extractClientSideTokens(): {
  csrfToken?: string;
} {
  // Check if we're in a browser environment
  if (typeof document === "undefined") {
    return {
      csrfToken: undefined,
    };
  }

  const cookies = document.cookie ?? "";
  const parsedCookies = parseCookies(cookies);

  return {
    csrfToken: parsedCookies.csrfToken,
  };
}
