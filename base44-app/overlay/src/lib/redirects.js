import { pieces } from "@/data/jewellery";
import { models } from "@/data/catalog";
import { rolexAccessories, rolexCollections, rolexModels } from "@/data/rolex";

/** 301-omdirigeringer fra den gamle ScanNet-webshop, så placeringer i Google bevares */
const shopBrand = {
  "20-rolex": "/rolex/discover", "21-tudor": "/maerker/tudor", "17-glashutte-original": "/maerker/glashutte-original",
  "24-chopard-watches--jewellery": "/maerker/chopard", "10-breitling": "/maerker/breitling", "8-omega": "/maerker/omega",
  "42-grand-seiko": "/maerker/grand-seiko", "11-tag-heuer": "/maerker/tag-heuer", "12-longines": "/maerker/longines",
  "26-baume--mercier": "/maerker/baume-mercier", "38-oris": "/maerker/oris", "39-doxa": "/maerker/doxa",
  "14-montblanc-ure": "/maerker/montblanc", "15-montblanc-penne": "/maerker/montblanc", "16-montblanc-tilbehoer": "/maerker/montblanc",
  "25-gucci-watches": "/maerker/gucci", "25-gucci": "/maerker/gucci", "27-gucci-jewellery": "/smykker/gucci",
  "18-marselis-jewellery": "/smykker/marselis", "37-georg-jensen": "/smykker/georg-jensen",
};

const pages = {
  "/historie": "/om-os", "/rolex-kollektion": "/rolex/watches", "/rolex-ure-kollektioner": "/rolex/watches",
  "/nye-ure-2026": "/rolex/new-watches", "/rolex-urmageri": "/rolex/watchmaking", "/servicere-dit-rolex": "/rolex/servicing",
  "/rolex-service-procedure": "/rolex/servicing-procedure", "/rolex-serviceeftersyn-priser": "/rolex/servicing-prices",
  "/rolex-send-en-besked": "/rolex/contact-aarhus#besked", "/kontakt1": "/kontakt", "/kontakt-os": "/kontakt", "/nyheder": "/om-os",
  "/job-hos-knud-pedersen": "/om-os#job", "/cookies-og-privatlivspolitik": "/cookiepolitik", "/persondatapolitik": "/privatlivspolitik",
  "/bestilt-tid-i-butikken": "/book-tid", "/bestil-tid-service": "/book-tid?formaal=service", "/explore-tudor": "/maerker/tudor",
  "/chopard-history": "/maerker/chopard", "/ole-mathiesen": "/maerker/ole-mathiesen", "/marc-harit": "/smykker",
  "/oyster-story": "/rolex/world-of-rolex", "/rolex-accessories": "/rolex/accessories", "/shop": "/ure",
  "/rolex/ure": "/rolex/watches", "/rolex/kontakt": "/rolex/contact-aarhus",
};
for (const c of rolexCollections) pages[`/rolex-kollektion-${c.slug}`] = `/rolex/${c.slug}`;
for (const m of rolexModels) pages[`/rolex-${m.slug}`] = `/rolex/${m.slug}`;
for (const a of rolexAccessories) pages[`/rolex-accessories-${a.slug}`] = `/rolex/accessories/${a.slug}`;

const byOldId = new Map();
for (const p of pieces) if (p.oldId) byOldId.set(String(p.oldId), `/smykker/${p.brand}/${p.slug}`);
for (const m of models) if (m.oldId) byOldId.set(String(m.oldId), `/ur/${m.brand}-${m.slug}`);

export function findRedirect(pathname) {
  let path = decodeURI(pathname || "/");
  if (path.length > 1) path = path.replace(/\/+$/, "");
  if (pages[path]) return pages[path];
  const shop = path.match(/^\/shop(?:\/([^/]+))?(?:\/([^/]+))?/i);
  if (shop) {
    const [, cat, product] = shop;
    const id = product?.match(/^(\d+)-/)?.[1];
    if (id && byOldId.has(id)) return byOldId.get(id);
    if (cat && shopBrand[cat.toLowerCase()]) return shopBrand[cat.toLowerCase()];
    return "/ure";
  }
  const ure = path.match(/^\/ure\/([^/]+)(?:\/([^/]+))?$/);
  if (ure) return ure[2] ? `/ur/${ure[1]}-${ure[2]}` : `/maerker/${ure[1]}`;
  return null;
}
