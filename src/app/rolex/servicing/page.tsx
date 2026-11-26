import type { Metadata } from "next";
import Editorial from "@/components/rolex/Editorial";
import { RETAILER, rolexPageBlocks } from "@/data/rolex";

export const metadata: Metadata = {
  title: { absolute: `Serviceeftersyn af dit Rolex | ${RETAILER.name}` },
  description: `${RETAILER.name} er en del af Rolex’ netværk af officielle forhandlere med Rolex-oplærte urmagere. Læs om serviceeftersyn af dit Rolex.`,
  alternates: { canonical: "/rolex/servicing" },
};

export default function Page() {
  return <Editorial h1={`Rolex serviceeftersyn og reparation hos ${RETAILER.name}`} blocks={rolexPageBlocks["servicing"]} crumbs={[{ name: `Serviceeftersyn`, href: "/rolex/servicing" }]} current="/rolex/servicing" />;
}
