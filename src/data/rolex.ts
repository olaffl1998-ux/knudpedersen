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

/**
 * Rolex-billeder fra Knud Pedersens nuværende Rolex-sektion (Rolex Brand Centre-materiale, bruges uændret).
 * De ligger i dag på den gamle webshops billedserver og skal kopieres til det nye site før lancering.
 */
const R = "https://shop16933.sfstatic.io/upload_dir/pics/Rolex/";
const KE = R + "v7images/discover-rolex-page-assets/discover-rolex-page-assets-landscape/keep-exploring-landscape/";
const DP = R + "v72026/discover-rolex-page/discover-rolex-page-assets/";
export const rolexAssets = {
  plaque: R + "Rolex-retailer-plaque-120x60_da.jpg",
  crown: R + "v7images/rolex-global-cta-assets/png-buttons/crown-gold.png",
  slides: [
    { title: "En hyldest til følelserne", eyebrow: "Rolex", href: "/rolex/ure/oyster-perpetual", alt: "Rolex Oyster Perpetual",
      desktop: R + "v72026/banner/12_december/rolex/m126000-0016_2610uf_003_14492x6166px_desktop_1492x500-2.avif",
      mobile: R + "v72026/banner/12_december/rolex/m126000-0016_2610uf_003_14492x6166px_mobile_390x525-2.avif" },
    { title: "Historien om Oyster", eyebrow: "Udvalg", href: "/rolex/oyster-story", alt: "Historien om Oyster",
      desktop: R + "v72026/banner/oyster_story/rolex/M126233-0015_First_Oyster_octagonal_1926_2604_0001_V3_eciRGB_1492x500.avif",
      mobile: R + "v72026/banner/oyster_story/rolex/M126233-0015_First_Oyster_octagonal_1926_2604_0001_V3_eciRGB_390x525.avif" },
    { title: "Rolex-accessories", eyebrow: "Udvalg", href: "/rolex/accessories", alt: "Rolex-accessories",
      desktop: R + "v72026/banner/02-a_februar/rolex/drp-cufflinks_A1018_BOM_OR18-BanGen-14492_6166-02D22_1492x500-2.avif",
      mobile: R + "v72026/banner/02-a_februar/rolex/drp-cufflinks_A1018_BOM_OR18-BanGen-14492_6166-02D22_390x525-2.avif" },
    { title: "Skabelsen af den højeste standard", eyebrow: "Rolex og urmageri", href: "/rolex/urmageri", alt: "Rolex og urmageri",
      desktop: R + "sliders/corners-rolex-watchmaking-cover_2023-watchmaking-features-manifesto-still_digital_master_rgb.avif",
      mobile: R + "sliders/corners-rolex-watchmaking-cover_2023-watchmaking-features-manifesto-still_digital_master_rgb-portrait.avif" },
  ],
  tiles: {
    watches: DP + "discover-rolex-page-assets-landscape/discover-rolex-watches-m126333_0010_1802jva_002-landscape.jpg.avif",
    accessories: DP + "discover-rolex-page-assets-landscape/discover-rolex-accessories-rolexcufflinks_2403jva_001-landscape.avif",
    contact: DP + "discover-rolex-page-assets-landscape/discover-rolex-message-elmt_2603fg_041landscape.avif",
    oysterStory: R + "v72026/rolex-keep/discover-rolex-oyster-story-m126233-0015_first_oyster_octagonal_1926_2604_0001-landscape.avif",
    watchmaking: R + "v7images/discover-rolex-page-assets/discover-rolex-page-assets-landscape/discover-rolex-watchmaking-b460356_rolex_mp_olv_watchmaking_manifesto_d_9x16_en-gb_75_25p_pp002.avif",
    servicing: R + "v7images/discover-rolex-page-assets/discover-rolex-page-assets-landscape/discover-rolex-servicing-2-sav1910dh_005c.avif",
  },
  /** Billeder til "Fortsæt med at udforske" pr. side */
  keepExploring: {
    "/rolex": KE + "rolex-keep-exploring-discover-rolex-shoot_shop_geneva_retail_campaign_logo_pub-2-iso_01-landscape.jpg",
    "/rolex/ure": KE + "rolex-keep-exploring-rolex-watches-1945_oyster_perpetual_datejust_1802jva_m126333_0010_1802jva_002-landscape.jpg",
    "/rolex/nye-ure-2026": R + "v72026/new-watches-2026/keep-exploring-new-watches-2026.jpg",
    "/rolex/accessories": R + "accessories/rolex-accessories-cover-rolexcufflinks_2403jva_001-portrait.jpg",
    "/rolex/urmageri": KE + "rolex-keep-exploring-watchmaking-2023_watchmaking_features_manifesto_still_digital_master_rgb-landscape.jpg",
    "/rolex/servicing": KE + "rolex-keep-exploring-servicing-2234_rolex-sav_retailers_176_controle-final_mise_heure_v2-landscape.jpg",
    "/rolex/oyster-story": R + "v72026/rolex-keep/rolex-keep-exploring-discover-rolex-oyster-story-m126233-0015_first_oyster_octagonal_1926_2604_0001-landscape.jpg",
    "/rolex/kontakt": KE + "rolex-keep-exploring-contact-us-A7404109-landscape.jpg",
  } as Record<string, string>,
};

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
