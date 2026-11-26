import Editorial from "@/components/rolex/Editorial";
import { RETAILER, rolexPageBlocks } from "@/data/rolex";
export const metadata = {
    title: { absolute: `Rolex urmageri | ${RETAILER.name}` },
    description: `Oplev Rolex’ tilgang til urmageri hos ${RETAILER.name}, officiel Rolex-forhandler i ${RETAILER.city}.`,
    alternates: { canonical: "/rolex/watchmaking" },
};
export default function Page() {
    return <Editorial h1={`Rolex’ urmageri`} blocks={rolexPageBlocks["watchmaking"]} crumbs={[{ name: `Urmageri`, href: "/rolex/watchmaking" }]} current="/rolex/watchmaking"/>;
}
