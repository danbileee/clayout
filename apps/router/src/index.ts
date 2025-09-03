/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Hono } from "hono";

const DEFAULT_DOMAIN = ".clayout.app";

type Bindings = {
  SITE_ROUTING_KV: KVNamespace;
  CLAYOUT_BUNDLES_R2: R2Bucket;
};

type Variables = {
  siteId: string;
  releaseVersion: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.onError((err, c) => {
  console.error("Worker error:", err);
  return c.text("Internal Server Error", 500);
});

/**
 * Global middleware for
 * 1. host validation
 * 2. reserved subdomains
 * 3. setting variables
 */
app.use("*", async (ctx, next) => {
  try {
    const url = new URL(ctx.req.url);
    const hostname = url.hostname;

    console.log(`Processing request for hostname: ${hostname}`);

    if (!hostname) {
      console.log("Bad Request: Invalid hostname");
      return ctx.text("Bad Request: Invalid hostname", 400);
    }

    // Reserved subdomain passthrough
    if (hostname.endsWith(DEFAULT_DOMAIN)) {
      const subdomain = hostname.replace(DEFAULT_DOMAIN, "");
      // Read as text to avoid runtime JSON parse errors from malformed KV values
      const reservedListText = await ctx.env.SITE_ROUTING_KV.get(
        "reserved_subdomains",
        { type: "text" }
      );
      const reservedList = safeParseStringArray(reservedListText);

      if (
        reservedList
          .map((s) => s.toLowerCase())
          .includes(subdomain.toLowerCase())
      ) {
        console.log("Reserved Subdomain: Proceed the original request.");
        // Forward original request unchanged
        try {
          const response = await fetch(ctx.req.raw);
          return response;
        } catch (fetchError) {
          console.error("Fetch error for reserved subdomain:", fetchError);
          return ctx.text("Error forwarding request", 500);
        }
      }
    }

    const kvValue = await ctx.env.SITE_ROUTING_KV.get(`domain:${hostname}`);
    console.log(`KV lookup for domain:${hostname} = ${kvValue}`);

    if (!kvValue) {
      console.log(`Site not found for hostname: ${hostname}`);
      return ctx.text("Site not found", 404);
    }

    const [siteId, releaseVersion] = kvValue.split(":");

    console.log(
      `context >>> siteId: ${siteId} | releaseVersion: ${releaseVersion}`
    );

    if (!siteId) {
      return ctx.text("Site id not found", 404);
    }

    if (!releaseVersion) {
      return ctx.text("Invalid release version", 404);
    }

    ctx.set("siteId", siteId);
    ctx.set("releaseVersion", releaseVersion);

    await next();
  } catch (error) {
    console.error("Middleware error:", error);
    return ctx.text("Internal Server Error", 500);
  }
});

/**
 * Debug endpoint to check KV and R2 status
 */
app.get("/.clayout-debug", async (ctx) => {
  try {
    const url = new URL(ctx.req.url);
    const hostname = url.hostname;

    const debugInfo = {
      hostname,
      timestamp: new Date().toISOString(),
      kvStatus: "unknown",
      r2Status: "unknown",
    };

    // Test KV access
    try {
      const testKey = `domain:${hostname}`;
      const testValue = await ctx.env.SITE_ROUTING_KV.get(testKey);
      debugInfo.kvStatus = testValue ? "accessible" : "not_found";
    } catch (kvError) {
      debugInfo.kvStatus = `error: ${(kvError as Error).message}`;
    }

    // Test R2 access
    try {
      const testKey = "test-key";
      await ctx.env.CLAYOUT_BUNDLES_R2.get(testKey);
      debugInfo.r2Status = "accessible";
    } catch (r2Error) {
      debugInfo.r2Status = `error: ${(r2Error as Error).message}`;
    }

    return ctx.json(debugInfo, 200);
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return ctx.text("Internal Server Error", 500);
  }
});

/**
 * Serve domain verification token
 */
app.get("/.clayout-verification", async (ctx) => {
  try {
    const siteId = ctx.get("siteId") as string;
    const token = await ctx.env.SITE_ROUTING_KV.get(`token:${siteId}`);

    return ctx.text(token ?? "", 200);
  } catch (error) {
    console.error("Verification error:", error);
    return ctx.text("Internal Server Error", 500);
  }
});

/**
 * Static file handler from R2
 */
app.get("*", async (ctx) => {
  try {
    const siteId = ctx.get("siteId") as string;
    const releaseVersion = ctx.get("releaseVersion") as string;
    const url = new URL(ctx.req.url);
    const requestPath = url.pathname;

    console.log(
      `Serving path: ${requestPath} for site: ${siteId}, version: ${releaseVersion}`
    );

    const { object, resolvedPath, objectKey } = await resolveR2Object(
      ctx,
      siteId,
      releaseVersion,
      requestPath
    );

    if (!object) {
      console.log(`R2 object not found for key: ${objectKey}`);
      return ctx.text("Not found", 404);
    }

    console.log(`R2 >>> objectKey: ${objectKey}, size: ${object.size}`);

    // Validate object body exists
    if (!object.body) {
      console.error(`R2 object has no body for key: ${objectKey}`);
      return ctx.text("Invalid object", 500);
    }

    return new Response(object.body, {
      headers: {
        "Content-Type":
          object.httpMetadata?.contentType ?? getContentType(resolvedPath),
        "Cache-Control":
          object.httpMetadata?.cacheControl ?? "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Static file handler error:", error);
    return ctx.text("Internal Server Error", 500);
  }
});

// Add OPTIONS handler for CORS preflight
app.options("*", (c) => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
});

export default app;

function getContentType(path: string) {
  if (path.endsWith(".html")) return "text/html; charset=utf-8";
  if (path.endsWith(".css")) return "text/css; charset=utf-8";
  if (path.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (path.endsWith(".json")) return "application/json; charset=utf-8";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".svg")) return "image/svg";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

function safeParseStringArray(input: string | null): string[] {
  if (!input) return [];
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
      return parsed as string[];
    }
  } catch (_) {
    // Try to be lenient with trailing commas like ["a",]
    try {
      const withoutTrailingCommas = input.replace(/,\s*\]/g, "]");
      const parsed = JSON.parse(withoutTrailingCommas);
      if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
        return parsed as string[];
      }
    } catch (_) {
      // fallthrough
    }
  }
  return [];
}

async function resolveR2Object(
  ctx: any,
  siteId: string,
  releaseVersion: string,
  path: string
): Promise<{
  object: R2ObjectBody | null;
  resolvedPath: string;
  objectKey: string;
}> {
  try {
    const normalizedPath = normalizePath(path);
    const candidates = buildCandidatePaths(normalizedPath);

    console.log(`Resolving R2 object for path: ${path}`);
    console.log(`Normalized path: ${normalizedPath}`);
    console.log(`Candidate paths: ${JSON.stringify(candidates)}`);

    for (const candidate of candidates) {
      const key = `sites/${siteId}/${releaseVersion}${candidate}`;
      console.log(`Trying R2 key: ${key}`);

      try {
        const obj = await ctx.env.CLAYOUT_BUNDLES_R2.get(key);
        if (obj) {
          console.log(`Found R2 object: ${key}, size: ${obj.size}`);
          return { object: obj, resolvedPath: candidate, objectKey: key };
        }
      } catch (r2Error) {
        console.error(`R2 error for key ${key}:`, r2Error);
        // Continue to next candidate
      }
    }

    console.log(`No R2 object found for any candidate paths`);
    return {
      object: null,
      resolvedPath: normalizedPath,
      objectKey: `sites/${siteId}/${releaseVersion}${normalizedPath}`,
    };
  } catch (error) {
    console.error("Error in resolveR2Object:", error);
    throw error;
  }
}

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  try {
    return path.replace(/\/+/, "/");
  } catch (_) {
    return path;
  }
}

function buildCandidatePaths(path: string): string[] {
  if (path === "/") return ["/index.html"];

  const hasExtension = /\.[a-zA-Z0-9]+$/.test(path);
  const candidates: string[] = [];

  // Exact
  candidates.push(path);
  // .html variant
  if (!hasExtension) candidates.push(`${path}.html`);
  // Directory index
  if (path.endsWith("/")) candidates.push(`${path}index.html`);
  else if (!hasExtension) candidates.push(`${path}/index.html`);
  // Root index as SPA fallback
  candidates.push("/index.html");

  return Array.from(new Set(candidates));
}
