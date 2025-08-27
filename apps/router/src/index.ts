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

/**
 * Global middleware for
 * 1. host validation
 * 2. reserved subdomains
 * 3. setting variables
 */
app.use("*", async (ctx, next) => {
  const url = new URL(ctx.req.url);
  const hostname = url.hostname;

  if (!hostname) {
    return ctx.text("Bad Request: Invalid hostname", 404);
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
      reservedList.map((s) => s.toLowerCase()).includes(subdomain.toLowerCase())
    ) {
      console.log("Reserved Subdomain: Proceed the original request.");
      // Forward original request unchanged
      return fetch(ctx.req.raw);
    }
  }

  const kvValue = await ctx.env.SITE_ROUTING_KV.get(`domain:${hostname}`);

  if (!kvValue) {
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
});

/**
 * Serve domain verification token
 */
app.get("/.clayout-verification", async (ctx) => {
  const siteId = ctx.get("siteId") as string;
  const token = await ctx.env.SITE_ROUTING_KV.get(`token:${siteId}`);

  return ctx.text(token ?? "", 200);
});

/**
 * Static file handler from R2
 */
app.get("*", async (ctx) => {
  const siteId = ctx.get("siteId") as string;
  const releaseVersion = ctx.get("releaseVersion") as string;
  const url = new URL(ctx.req.url);
  const requestPath = url.pathname;

  const { object, resolvedPath, objectKey } = await resolveR2Object(
    ctx,
    siteId,
    releaseVersion,
    requestPath
  );

  if (!object) {
    return ctx.text("Not found", 404);
  }

  console.log(`R2 >>> objectKey: ${objectKey}`);

  return new Response(object.body, {
    headers: {
      "Content-Type":
        object.httpMetadata?.contentType ?? getContentType(resolvedPath),
      "Cache-Control":
        object.httpMetadata?.cacheControl ?? "public, max-age=3600",
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
  const normalizedPath = normalizePath(path);
  const candidates = buildCandidatePaths(normalizedPath);

  for (const candidate of candidates) {
    const key = `sites/${siteId}/${releaseVersion}${candidate}`;
    const obj = await ctx.env.CLAYOUT_BUNDLES_R2.get(key);
    if (obj) {
      return { object: obj, resolvedPath: candidate, objectKey: key };
    }
  }

  return {
    object: null,
    resolvedPath: normalizedPath,
    objectKey: `sites/${siteId}/${releaseVersion}${normalizedPath}`,
  };
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
