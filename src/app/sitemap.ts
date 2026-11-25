import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { models, nonRolexBrands } from "@/data/catalog";
import { rolexCollections, rolexModels, rolexPages } from "@/data/rolex";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/", "/ure", "/smykker", "/service", "/om-os", "/kontakt", "/privatlivspolitik", "/cookiepolitik", "/tilgaengelighed",
    ...nonRolexBrands.map((b) => `/ure/${b.slug}`),
    ...models.map((m) => `/ure/${m.brand}/${m.slug}`),
    "/rolex", "/rolex/ure", "/rolex/kontakt",
    ...Object.keys(rolexPages).map((p) => `/rolex/${p}`),
    ...rolexCollections.map((c) => `/rolex/ure/${c.slug}`),
    ...rolexModels.map((m) => `/rolex/ure/${m.collection}/${m.rmc.toLowerCase()}`),
  ];
  return paths.map((p) => ({ url: `${SITE_URL}${p === "/" ? "" : p}`, changeFrequency: "weekly" }));
}
