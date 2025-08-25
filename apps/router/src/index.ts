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

const DEFAULT_DOMAIN = ".clayout.app";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = url.hostname;

    if (!host) {
      return new Response("Bad Request: Invalid hostname", { status: 404 });
    }

    // 📡 Send to the original request URL when the subdomain is reserved
    if (host.endsWith(DEFAULT_DOMAIN)) {
      const subdomain = host.replace(".clayout.app", "");
      const reservedListRaw = await env.SITE_ROUTING_KV.get(
        "reserved_subdomains",
        { type: "json" }
      );
      const reservedList =
        Array.isArray(reservedListRaw) && reservedListRaw.every(String)
          ? (reservedListRaw satisfies string[])
          : [];

      if (
        reservedList
          .map((s) => s.toLowerCase())
          .includes(subdomain.toLowerCase())
      ) {
        return fetch(request.url, request);
      }
    }

    // 🔍 Always query KV for latest mapping
    const siteId = await env.SITE_ROUTING_KV.get(`domain:${host}`);

    if (!siteId) {
      return new Response("Site not found", { status: 404 });
    }

    // 🔑 Only serve verification path
    if (url.pathname === "/.clayout-verification") {
      const token = await env.SITE_ROUTING_KV.get(`token:${siteId}`);
      return new Response(token, { status: 200 });
    }

    // 🗂 Determine file path
    let path = url.pathname;
    if (path === "/") path = "/index.html";
    const objectKey = `${siteId}${path}`;

    // 📦 Fetch from R2
    const object = await env.STATIC_R2.get(objectKey);
    if (!object) {
      return new Response("Not found", { status: 404 });
    }

    // ✅ Return the file
    return new Response(object.body, {
      headers: {
        "Content-Type": getContentType(path),
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
} satisfies ExportedHandler<Env>;

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
