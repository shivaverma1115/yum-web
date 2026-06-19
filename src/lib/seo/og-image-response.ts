/** Cache OG images for crawlers (WhatsApp/Meta, Twitter, etc.). */
export function withOgImageCacheHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set(
    "Cache-Control",
    "public, max-age=86400, stale-while-revalidate=604800",
  );
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
