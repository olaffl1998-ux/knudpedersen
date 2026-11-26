import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { modelHref, models, nonRolexBrands } from "@/data/catalog";
import { jewelleryBrandList, pieces } from "@/data/jewellery";
import { rolexAccessories, rolexCollections, rolexModels } from "@/data/rolex";

function sitemap() {
  const paths = [
    "/", "/ure", "/maerker", "/smykker", "/vielsesringe", "/brugte-ure", "/service", "/om-os", "/kontakt", "/book-tid",
    "/handelsbetingelser", "/privatlivspolitik", "/cookiepolitik", "/tilgaengelighed",
    ...nonRolexBrands.map((b) => `/maerker/${b.slug}`),
    ...models.map(modelHref),
    ...jewelleryBrandList.map((b) => `/smykker/${b.slug}`),
    ...pieces.map((p) => `/smykker/${p.brand}/${p.slug}`),
    ...["discover", "watches", "new-watches", "watchmaking", "servicing", "servicing-procedure", "servicing-prices", "world-of-rolex", "knud-pedersen", "contact-aarhus", "accessories"].map((p) => `/rolex/${p}`),
    ...rolexCollections.map((c) => `/rolex/${c.slug}`),
    ...rolexModels.map((m) => `/rolex/${m.slug}`),
    ...rolexAccessories.map((a) => `/rolex/accessories/${a.slug}`),
  ];
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `  <url><loc>${esc(`${SITE_URL}${p === "/" ? "" : p}`)}</loc><changefreq>weekly</changefreq></url>`)
    .join("\n")}\n</urlset>\n`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => new Response(sitemap(), { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } }),
    },
  },
});
