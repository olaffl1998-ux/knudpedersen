import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Seo";
import BrandShowcase from "@/components/BrandShowcase";
import { brandIndex, featuredBrands, gridBrands } from "@/data/brandIndex";

export const metadata: Metadata = {
  title: "Mærker – ure og smykker hos Knud Pedersen i Aarhus",
  description: "Knud Pedersen er officiel Rolex- og Tudor-forhandler og autoriseret forhandler af Omega, Breitling, Grand Seiko, TAG Heuer, Longines, Georg Jensen og flere mærker.",
  alternates: { canonical: "/maerker" },
};

export default function Brands() {
  return (
    <>
      <div className="container"><Breadcrumbs items={[{ name: "Mærker", href: "/maerker" }]} /></div>
      <BrandShowcase featured={featuredBrands} grid={gridBrands} total={brandIndex.length} />
    </>
  );
}
