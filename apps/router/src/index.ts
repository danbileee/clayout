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
    const reservedListRaw = await ctx.env.SITE_ROUTING_KV.get(
      "reserved_subdomains",
      { type: "json" }
    );
    const reservedList =
      Array.isArray(reservedListRaw) &&
      reservedListRaw.every((v) => typeof v === "string")
        ? (reservedListRaw as string[])
        : [];

    if (
      reservedList.map((s) => s.toLowerCase()).includes(subdomain.toLowerCase())
    ) {
      // Forward original request unchanged
      return fetch(ctx.req.raw);
    }
  }

  const kvValue = await ctx.env.SITE_ROUTING_KV.get(`domain:${hostname}`);

  if (!kvValue) {
    return ctx.text("Site not found", 404);
  }

  const [siteId, releaseVersion] = kvValue.split(":");

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
  let path = url.pathname;

  if (path === "/") path = "/index.html";

  const objectKey = `sites/${siteId}/${releaseVersion}${path}`;
  const object = await ctx.env.CLAYOUT_BUNDLES_R2.get(objectKey);

  if (!object) {
    return ctx.text("Not found", 404);
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": getContentType(path),
      "Cache-Control": "public, max-age=3600",
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
