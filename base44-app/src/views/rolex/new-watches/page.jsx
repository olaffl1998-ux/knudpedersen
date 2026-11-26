import Editorial from "@/components/rolex/Editorial";
import { RETAILER, NEW_YEAR, rolexPageBlocks } from "@/data/rolex";
export const metadata = {
    title: { absolute: `Rolex nye ure ${NEW_YEAR} | ${RETAILER.name}` },
    description: `Se de nye Rolex-ure ${NEW_YEAR} hos ${RETAILER.name}, officiel Rolex-forhandler i ${RETAILER.city}.`,
    alternates: { canonical: "/rolex/new-watches" },
};
export default function Page() {
    return <Editorial h1={`Rolex nye ure ${NEW_YEAR}`} blocks={rolexPageBlocks["new-watches"]} crumbs={[{ name: `Nye ure ${NEW_YEAR}`, href: "/rolex/new-watches" }]} current="/rolex/new-watches"/>;
}
