/**
 * Rolex-sektionen.
 *
 * Alt indhold her (tekster, billeder, modeldata og priser) SKAL komme fra Rolex Brand Centre
 * og bruges uændret. Vi skriver ikke selv Rolex-tekster. Felterne nedenfor svarer til Rolex'
 * "Technical Specifications"-fil, så filen kan importeres direkte (se scripts i README).
 *
 * Struktur og danske URL'er følger den danske Rolex-pakke, som også bruges af andre
 * officielle forhandlere i Danmark (fx /rolex/ure, /rolex/nye-ure-2026, /rolex/urmageri).
 * Endelig struktur bekræftes af Knud Pedersens Rolex Digital Officer.
 */

export const RETAILER = { name: "Knud Pedersen", city: "Aarhus" };

/** Rolex' menu i den rækkefølge, Rolex' guide kræver */
export const rolexNav = [
  { href: "/rolex", label: "Udforsk Rolex" },
  { href: "/rolex/ure", label: "Rolex-ure" },
  { href: "/rolex/nye-ure-2026", label: "Nye ure 2026" },
  { href: "/rolex/accessories", label: "Rolex-accessories" },
  { href: "/rolex/urmageri", label: "Urmageri" },
  { href: "/rolex/servicing", label: "Serviceeftersyn" },
  { href: "/rolex/serviceprocedure", label: "Serviceprocedure" },
  { href: "/rolex/oyster-story", label: "Oyster Story" },
  { href: "/rolex/knud-pedersen", label: "Rolex hos Knud Pedersen" },
  { href: "/rolex/kontakt", label: "Kontakt os" },
] as const;

export type RolexCollection = { slug: string; name: string; family: "Classic" | "Professional" | "Perpetual" };

/** De 15 kollektioner fra Rolex' guide (2024–2025-kataloget). Opdateres fra Brand Centre. */
export const rolexCollections: RolexCollection[] = [
  { slug: "day-date", name: "Day-Date", family: "Classic" },
  { slug: "datejust", name: "Datejust", family: "Classic" },
  { slug: "lady-datejust", name: "Lady-Datejust", family: "Classic" },
  { slug: "land-dweller", name: "Land-Dweller", family: "Classic" },
  { slug: "sky-dweller", name: "Sky-Dweller", family: "Classic" },
  { slug: "oyster-perpetual", name: "Oyster Perpetual", family: "Classic" },
  { slug: "air-king", name: "Air-King", family: "Professional" },
  { slug: "gmt-master-ii", name: "GMT-Master II", family: "Professional" },
  { slug: "sea-dweller", name: "Sea-Dweller", family: "Professional" },
  { slug: "submariner", name: "Submariner", family: "Professional" },
  { slug: "cosmograph-daytona", name: "Cosmograph Daytona", family: "Professional" },
  { slug: "yacht-master", name: "Yacht-Master", family: "Professional" },
  { slug: "explorer", name: "Explorer", family: "Professional" },
  { slug: "deepsea", name: "Deepsea", family: "Professional" },
  { slug: "1908", name: "1908", family: "Perpetual" },
];

/** En række fra Rolex' Technical Specifications-fil (felterne udfyldes ved import) */
export type RolexModel = {
  rmc: string; // Rolex Master Code, fx M126613LB-0002
  collection: string; // slug
  modelName: string;
  caseDescription: string; // fx "Oyster, 41 mm, Oystersteel og gult guld"
  /** Rolex' maksimale vejledende udsalgspris i DKK. Vises kun for besøgende i Danmark. */
  priceDkk?: number;
  ranking: number;
  specs: Record<string, string>;
  images: string[]; // stier til billeder fra Brand Centre
};

/** Tom indtil Rolex' datafil er importeret. Siden viser pladsholdere imens. */
export const rolexModels: RolexModel[] = [];

export const getCollection = (slug: string) => rolexCollections.find((c) => c.slug === slug);
export const modelsInCollection = (slug: string) =>
  rolexModels.filter((m) => m.collection === slug).sort((a, b) => b.ranking - a.ranking);

/** Statiske Rolex-sider (ud over ure/kollektioner/modeller) */
export const rolexPages: Record<string, { title: string; h1: string; description: string; content: string }> = {
  "nye-ure-2026": {
    title: `Rolex nye ure 2026 | ${RETAILER.name}`,
    h1: `Rolex nye ure 2026 – ${RETAILER.name}`,
    description: `${RETAILER.name} præsenterer den nyeste kollektion af schweiziske luksusure fra Rolex.`,
    content: "Siden for årets nye ure. Rolex leverer enten en iFrame på lanceringsdagen eller billeder og tekster til at bygge siden selv.",
  },
  accessories: {
    title: `Rolex-accessories | ${RETAILER.name}`,
    h1: "Rolex-accessories",
    description: `Se Rolex-accessories hos ${RETAILER.name}, en officiel Rolex-forhandler i ${RETAILER.city}.`,
    content: "Rolex-accessories med billeder og tekster fra Rolex Brand Centre.",
  },
  urmageri: {
    title: `Rolex urmageri | ${RETAILER.name}`,
    h1: "Rolex urmageri",
    description: `Oplev Rolex' tilgang til urmageri hos ${RETAILER.name} i ${RETAILER.city}.`,
    content: "Forsidebillede, introtekst og højdepunkter om urmageri i den rækkefølge, Rolex' skabelon angiver. Ingen tilpasninger.",
  },
  servicing: {
    title: `Serviceeftersyn af din Rolex | ${RETAILER.name}`,
    h1: `Serviceeftersyn og reparation af Rolex hos ${RETAILER.name}`,
    description: `${RETAILER.name} er stolt af at være en del af Rolex' netværk af officielle forhandlere med uddannede urmagere.`,
    content: "Rolex' tekst om serviceeftersyn. Kun forhandlerens navn indsættes.",
  },
  serviceprocedure: {
    title: `Rolex serviceprocedure | ${RETAILER.name}`,
    h1: `Rolex serviceprocedure hos ${RETAILER.name}`,
    description: `Sådan foregår et Rolex-serviceeftersyn hos ${RETAILER.name}, officielt Rolex-servicecenter i ${RETAILER.city}.`,
    content: "Kun for forhandlere med Rolex-servicecenter (det har Knud Pedersen). Video, procedure-trin og billeder fra Rolex.",
  },
  "oyster-story": {
    title: `Oyster Story | ${RETAILER.name}`,
    h1: "Oyster Story",
    description: `Historien om Rolex Oyster, fortalt hos ${RETAILER.name} i ${RETAILER.city}.`,
    content: "Artikel fra Rolex Brand Centre med publiceringsdato. Artikler vises nyeste først.",
  },
  "knud-pedersen": {
    title: `Rolex i ${RETAILER.city} | ${RETAILER.name}`,
    h1: `Rolex hos ${RETAILER.name}`,
    description: `Mød ${RETAILER.name}, officiel Rolex-forhandler på Skt. Clemens Torv i ${RETAILER.city}.`,
    content: "Vores historie, vores hold og vores showroom. Teksterne skrives af Knud Pedersen og godkendes af Rolex Digital Officer før udgivelse.",
  },
};
