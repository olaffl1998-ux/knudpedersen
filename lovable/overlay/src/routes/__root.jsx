import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ScrollFX from "@/components/ScrollFX";
import { ConsentProvider } from "@/components/Consent";
import { JsonLd, storeJsonLd } from "@/components/Seo";
import NotFoundPage from "@/views/not-found";
import { SHOW_PREVIEW_BANNER } from "@/lib/site";
import globalsCss from "@/styles/globals.css?url";
import rolexCss from "@/styles/rolex.css?url";

const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#F6F1EA" },
      { title: "Knud Pedersen – Ure og smykker i Aarhus | Officiel Rolex-forhandler" },
      {
        name: "description",
        content: "Ur- og smykkeforretning på Skt. Clemens Torv i Aarhus. Officiel Rolex-forhandler og autoriseret forhandler af Tudor, Omega, Breitling, Chopard og flere. Book et møde eller service.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "da_DK" },
      { property: "og:site_name", content: "Knud Pedersen" },
    ],
    links: [
      { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: FONTS },
      { rel: "stylesheet", href: globalsCss },
      { rel: "stylesheet", href: rolexCss },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFoundPage />,
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <a className="skip" href="#indhold">Gå til indhold</a>
      <ConsentProvider>
        {SHOW_PREVIEW_BANNER && (
          <div className="preview-flag">Forhåndsvisning. Ure og priser er hentet fra den nuværende webshop og skal gennemgås før lancering.</div>
        )}
        <Header />
        <main id="indhold">
          <Outlet />
        </main>
        <Footer />
        <Reveal />
        <ScrollFX />
      </ConsentProvider>
      <JsonLd data={storeJsonLd} />
    </QueryClientProvider>
  );
}

function RootDocument({ children }) {
  return (
    <html lang="da">
      <head>
        <HeadContent />
      </head>
      <body data-react-root="true">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
