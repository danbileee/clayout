export function extractCsrfToken(request: Request): { csrfToken: string } {
  // Get the raw cookie header
  const cookieHeader = request.headers.get("cookie") || "";

  // Parse cookies (simple utility)
  const cookies = Object.fromEntries(
    cookieHeader
      .split("; ")
      .filter(Boolean)
      .map((cookieStr) => {
        const [name, ...rest] = cookieStr.split("=");
        return [name, decodeURIComponent(rest.join("="))];
      })
  );

  // Now you can access cookies['csrfToken'], etc.
  const csrfToken = cookies["csrfToken"];

  return {
    csrfToken,
  };
}
