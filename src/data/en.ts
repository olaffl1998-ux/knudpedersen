/** Engelsk version af siden (til turister og udenlandske kunder). Tekster, der går igen på de engelske sider */
const T = "/billeder/pics/_thumbs/";

export const enNav = [
  { href: "/rolex/discover", label: "Rolex" },
  { href: "/en/watches", label: "Watches" },
  { href: "/en/jewellery", label: "Jewellery" },
  { href: "/en/service", label: "Service" },
  { href: "/en/about", label: "About" },
  { href: "/en/visit", label: "Visit us" },
] as const;

export const enHours = [
  { label: "Monday–Thursday", time: "10:00–17:30" },
  { label: "Friday", time: "10:00–18:00" },
  { label: "Saturday", time: "10:00–15:00" },
  { label: "Sunday", time: "Closed" },
];

/** Kort engelsk introduktion til hvert urmærke */
export const enWatchBrands: { slug: string; name: string; text: string }[] = [
  { slug: "tudor", name: "Tudor", text: "Robust sports watches with classic design and in-house manufacture movements, from Black Bay to Pelagos." },
  { slug: "glashutte-original", name: "Glashütte Original", text: "Fine German watchmaking from Glashütte in Saxony, where almost every part is made in-house." },
  { slug: "chopard", name: "Chopard", text: "Watches and jewellery of the highest order, from Happy Diamonds to Alpine Eagle." },
  { slug: "breitling", name: "Breitling", text: "Chronographs for air, land and sea, with the Navitimer as the iconic pilot's watch." },
  { slug: "omega", name: "Omega", text: "The maker of the Speedmaster, the first watch on the Moon, and the Seamaster diver's watches." },
  { slug: "grand-seiko", name: "Grand Seiko", text: "Japanese watchmaking inspired by nature and the seasons, finished by hand." },
  { slug: "tag-heuer", name: "TAG Heuer", text: "Swiss sports watches with roots in motor racing, from Carrera to Monaco." },
  { slug: "longines", name: "Longines", text: "Tradition and elegance in watches for every day and every occasion." },
  { slug: "baume-mercier", name: "Baume & Mercier", text: "Classic Swiss watchmaking with collections such as Riviera and Clifton." },
  { slug: "oris", name: "Oris", text: "Independent Swiss watchmaker of mechanical watches with a focus on sustainability." },
  { slug: "doxa", name: "Doxa", text: "Professional dive watches since 1967, famous for the orange dial." },
  { slug: "montblanc", name: "Montblanc", text: "Watches, writing instruments and leather goods." },
  { slug: "gucci", name: "Gucci", text: "Watches and jewellery in the unmistakable Gucci style." },
  { slug: "ole-mathiesen", name: "Ole Mathiesen", text: "Danish design with clean lines." },
];

export const enJewellery = [
  { href: "/smykker/marselis", name: "Marselis Jewellery", line: "Diamonds in 18 carat gold", text: "Certified diamonds in 18 carat gold: Eternity, Flower, Rainbow Sapphire and tennis bracelets.", img: `${T}0641-0554-4-Marselis--banner_mobile.w640.h640.jpg` },
  { href: "/smykker/georg-jensen", name: "Georg Jensen", line: "Danish design since 1904", text: "Danish silver and goldsmithing since 1904: Mercy, Offspring, Moonlight Grapes, Reflect, Fusion and Torun.", img: `${T}GJ_AW26_JW_Seasonal-_WS-eCom-banner_640x640px.w640.h640.jpg` },
  { href: "/smykker/chopard", name: "Chopard", line: "Happy Diamonds", text: "Happy Diamonds, Happy Hearts and Ice Cube: jewellery with freely moving diamonds and ethical gold.", img: "/brands/chopard/happy-poster.jpg" },
  { href: "/smykker/gucci", name: "Gucci", line: "Interlocking G", text: "Jewellery in 18 carat gold: Interlocking G, Horsebit, Link to Love and Icon.", img: `${T}Gucci_GUCCI_INTERLOCKING_BANGLE_640x640.w640.h640.jpg` },
];

export const enJewelleryTypes = [
  { href: "/smykker/ringe", label: "Rings" },
  { href: "/smykker/oereringe", label: "Earrings" },
  { href: "/smykker/halskaeder", label: "Necklaces" },
  { href: "/smykker/armbaand", label: "Bracelets" },
  { href: "/vielsesringe", label: "Wedding rings" },
];

/** Engelsk sti ↔ dansk sti, til sprogskifteren og hreflang */
export const enToDa: Record<string, string> = {
  "/en": "/",
  "/en/watches": "/ure",
  "/en/jewellery": "/smykker",
  "/en/service": "/service",
  "/en/about": "/om-os",
  "/en/visit": "/kontakt",
};
export const daToEn: Record<string, string> = Object.fromEntries(Object.entries(enToDa).map(([e, d]) => [d, e]));
export const enAlternates = (en: string) => ({ canonical: en, languages: { "en": en, "da": enToDa[en] ?? "/" } });
export const daAlternates = (da: string) => ({ canonical: da, languages: { "da": da, "en": daToEn[da] ?? "/en" } });
