/**
 * Mærkesiderne (/maerker/<mærke>) i hvert mærkes egen stil, som Tudor-siden er i tudorwatch.com's stil.
 * Billeder og film er mærkernes officielle kampagnemateriale (hentet til public/brands/<mærke>/ af workflowet "Hent mærkemedier").
 * Skrifterne er Google-skrifter, der ligger tæt på mærkernes egne.
 */
import type { SiteVideo } from "@/components/tudor/TudorClient";

const B = (slug: string) => `/brands/${slug}/`;
const T = "/billeder/pics/_thumbs/";
const vid = (slug: string, k: string, poster?: string): SiteVideo => ({ h264: `${B(slug)}${k}-h.mp4`, mobile: `${B(slug)}${k}-m.mp4`, poster: poster ?? `${B(slug)}${k}-poster.jpg` });
/** Billeder og film, som ligger hos mærket selv (mærkets eget CDN) */
const OM = "https://www.omegawatches.com/media/wysiwyg/";
const LG = "https://cms.longines.com/media/";
const GO = "https://www.glashuette-original.com/app/uploads/";
const BM = "https://www.baume-et-mercier.com/content/dam/ric-import-ocp/bem/";
const ext = (src: string, poster: string): SiteVideo => ({ h264: src, mobile: src, poster });
const gf = (q: string) => `https://fonts.googleapis.com/css2?${q}&display=swap`;

export type BrandMediaBlock = {
  video?: SiteVideo; image?: string; imageMobile?: string;
  eyebrow: string; title: string; text?: string; cta?: { label: string; href: string };
};
export type BrandStyle = {
  font: string;
  /** Hvor teksten står i toppen: nederst til venstre, i midten, til venstre eller ved siden af billedet */
  heroLayout: "bl" | "c" | "l" | "split" | "below";
  hero: BrandMediaBlock;
  featuredTitle: string;
  /** Kollektionerne som store billedfliser, som en vandret række eller som skiftevis billede og tekst */
  collections: "tiles" | "rail" | "rows";
  collectionImages?: Record<string, string>;
  collectionText?: Record<string, string>;
  banner?: BrandMediaBlock & { align?: "l" | "c" | "r" };
  quote?: string;
};

export const brandStyles: Record<string, BrandStyle> = {
  breitling: {
    font: gf("family=Barlow+Condensed:wght@500;700&family=Barlow:wght@400;500"),
    heroLayout: "bl",
    hero: { video: vid("breitling", "xmas"), eyebrow: "Breitling", title: "Glædelig jul", cta: { label: "Book en tid", href: "/book-tid?maerke=breitling" } },
    featuredTitle: "Udvalgte Breitling-ure",
    collections: "tiles",
    banner: { image: B("breitling") + "navitimer.jpg", eyebrow: "Navitimer", title: "Piloturet siden 1952", text: "Navitimer med den runde skydelineal blev lavet til piloter.", align: "l" },
    quote: "Style, purpose and action",
  },
  omega: {
    font: gf("family=Jost:wght@300;400;500"),
    heroLayout: "bl",
    hero: { video: ext(OM + "video/20261005-jbxs-homekv_video-desktop.mp4", OM + "20261005-jb_spectre-home_kv-luminova-desktop.jpg"), eyebrow: "OMEGA × James Bond", title: "Seamaster Diver 300M", cta: { label: "Book en tid", href: "/book-tid?maerke=omega" } },
    featuredTitle: "Udvalgte OMEGA-ure",
    collections: "tiles",
    collectionText: { Speedmaster: "Det første ur på Månen", "Aqua Terra": "Til hverdag og hav", "Planet Ocean": "Dykkerur til de store dybder", "Seamaster 300": "Fra 1957", Constellation: "Stjernen på urskiven", "De Ville": "Klassisk elegance" },
    banner: { image: OM + "2026-sp-speedmaster38-home_kv-32420385002002-desktop.jpg", imageMobile: OM + "2026-sp-speedmaster38-home_kv-32420385002002-mobile.jpg", eyebrow: "Nyhed", title: "Speedmaster 38 mm", cta: { label: "Se Speedmaster", href: "/maerker/omega/speedmaster" }, align: "l" },
  },
  "grand-seiko": {
    font: gf("family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,500"),
    heroLayout: "c",
    hero: { image: B("grand-seiko") + "moments.jpg", imageMobile: B("grand-seiko") + "moments-m.jpg", eyebrow: "Grand Seiko", title: "The Grand Moments Project", text: "Japansk urmageri, hvor naturen og årstiderne former hver urskive.", cta: { label: "Book en tid", href: "/book-tid?maerke=grand-seiko" } },
    featuredTitle: "Udvalgte Grand Seiko-ure",
    collections: "rows",
    collectionText: { "Evolution 9": "Grand Seikos nye designsprog: bredere visere, skarpere linjer og bedre læsbarhed.", Heritage: "Linjerne fra 1960'ernes Grand Seiko, med Zaratsu-polerede flader.", Elegance: "Rolige, klassiske ure med urskiver inspireret af den japanske natur.", Sport: "Robuste ure til eventyr, med Spring Drive og Hi-Beat-værker." },
    banner: { image: B("grand-seiko") + "slgb023.jpg", imageMobile: B("grand-seiko") + "slgb023-m.jpg", eyebrow: "Spring Drive U.F.A.", title: "SLGB023", text: "Et af verdens mest præcise urværker.", align: "r" },
  },
  longines: {
    font: gf("family=Playfair+Display:wght@500;700&family=Lato:wght@400;700"),
    heroLayout: "c",
    hero: { video: ext(LG + "4187/download/SeasonsGreetings2026_video-header-d.mp4?v=1", LG + "4186/download/SeasonsGreetings2026_video-fallback-header-d.jpg?v=1&w=2560"), eyebrow: "Season's Greetings", title: "Glædelig jul fra Longines", cta: { label: "Se urene", href: "#udvalgte" } },
    featuredTitle: "Udvalgte Longines-ure",
    collections: "rail",
    collectionText: { "Master Collection": "Klassisk urmageri", HydroConquest: "Dykkerure", Heritage: "Fra arkiverne", "Longines Spirit": "Pionerånden" },
    quote: "Elegance is an attitude",
  },
  chopard: {
    font: gf("family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Jost:wght@300;400"),
    heroLayout: "c",
    hero: { video: { h264: B("chopard") + "kv-h.mp4", mobile: B("chopard") + "kv-v-m.mp4", poster: B("chopard") + "kv-poster.jpg" }, eyebrow: "Chopard", title: "Julens gaver", cta: { label: "Book en tid", href: "/book-tid?maerke=chopard" } },
    featuredTitle: "Udvalgte Chopard-ure",
    collections: "tiles",
    collectionText: { "Happy Sport": "De frie diamanter", "Mille Miglia": "Fra verdens smukkeste billøb" },
    banner: { video: vid("chopard", "happy"), eyebrow: "Happy Diamonds", title: "Happy Sport", cta: { label: "Se Happy Sport", href: "/maerker/chopard/happy-sport" }, align: "c" },
  },
  doxa: {
    font: gf("family=Montserrat:wght@500;600;800"),
    heroLayout: "l",
    hero: { video: vid("doxa", "kv"), eyebrow: "DOXA SUB", title: "Dykkerure siden 1967", cta: { label: "Book en tid", href: "/book-tid?maerke=doxa" } },
    featuredTitle: "Udvalgte DOXA-ure",
    collections: "rail",
    banner: { video: vid("doxa", "v2"), eyebrow: "Professional", title: "Orange under vandet", text: "Den orange urskive er den farve, man ser bedst i dybet.", align: "l" },
  },
  oris: {
    font: gf("family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700"),
    heroLayout: "split",
    hero: { image: B("oris") + "factory.jpg", eyebrow: "Hölstein, Schweiz", title: "Uafhængig siden 1904", text: "Oris laver mekaniske ure i Hölstein og har været uafhængig, siden firmaet blev grundlagt.", cta: { label: "Book en tid", href: "/book-tid?maerke=oris" } },
    featuredTitle: "Udvalgte Oris-ure",
    collections: "tiles",
    collectionImages: { Aquis: B("oris") + "aquis.jpg", "Big Crown": B("oris") + "big-crown.jpg", ProPilot: B("oris") + "propilot.jpg", "Divers Sixty-Five": B("oris") + "divers.jpg" },
  },
  "tag-heuer": {
    font: gf("family=Inter+Tight:wght@400;600;800"),
    heroLayout: "below",
    hero: { image: T + "2400x1100px_TAGH-DTW26-HolidaySeason_NESE_KnudPedersen.w2400.h880.jpg", imageMobile: T + "640x640px_TAGH-DTW26-HolidaySeason_NESE_KnudPedersen.w640.h640.jpg", eyebrow: "TAG Heuer", title: "Julens udvalg", cta: { label: "Se urene", href: "#udvalgte" } },
    featuredTitle: "Udvalgte TAG Heuer-ure",
    collections: "tiles",
    collectionText: { Carrera: "Født på racerbanen", Monaco: "Det firkantede ikon", Aquaracer: "Til havet", "Formula 1": "Motorsport på håndleddet" },
    quote: "Don't crack under pressure",
  },
  "baume-mercier": {
    font: gf("family=Montserrat:wght@300;400;500"),
    heroLayout: "l",
    hero: { image: BM + "e8e9/9cee/AFnGVLeUQ1CUbNSlc1-JIQ.jpeg.transform.bemfwhd.jpeg", imageMobile: BM + "606e/ee1/1lEERa9FS_qylpHPUaYfFw.jpeg.transform.bemfwmob.jpeg", eyebrow: "Siden 1830", title: "Baume & Mercier", text: "Schweiziske ure fra Vallée de Joux.", cta: { label: "Book en tid", href: "/book-tid?maerke=baume-mercier" } },
    featuredTitle: "Udvalgte Baume & Mercier-ure",
    collections: "rows",
    collectionText: { Riviera: "Den 12-kantede sportsklassiker fra 1973, med integreret lænke.", Clifton: "Klassiske ure med rødder i Baume & Merciers arkiver fra 1950'erne.", Hampton: "Det rektangulære ur, inspireret af art deco.", Classima: "Enkle, tidløse ure til hverdagen." },
  },
  gucci: {
    font: gf("family=Work+Sans:wght@400;500;600"),
    heroLayout: "below",
    hero: { image: T + "Gucci_GUCCI_INTERLOCKING_BANGLE_2400x1100.w2400.h880.jpg", imageMobile: T + "Gucci_GUCCI_INTERLOCKING_BANGLE_640x640.w640.h640.jpg", eyebrow: "Gucci", title: "Ure og smykker", cta: { label: "Se urene", href: "#udvalgte" } },
    featuredTitle: "Udvalgte Gucci-ure",
    collections: "rail",
  },
  montblanc: {
    font: gf("family=Manrope:wght@300;400;600"),
    heroLayout: "split",
    hero: { eyebrow: "Montblanc", title: "Ure fra Villeret og Le Locle", text: "Montblancs ure laves i Schweiz, hvor urmageriet i Villeret går tilbage til 1858.", cta: { label: "Book en tid", href: "/book-tid?maerke=montblanc" } },
    featuredTitle: "Udvalgte Montblanc-ure",
    collections: "tiles",
    collectionText: { "1858": "Inspireret af bjergene", TimeWalker: "Fra racerløbet", "Star Legacy": "Klassisk urmageri", Bohème: "Til hende" },
  },
  "glashutte-original": {
    font: gf("family=Fira+Sans:wght@300;400;500"),
    heroLayout: "l",
    hero: { image: GO + "2026/10/Glashuette-Original-W13616410501-Desktop.webp", eyebrow: "Glashütte Original", title: "Tysk urmageri siden 1845", cta: { label: "Book en tid", href: "/book-tid?maerke=glashutte-original" } },
    featuredTitle: "Udvalgte Glashütte Original-ure",
    collections: "rows",
    collectionImages: { "Pano Collection": GO + "2022/12/Glashuette_Original-Pano_Collection-2023-1-800x820.jpg" },
    collectionText: { "Pano Collection": "Den asymmetriske urskive, hvor timer, minutter og sekunder står hver for sig.", "Spezialist Collection": "Robuste ure til hav og eventyr.", "Vintage Collection": "Design fra 1960'erne og 70'erne.", "Ladies Collection": "Ure til hende, med Serenade og Lady Serenade." },
    quote: "Deutsche Uhrmacherkunst seit 1845",
  },
};
