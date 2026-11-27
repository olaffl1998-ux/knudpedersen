/**
 * Tudor-siden (/maerker/tudor). Alt billed- og videomateriale er officielt Tudor-materiale.
 * Videoerne ligger i public/video/tudor: originalen fra Tudor (AV1) og en H.264-udgave til browsere uden AV1 (fx ældre iPhones).
 */
const V = (k: string) => ({ av1: `/video/tudor/${k}.mp4`, h264: `/video/tudor/${k}-h264.mp4`, mobile: `/video/tudor/${k}-m.mp4`, poster: `/video/tudor/${k}.jpg` });
export type TudorVideo = ReturnType<typeof V>;

export type TudorSlide = {
  key: string; eyebrow: string; title: string; cta: { label: string; href: string };
  video: TudorVideo;
};

export const tudorSlides: TudorSlide[] = [
  {
    key: "festive", eyebrow: "Julens udvalg 2026", title: "Glædelig jul",
    cta: { label: "Se julens udvalg", href: "#udvalgte" },
    video: V("festive"),
  },
  {
    key: "northflag", eyebrow: "Nyhed 2026", title: "Tudor Northflag",
    cta: { label: "Book en tid", href: "/book-tid?maerke=tudor" },
    video: V("northflag"),
  },
  {
    key: "utmb", eyebrow: "Partnerskab", title: "Tudor og UTMB",
    cta: { label: "Se sportsurene", href: "/maerker/tudor/pelagos" },
    video: V("utmb"),
  },
];

/** Farven bag hver kollektions kort (bag de officielle produktbilleder) */
export const tudorFamilyTone: Record<string, string> = {
  "Black Bay": "linear-gradient(160deg, #1d2430 0%, #0b0e14 100%)",
  "Black Bay Fifty-Eight": "linear-gradient(160deg, #2b2620 0%, #100d0a 100%)",
  Pelagos: "linear-gradient(160deg, #10304a 0%, #06121d 100%)",
  "1926": "linear-gradient(160deg, #e9e2d6 0%, #cfc4b2 100%)",
  Ranger: "linear-gradient(160deg, #3a3a2a 0%, #15150e 100%)",
};

export const tudorFamilyText: Record<string, string> = {
  "Black Bay": "Arven fra Tudors dykkerure",
  "Black Bay Fifty-Eight": "Proportioner fra 1958",
  Pelagos: "Bygget til dybet",
  "1926": "Klassisk og tidløs",
  Ranger: "Til eventyret",
};

/** Sportsure og klassiske ure. Sportsure vises med UTMB-videoen, klassiske med Tudors Monarch-kampagne */
export const tudorStyles = [
  { key: "sport", eyebrow: "Din urstil", title: "Sportsure", href: "/maerker/tudor/pelagos", video: tudorSlides[2].video },
  { key: "classic", eyebrow: "Din urstil", title: "Klassiske ure", href: "/maerker/tudor/1926", image: "/billeder/pics/_thumbs/tudor-monarch-computer.w2400.h880.jpg" },
] as const;

/** Banneret "Tudor gennem årtierne" */
export const tudorCentury = { eyebrow: "Et århundrede med Tudor", title: "Oplev Tudor gennem årtierne", cta: { label: "Læs mere hos Tudor", href: "https://www.tudorwatch.com/da" }, video: V("century") };
