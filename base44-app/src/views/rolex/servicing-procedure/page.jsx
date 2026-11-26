import Editorial from "@/components/rolex/Editorial";
import { RETAILER, rolexPageBlocks } from "@/data/rolex";
export const metadata = {
    title: { absolute: `Rolex serviceprocedure | ${RETAILER.name}` },
    description: `Sådan foregår et Rolex-serviceeftersyn hos ${RETAILER.name}, autoriseret Rolex-servicecenter i ${RETAILER.city}.`,
    alternates: { canonical: "/rolex/servicing-procedure" },
};
export default function Page() {
    return <Editorial h1={`Serviceprocedure for Rolex-ure hos ${RETAILER.name}`} blocks={rolexPageBlocks["servicing-procedure"]} crumbs={[{ name: "Serviceeftersyn", href: "/rolex/servicing" }, { name: `Serviceprocedure`, href: "/rolex/servicing-procedure" }]} current="/rolex/servicing-procedure"/>;
}
