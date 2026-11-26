/**
 * Rolex-sektionen.
 *
 * Alt Rolex-indhold (tekster, billeder, modeldata, priser) er hentet fra Knud Pedersens nuværende,
 * Rolex-godkendte Rolex-sider og bruges uændret. Data ligger i ./rolex/content.json og genereres af
 * scriptet tools/gen_rolex.py ud fra de nuværende sider. Når Rolex leverer nye filer via Brand Centre,
 * opdateres content.json, og siderne følger automatisk med.
 */
import content from "./rolex/content.json";
export const RETAILER = { name: "Knud Pedersen", city: "Aarhus" };
export const NEW_YEAR = 2026;
const C = content;
export const rolexGroups = C.groups;
export const rolexCollections = C.collections;
export const rolexModels = C.models;
export const rolexAccessories = C.accessories;
export const rolexPageBlocks = C.pages;
export const servicingPrices = C.servicingPrices;
export const getCollection = (slug) => rolexCollections.find((c) => c.slug === slug);
export const getModel = (slug) => rolexModels.find((m) => m.slug === slug);
export const modelsIn = (slug) => rolexModels.filter((m) => m.collection === slug);
export const modelHref = (m) => `/rolex/${m.slug}`;
/** Pakkebillede: portræt-udgaven, ellers liggende */
export const packshot = (m) => m.top.p || m.top.l || m.gallery.find(Boolean) || "";
/** Rolex-titel: "Rolex [Model] [Materiale], [Reference]" */
export const modelTitle = (m) => `Rolex ${m.family} ${m.material}, ${m.rmc}`;
const R = "/billeder/pics/Rolex/";
const KE = R + "v7images/discover-rolex-page-assets/discover-rolex-page-assets-landscape/keep-exploring-landscape/";
export const rolexAssets = {
    plaque: R + "Rolex-retailer-plaque-120x60_da.jpg",
    crown: R + "v7images/rolex-global-cta-assets/png-buttons/crown-gold.png",
    guarantee: {
        l: R + "v72026/rolex-model-page/rolex-model-page-assets/rolex-model-page-editorial-assets-landscape/rolex-guarantee_elmt_2603fg_011-landscape.jpg",
        p: R + "v72026/rolex-model-page/rolex-model-page-assets/rolex-model-page-editorial-assets-portrait/rolex-guarantee_elmt_2603fg_011-portrait.jpg",
    },
    slides: [
        { title: "En hyldest til følelserne", eyebrow: "Oyster Perpetual", href: "/rolex/oyster-perpetual", alt: "Rolex Oyster Perpetual",
            desktop: R + "v72026/banner/12_december/rolex/m126000-0016_2610uf_003_14492x6166px_desktop_1492x500-2.avif",
            mobile: R + "v72026/banner/12_december/rolex/m126000-0016_2610uf_003_14492x6166px_mobile_390x525-2.avif" },
        { title: "Historien om Oyster", eyebrow: "Rolex' verden", href: "/rolex/world-of-rolex", alt: "Historien om Oyster",
            desktop: R + "v72026/banner/oyster_story/rolex/M126233-0015_First_Oyster_octagonal_1926_2604_0001_V3_eciRGB_1492x500.avif",
            mobile: R + "v72026/banner/oyster_story/rolex/M126233-0015_First_Oyster_octagonal_1926_2604_0001_V3_eciRGB_390x525.avif" },
        { title: "Skabelsen af den højeste standard", eyebrow: "Rolex og urmageri", href: "/rolex/watchmaking", alt: "Rolex og urmageri",
            desktop: R + "sliders/corners-rolex-watchmaking-cover_2023-watchmaking-features-manifesto-still_digital_master_rgb.avif",
            mobile: R + "sliders/corners-rolex-watchmaking-cover_2023-watchmaking-features-manifesto-still_digital_master_rgb-portrait.avif" },
    ],
};
/** Rolex' menu i den rækkefølge, Rolex' retningslinjer angiver */
export const rolexNav = [
    { href: "/rolex/discover", label: "Udforsk Rolex" },
    { href: "/rolex/watches", label: "Rolex-ure" },
    { href: "/rolex/new-watches", label: `Nye ure ${NEW_YEAR}` },
    { href: "/rolex/watchmaking", label: "Urmageri" },
    { href: "/rolex/servicing", label: "Serviceeftersyn" },
    { href: "/rolex/world-of-rolex", label: "Rolex' verden" },
    { href: "/rolex/knud-pedersen", label: `Rolex hos ${RETAILER.name}` },
    { href: "/rolex/contact-aarhus", label: "Kontakt os" },
];
/** "Fortsæt med at udforske": billede og tekst pr. side (billeder fra Rolex) */
export const keepExploring = [
    { href: "/rolex/discover", label: "Udforsk Rolex", img: KE + "rolex-keep-exploring-discover-rolex-shoot_shop_geneva_retail_campaign_logo_pub-2-iso_01-landscape.jpg" },
    { href: "/rolex/watches", label: "Rolex-ure", img: KE + "rolex-keep-exploring-rolex-watches-1945_oyster_perpetual_datejust_1802jva_m126333_0010_1802jva_002-landscape.jpg" },
    { href: "/rolex/new-watches", label: `Nye ure ${NEW_YEAR}`, img: R + "v72026/new-watches-2026/keep-exploring-new-watches-2026.jpg" },
    { href: "/rolex/accessories", label: "Rolex-accessories", img: R + "accessories/rolex-accessories-cover-rolexcufflinks_2403jva_001-portrait.jpg" },
    { href: "/rolex/watchmaking", label: "Urmageri", img: KE + "rolex-keep-exploring-watchmaking-2023_watchmaking_features_manifesto_still_digital_master_rgb-landscape.jpg" },
    { href: "/rolex/servicing", label: "Serviceeftersyn", img: KE + "rolex-keep-exploring-servicing-2234_rolex-sav_retailers_176_controle-final_mise_heure_v2-landscape.jpg" },
    { href: "/rolex/world-of-rolex", label: "Historien om Oyster", img: R + "v72026/rolex-keep/rolex-keep-exploring-discover-rolex-oyster-story-m126233-0015_first_oyster_octagonal_1926_2604_0001-landscape.jpg" },
    { href: "/rolex/contact-aarhus", label: "Kontakt os", img: KE + "rolex-keep-exploring-contact-us-A7404109-landscape.jpg" },
];
/** Faste Rolex-tekster fra modelsiderne (uændret) */
export const availabilityText = [
    "Alle Rolex-ure er samlet i hånden med den største omhu for at sikre en enestående kvalitet. Sådanne høje standarder begrænser naturligvis Rolex’ produktionskapacitet, og sommetider overgår efterspørgslen efter Rolex-ure denne kapacitet.",
    "Derfor kan visse modellers tilgængelighed være begrænset. Nye Rolex-ure sælges udelukkende af officielle Rolex-forhandlere, der modtager regelmæssige leverancer og uafhængigt administrerer allokering og salg af ure til kunder.",
    `${RETAILER.name} er stolt af, at være en del af det verdensomspændende netværk af Officielle Rolex-forhandlere og kan give yderligere information om Rolex-urenes tilgængelighed.`,
];
export const catalogueNotice = [
    "Rolex-urene nedenfor er fra det officielle katalog og repræsenterer ikke lagertilgængelighed.",
    "Kontakt os venligst, hvis du gerne vil forhøre dig om et specifikt ur.",
];
export const guaranteeTexts = [
    { title: "Rolex-garanti", text: "For at sikre det højeste niveau af præcision og pålidelighed underkaster Rolex hvert ur en bred vifte af de strengeste tests efter samling. Alle nye Rolex-ure, der er købt hos en af mærkets officielle forhandlere, leveres med fem års international garanti. Når du køber et Rolex-ur, udfylder og daterer den officielle forhandler Rolex’ garantikort, som bekræfter urets autenticitet." },
    { title: "Det grønne segl", text: "Den femårige garanti, som gælder for alle Rolex-modeller, er forbundet med det grønne segl – symbolet på dets status som Superlative Chronometer. Denne eksklusive betegnelse vidner om, at uret med succes har gennemgået en række specifikke slutkontroller udført af Rolex i mærkets egne laboratorier i henhold til dets egne kriterier, ud over den officielle COSC-certificering af dets urværk." },
    { title: "Rolex' repræsentationsæske", text: "Hvert Rolex-ur leveres i en smuk grøn præsentationsæske, som både tjener som beskytter og opbevarer af den juvel, der gemmer sig indeni. Præsentationsæsken er også er et symbol på at give – derfor er det vigtigt, hvis du køber uret som gave, at modtagerens første møde med Rolex sætter scenen for den store afsløring af æskens indhold." },
];
export const messageIntro = "Tak for din interesse for Rolex ure. Indtast venligst din besked nedenfor og vi vil glæde os til at servicere dig.";
/** Pris pr. RMC (bruges kun af prisruten, som tjekker at besøgende er i Danmark) */
export const rolexPriceFor = (rmc) => rolexModels.find((m) => m.rmc.toLowerCase() === rmc.toLowerCase())?.price ??
    rolexAccessories.find((a) => a.rmc.toLowerCase() === rmc.toLowerCase())?.price ?? null;
/** I forhåndsvisningen (statisk, uden server) sendes prisen med til siden. I drift hentes den via /api/rolex-price. */
export const previewPrice = (n) => (import.meta.env.VITE_ROLEX_PRICE_PREVIEW === "true" ? n : undefined);
