import type { NextConfig } from "next";
import { pieces } from "./src/data/jewellery";
import { models } from "./src/data/catalog";

/** 301-omdirigeringer fra den gamle ScanNet-side, så placeringer i Google bevares */
const shopBrand: Record<string, string> = {
  "20-rolex": "/rolex",
  "21-tudor": "/ure/tudor",
  "17-glashutte-original": "/ure/glashutte-original",
  "24-chopard-watches--jewellery": "/ure/chopard",
  "10-breitling": "/ure/breitling",
  "8-omega": "/ure/omega",
  "42-grand-seiko": "/ure/grand-seiko",
  "11-tag-heuer": "/ure/tag-heuer",
  "12-longines": "/ure/longines",
  "26-baume--mercier": "/ure/baume-mercier",
  "38-oris": "/ure/oris",
  "39-doxa": "/ure/doxa",
  "14-montblanc-ure": "/ure/montblanc",
  "15-montblanc-penne": "/ure/montblanc",
  "16-montblanc-tilbehoer": "/ure/montblanc",
  "25-gucci-watches": "/ure/gucci",
  "25-gucci": "/ure/gucci",
  "27-gucci-jewellery": "/smykker/gucci",
  "18-marselis-jewellery": "/smykker/marselis",
  "37-georg-jensen": "/smykker/georg-jensen",
};

const pages: Record<string, string> = {
  "/historie": "/om-os",
  "/kontakt1": "/kontakt",
  "/kontakt-os": "/kontakt",
  "/nyheder": "/om-os",
  "/nyheder/:slug*": "/om-os",
  "/job-hos-knud-pedersen": "/om-os#job",
  "/cookies-og-privatlivspolitik": "/cookiepolitik",
  "/persondatapolitik": "/privatlivspolitik",
  "/bestilt-tid-i-butikken": "/kontakt",
  "/bestil-tid-service": "/kontakt?emne=Service",
  "/explore-tudor": "/ure/tudor",
  "/chopard-history": "/ure/chopard",
  "/ole-mathiesen": "/ure/ole-mathiesen",
  "/marc-harit": "/smykker",
  "/rolex-kollektion-oyster-perpetual": "/rolex/ure/oyster-perpetual",
  "/oyster-story": "/rolex/oyster-story",
  "/rolex-accessories": "/rolex/accessories",
  "/shop": "/ure",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      ...Object.entries(pages).map(([source, destination]) => ({ source, destination, permanent: true })),
      // Hvert gammelt produkt (/shop/<kategori>/<id>-<varenr>/) sendes til samme ur på den nye side
      ...pieces.map((p) => ({ source: `/shop/:cat/:product(${p.oldId}-[^/]*)/:rest*`, destination: `/smykker/${p.brand}/${p.slug}`, permanent: true })),
      ...models.filter((m) => m.oldId).map((m) => ({ source: `/shop/:cat/:product(${m.oldId}-[^/]*)/:rest*`, destination: `/ure/${m.brand}/${m.slug}`, permanent: true })),
      ...Object.entries(shopBrand).flatMap(([id, destination]) => [
        { source: `/shop/${id}`, destination, permanent: true },
        { source: `/shop/${id}/:product*`, destination, permanent: true },
        { source: `/Shop/${id}`, destination, permanent: true },
      ]),
      { source: "/shop/:rest*", destination: "/ure", permanent: true },
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
