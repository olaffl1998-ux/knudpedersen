/**
 * Katalog over mærker, modeller og remme/lænker.
 *
 * VIGTIGT: Modeller, priser og remme herunder er EKSEMPLER til forhåndsvisningen.
 * Før lancering skal de erstattes med data fra hvert mærkes forhandlerportal
 * (billeder med brugsret, referencenumre, vejledende udsalgspriser og kompatible remme).
 * Rolex vises IKKE her: Rolex-modeller kommer fra Rolex Brand Centre og ligger under /rolex.
 */

export type Brand = {
  slug: string;
  name: string;
  kind: string;
  /** Rolex har sin egen sektion og må ikke blandes med andre mærker */
  rolex?: boolean;
  intro: string;
};

export type StrapType = "nato" | "rubber" | "leather" | "steel" | "bicolor";

export type Strap = {
  key: string;
  name: string;
  type: StrapType;
  color: string;
  material: string;
};

export type Model = {
  slug: string;
  brand: string;
  name: string;
  size: string;
  /** Vejledende udsalgspris i DKK for uret på den første rem/lænke i listen */
  price: number;
  /** true indtil rigtige data er hentet fra mærket */
  example: boolean;
  look: { dial: string; bezel: string; case: string };
  /** Kompatible remme og lænker; den første er standard */
  straps: string[];
  specs: Record<string, string>;
};

export const brands: Brand[] = [
  { slug: "rolex", name: "Rolex", kind: "Ure", rolex: true, intro: "" },
  { slug: "tudor", name: "Tudor", kind: "Ure", intro: "Tudor kombinerer robuste sportsure med klassisk design og egne manufakturværker. Black Bay og Pelagos er blandt de modeller, vi oftest viser frem i butikken." },
  { slug: "glashutte-original", name: "Glashütte Original", kind: "Ure", intro: "Tysk finurmageri fra Glashütte i Sachsen, hvor næsten alle dele laves i eget hus." },
  { slug: "chopard", name: "Chopard", kind: "Ure og smykker", intro: "Fra Chopard fører vi både ure og smykker i verdensklasse, fra Happy Diamonds til Alpine Eagle." },
  { slug: "breitling", name: "Breitling", kind: "Ure", intro: "Breitling er kendt for kronografer til luft, land og hav, med Navitimer som det ikoniske pilotur." },
  { slug: "omega", name: "Omega", kind: "Ure", intro: "Omega står bag Speedmaster, det første ur på Månen, og Seamaster-serien af dykkerure." },
  { slug: "grand-seiko", name: "Grand Seiko", kind: "Ure", intro: "Grand Seiko hylder den japanske spiritualitet, der er dybt inspireret af naturen og årstiderne." },
  { slug: "tag-heuer", name: "TAG Heuer", kind: "Ure", intro: "Schweiziske sportsure med rødder i motorsport, fra Carrera til Monaco." },
  { slug: "longines", name: "Longines", kind: "Ure", intro: "Longines forener tradition og elegance i ure til både hverdag og fest." },
  { slug: "baume-mercier", name: "Baume & Mercier", kind: "Ure", intro: "Klassisk schweizisk urmageri med kollektioner som Riviera og Clifton." },
  { slug: "oris", name: "Oris", kind: "Ure", intro: "Uafhængigt schweizisk mærke med mekaniske ure og fokus på bæredygtighed." },
  { slug: "doxa", name: "Doxa", kind: "Ure", intro: "Doxa har lavet professionelle dykkerure siden 1967, kendt for den orange urskive." },
  { slug: "montblanc", name: "Montblanc", kind: "Ure, penne og tilbehør", intro: "Montblanc ure, skriveredskaber og læderartikler." },
  { slug: "gucci", name: "Gucci", kind: "Ure og smykker", intro: "Gucci ure og smykker med italiensk design." },
  { slug: "ole-mathiesen", name: "Ole Mathiesen", kind: "Ure", intro: "Dansk urdesign med rene linjer siden 1845." },
];

export const jewelleryBrands = ["Marselis Jewellery", "Chopard", "Gucci", "Marc'Harit", "Georg Jensen", "Perler"];

export const straps: Record<string, Strap> = {
  "steel": { key: "steel", name: "Stållænke", type: "steel", color: "#C9CCD0", material: "Rustfrit stål" },
  "steel-gold": { key: "steel-gold", name: "Stål- og guldlænke", type: "bicolor", color: "#C9A55A", material: "Stål og 18 kt. guld" },
  "nato-black": { key: "nato-black", name: "NATO-rem, sort", type: "nato", color: "#1E1E1E", material: "Polyamid" },
  "nato-blue": { key: "nato-blue", name: "NATO-rem, blå", type: "nato", color: "#1F3A66", material: "Polyamid" },
  "nato-brown": { key: "nato-brown", name: "NATO-rem, brun", type: "nato", color: "#4A2C20", material: "Polyamid" },
  "nato-grey": { key: "nato-grey", name: "NATO-rem, grå", type: "nato", color: "#6E6E6A", material: "Polyamid" },
  "rubber-black": { key: "rubber-black", name: "Gummirem, sort", type: "rubber", color: "#191919", material: "Gummi" },
  "rubber-blue": { key: "rubber-blue", name: "Gummirem, blå", type: "rubber", color: "#1C3F78", material: "Gummi" },
  "leather-brown": { key: "leather-brown", name: "Læderrem, brun", type: "leather", color: "#6B3E22", material: "Kalveskind" },
  "leather-black": { key: "leather-black", name: "Læderrem, sort", type: "leather", color: "#1B1714", material: "Kalveskind" },
  "alligator-brown": { key: "alligator-brown", name: "Alligatorrem, mørkebrun", type: "leather", color: "#3E2416", material: "Alligator" },
};

export const models: Model[] = [
  {
    slug: "seamaster-diver-300m", brand: "omega", name: "Seamaster Diver 300M", size: "42 mm", price: 44600, example: true,
    look: { dial: "#121212", bezel: "#111111", case: "#C9CCD0" },
    straps: ["steel", "nato-black", "nato-blue", "nato-brown", "nato-grey", "rubber-black", "rubber-blue"],
    specs: { Urværk: "Automatisk, Master Chronometer", Kasse: "Rustfrit stål", Vandtæthed: "300 m", Glas: "Safirglas" },
  },
  {
    slug: "speedmaster-moonwatch-professional", brand: "omega", name: "Speedmaster Moonwatch Professional", size: "42 mm", price: 57900, example: true,
    look: { dial: "#151515", bezel: "#141414", case: "#C9CCD0" },
    straps: ["steel", "nato-black", "nato-grey", "leather-black", "leather-brown", "rubber-black"],
    specs: { Urværk: "Manuelt optræk, Master Chronometer", Kasse: "Rustfrit stål", Vandtæthed: "50 m", Glas: "Hesalit eller safir" },
  },
  {
    slug: "seamaster-aqua-terra-150m", brand: "omega", name: "Seamaster Aqua Terra 150M", size: "41 mm", price: 47300, example: true,
    look: { dial: "#2C4A73", bezel: "#C9CCD0", case: "#C9CCD0" },
    straps: ["steel", "leather-brown", "leather-black", "rubber-blue"],
    specs: { Urværk: "Automatisk, Master Chronometer", Kasse: "Rustfrit stål", Vandtæthed: "150 m", Glas: "Safirglas" },
  },
  {
    slug: "black-bay-58", brand: "tudor", name: "Black Bay 58", size: "39 mm", price: 31900, example: true,
    look: { dial: "#101010", bezel: "#13213D", case: "#C9CCD0" },
    straps: ["steel", "nato-black", "nato-blue", "leather-brown"],
    specs: { Urværk: "Automatisk, manufaktur", Kasse: "Rustfrit stål", Vandtæthed: "200 m", Glas: "Safirglas" },
  },
  {
    slug: "spirit-zulu-time", brand: "longines", name: "Spirit Zulu Time", size: "42 mm", price: 27900, example: true,
    look: { dial: "#1D1D1D", bezel: "#2B2B2B", case: "#C9CCD0" },
    straps: ["steel", "leather-brown", "nato-brown", "nato-blue"],
    specs: { Urværk: "Automatisk, GMT", Kasse: "Rustfrit stål", Vandtæthed: "100 m", Glas: "Safirglas" },
  },
  {
    slug: "carrera-chronograph", brand: "tag-heuer", name: "Carrera Chronograph", size: "42 mm", price: 49950, example: true,
    look: { dial: "#DADCDF", bezel: "#C9CCD0", case: "#C9CCD0" },
    straps: ["steel", "leather-black", "leather-brown", "alligator-brown"],
    specs: { Urværk: "Automatisk kronograf", Kasse: "Rustfrit stål", Vandtæthed: "100 m", Glas: "Safirglas" },
  },
  {
    slug: "navitimer-b01-chronograph", brand: "breitling", name: "Navitimer B01 Chronograph", size: "43 mm", price: 68900, example: true,
    look: { dial: "#1A1A1A", bezel: "#C9CCD0", case: "#C9CCD0" },
    straps: ["steel", "alligator-brown", "leather-black"],
    specs: { Urværk: "Automatisk kronograf, manufaktur", Kasse: "Rustfrit stål", Vandtæthed: "30 m", Glas: "Safirglas" },
  },
];

export const nonRolexBrands = brands.filter((b) => !b.rolex);
export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);
export const getModelsForBrand = (slug: string) => models.filter((m) => m.brand === slug);
export const getModel = (brand: string, slug: string) => models.find((m) => m.brand === brand && m.slug === slug);
export const brandHref = (b: Brand) => (b.rolex ? "/rolex/discover" : `/ure/${b.slug}`);
export const modelHref = (m: Model) => `/ure/${m.brand}/${m.slug}`;
