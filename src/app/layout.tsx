import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chrome from "@/components/en/Chrome";
import HeaderEn from "@/components/en/HeaderEn";
import FooterEn from "@/components/en/FooterEn";
import Reveal from "@/components/Reveal";
import ScrollFX from "@/components/ScrollFX";
import { ConsentProvider } from "@/components/Consent";
import { JsonLd, storeJsonLd } from "@/components/Seo";
import { SITE_URL, SHOW_PREVIEW_BANNER } from "@/lib/site";

const display = Cormorant_Garamond({ weight: ["300", "400", "500"], subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ weight: ["300", "400", "500"], subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Knud Pedersen – Ure og smykker i Aarhus | Officiel Rolex-forhandler", template: "%s | Knud Pedersen" },
  description:
    "Ur- og smykkeforretning på Skt. Clemens Torv i Aarhus. Officiel Rolex-forhandler og autoriseret forhandler af Tudor, Omega, Breitling, Chopard og flere. Book et møde eller service.",
  openGraph: { type: "website", locale: "da_DK", siteName: "Knud Pedersen" },
  robots: SHOW_PREVIEW_BANNER ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#F6F1EA" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#indhold">Gå til indhold</a>
        <ConsentProvider>
          {SHOW_PREVIEW_BANNER && (
            <div className="preview-flag">Forhåndsvisning. Ure og priser er hentet fra den nuværende webshop og skal gennemgås før lancering.</div>
          )}
          <Chrome da={<Header />} en={<HeaderEn />} />
          <main id="indhold">{children}</main>
          <Chrome da={<Footer />} en={<FooterEn />} />
          <Reveal />
          <ScrollFX />
        </ConsentProvider>
        <JsonLd data={storeJsonLd} />
      </body>
    </html>
  );
}
