import Editorial from "@/components/rolex/Editorial";
import { RETAILER, rolexPageBlocks } from "@/data/rolex";
export const metadata = {
    title: { absolute: `Historien om Oyster | ${RETAILER.name}` },
    description: `Historien om Rolex Oyster: præcision, vandtæthed og selvoptræk. Fortalt hos ${RETAILER.name} i ${RETAILER.city}.`,
    alternates: { canonical: "/rolex/world-of-rolex" },
};
export default function Page() {
    return <Editorial h1={`Historien om Oyster`} blocks={rolexPageBlocks["world-of-rolex"]} crumbs={[{ name: `Rolex’ verden`, href: "/rolex/world-of-rolex" }]} current="/rolex/world-of-rolex"/>;
}
