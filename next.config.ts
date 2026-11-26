import type { NextConfig } from "next";
import { pieces } from "./src/data/jewellery";
import { models } from "./src/data/catalog";
import { rolexAccessories, rolexCollections, rolexModels } from "./src/data/rolex";

/** 301-omdirigeringer fra den gamle ScanNet-side, så placeringer i Google bevares */
const shopBrand: Record<string, string> = {
  "20-rolex": "/rolex/discover",
  "21-tudor": "/maerker/tudor",
  "17-glashutte-original": "/maerker/glashutte-original",
  "24-chopard-watches--jewellery": "/maerker/chopard",
  "10-breitling": "/maerker/breitling",
  "8-omega": "/maerker/omega",
  "42-grand-seiko": "/maerker/grand-seiko",
  "11-tag-heuer": "/maerker/tag-heuer",
  "12-longines": "/maerker/longines",
  "26-baume--mercier": "/maerker/baume-mercier",
  "38-oris": "/maerker/oris",
  "39-doxa": "/maerker/doxa",
  "14-montblanc-ure": "/maerker/montblanc",
  "15-montblanc-penne": "/maerker/montblanc",
  "16-montblanc-tilbehoer": "/maerker/montblanc",
  "25-gucci-watches": "/maerker/gucci",
  "25-gucci": "/maerker/gucci",
  "27-gucci-jewellery": "/smykker/gucci",
  "18-marselis-jewellery": "/smykker/marselis",
  "37-georg-jensen": "/smykker/georg-jensen",
};

const pages: Record<string, string> = {
  "/historie": "/om-os",
  "/rolex": "/rolex/discover",
  "/rolex-kollektion": "/rolex/watches",
  "/rolex-ure-kollektioner": "/rolex/watches",
  "/nye-ure-2026": "/rolex/new-watches",
  "/rolex-urmageri": "/rolex/watchmaking",
  "/servicere-dit-rolex": "/rolex/servicing",
  "/rolex-service-procedure": "/rolex/servicing-procedure",
  "/rolex-serviceeftersyn-priser": "/rolex/servicing-prices",
  "/rolex-send-en-besked": "/rolex/contact-aarhus#besked",
  "/kontakt1": "/kontakt",
  "/kontakt-os": "/kontakt",
  "/nyheder": "/om-os",
  "/nyheder/:slug*": "/om-os",
  "/job-hos-knud-pedersen": "/om-os#job",
  "/cookies-og-privatlivspolitik": "/cookiepolitik",
  "/persondatapolitik": "/privatlivspolitik",
  "/bestilt-tid-i-butikken": "/book-tid",
  "/bestil-tid-service": "/book-tid?formaal=service",
  "/explore-tudor": "/maerker/tudor",
  "/chopard-history": "/maerker/chopard",
  "/ole-mathiesen": "/maerker/ole-mathiesen",
  "/marc-harit": "/smykker",
  "/oyster-story": "/rolex/world-of-rolex",
  "/rolex-accessories": "/rolex/accessories",
  "/shop": "/ure",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // Gamle Rolex-adresser (/rolex-kollektion-x/, /rolex-model-mXXXX/, /rolex-accessories-x/) til de nye
      ...rolexCollections.map((c) => ({ source: `/rolex-kollektion-${c.slug}`, destination: `/rolex/${c.slug}`, permanent: true })),
      ...rolexModels.map((m) => ({ source: `/rolex-${m.slug}`, destination: `/rolex/${m.slug}`, permanent: true })),
      ...rolexAccessories.map((a) => ({ source: `/rolex-accessories-${a.slug}`, destination: `/rolex/accessories/${a.slug}`, permanent: true })),
      { source: "/rolex/ure", destination: "/rolex/watches", permanent: true },
      { source: "/rolex/kontakt", destination: "/rolex/contact-aarhus", permanent: true },
      ...Object.entries(pages).map(([source, destination]) => ({ source, destination, permanent: true })),
      // Hvert gammelt produkt (/shop/<kategori>/<id>-<varenr>/) sendes til samme ur på den nye side
      ...pieces.map((p) => ({ source: `/shop/:cat/:product(${p.oldId}-[^/]*)/:rest*`, destination: `/smykker/${p.brand}/${p.slug}`, permanent: true })),
      ...models.filter((m) => m.oldId).map((m) => ({ source: `/shop/:cat/:product(${m.oldId}-[^/]*)/:rest*`, destination: `/ur/${m.brand}-${m.slug}`, permanent: true })),
      ...Object.entries(shopBrand).flatMap(([id, destination]) => [
        { source: `/shop/${id}`, destination, permanent: true },
        { source: `/shop/${id}/:product*`, destination, permanent: true },
        { source: `/Shop/${id}`, destination, permanent: true },
      ]),
      { source: "/shop/:rest*", destination: "/ure", permanent: true },
      // Adresser fra den første udgave af den nye side
      { source: "/ure/:brand/:model", destination: "/ur/:brand-:model", permanent: true },
      { source: "/ure/:brand", destination: "/maerker/:brand", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
