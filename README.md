# knudpedersen.dk

Ny hjemmeside til Knud Pedersen, ure og smykker på Skt. Clemens Torv i Aarhus og officiel Rolex-forhandler.

Siden er en showroom-side: ingen kurv og intet køb online. Alle ure viser vejledende udsalgspris, og kunden kan ringe, skrive eller booke en tid.

## Kom i gang

```bash
npm install
cp .env.example .env.local   # udfyld værdierne
npm run dev                  # http://localhost:3000
npm run build && npm start   # produktion
```

Teknik: Next.js 15 (App Router) og TypeScript. Ingen database: indhold ligger i `src/data/`, så det senere kan flyttes til et headless CMS (fx Sanity).

## Struktur

| Sti | Indhold |
| --- | --- |
| `/` | Forside med to Rolex-bannere og butiksbanner (Rolex-krav) |
| `/ure`, `/ure/[mærke]`, `/ure/[mærke]/[model]` | Alle urmærker undtagen Rolex. Modelsiden har lænke-/rem-vælgeren og vejledende pris |
| `/smykker`, `/service`, `/om-os`, `/kontakt` | Øvrige sider. Kontakt har booking og besked |
| `/rolex/...` | Rolex-sektionen (se nedenfor) |
| `/privatlivspolitik`, `/cookiepolitik`, `/tilgaengelighed` | Udkast, skal gennemgås før lancering |

Data:

- `src/data/catalog.ts`: mærker, modeller, remme og lænker. **Modeller, priser og remme er eksempler** (`example: true`) og skal erstattes med data og billeder fra mærkernes forhandlerportaler.
- `src/data/rolex.ts`: Rolex-menu, 15 kollektioner, sidetekster og typen for Rolex' Technical Specifications-fil.

## Rolex-sektionen

Bygget efter Rolex' guide for officielle forhandlere og den danske struktur, som også bruges af andre danske Rolex-forhandlere:

- Rolex-plakette øverst til venstre på alle Rolex-sider, med link til `/rolex`.
- Rolex' menu i fast rækkefølge, "Fortsæt med at udforske" og "Tilbage til toppen" nederst.
- Ingen andre mærker i Rolex-sektionen. Lænke-vælgeren bruges ikke her.
- Rolex-uret i headeren vises, når `NEXT_PUBLIC_ROLEX_CLOCK_API_KEY` er sat.
- Rolex-priser (Rolex' maksimale vejledende udsalgspris) vises kun for besøgende i Danmark (`src/lib/geo.ts`).
- Alle tekster, billeder og modeldata skal komme fra Rolex Brand Centre og bruges uændret. Indtil da vises pladsholdere.

## Før lancering

- [ ] Rolex Digital Officer bekræfter guide-version, struktur og URL'er og godkender sektionen
- [ ] Import af Rolex' modeldata, billeder, plakette, ur-nøgle og Adobe Launch-kode
- [ ] Rigtige modeller, billeder, vejledende priser og kompatible remme fra hvert mærke
- [ ] Logo, butiksfotos og medarbejderfotos
- [ ] Tekster: mærkesider (ca. 300 ord hver), om os, service med priseksempler
- [ ] E-mail til booking: sæt `RESEND_API_KEY` og afsenderdomæne
- [ ] Juridisk gennemgang af privatlivs- og cookiepolitik, evt. certificeret CMP med Google Consent Mode v2
- [ ] Sæt `NEXT_PUBLIC_PREVIEW_BANNER=false` (fjerner banner og `noindex`)
- [ ] Peg domænet om, test 301-omdirigeringerne i `next.config.ts`, indsend sitemap i Google Search Console
