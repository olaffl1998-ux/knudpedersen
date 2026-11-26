import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { models, nonRolexBrands } from "@/data/catalog";
import { jewelleryBrandList, pieces } from "@/data/jewellery";
import { rolexAccessories, rolexCollections, rolexModels } from "@/data/rolex";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/", "/ure", "/smykker", "/service", "/om-os", "/kontakt", "/privatlivspolitik", "/cookiepolitik", "/tilgaengelighed",
    ...nonRolexBrands.map((b) => `/ure/${b.slug}`),
    ...models.map((m) => `/ure/${m.brand}/${m.slug}`),
    ...jewelleryBrandList.map((b) => `/smykker/${b.slug}`),
    ...pieces.map((p) => `/smykker/${p.brand}/${p.slug}`),
    ...["discover", "watches", "new-watches", "watchmaking", "servicing", "servicing-procedure", "servicing-prices", "world-of-rolex", "knud-pedersen", "contact-aarhus", "accessories"].map((p) => `/rolex/${p}`),
    ...rolexCollections.map((c) => `/rolex/${c.slug}`),
    ...rolexModels.map((m) => `/rolex/${m.slug}`),
    ...rolexAccessories.map((a) => `/rolex/accessories/${a.slug}`),
  ];
  return paths.map((p) => ({ url: `${SITE_URL}${p === "/" ? "" : p}`, changeFrequency: "weekly" }));
}
