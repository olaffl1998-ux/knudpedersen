import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL, SHOW_PREVIEW_BANNER } from "@/lib/site";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      // Forhåndsvisningen må ikke indekseres. Sæt VITE_PREVIEW_BANNER=false ved lancering.
      GET: () =>
        new Response(SHOW_PREVIEW_BANNER ? "User-agent: *\nDisallow: /\n" : `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }),
    },
  },
});
