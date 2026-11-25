import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { rolexPages } from "@/data/rolex";

type P = { params: Promise<{ side: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(rolexPages).map((side) => ({ side }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { side } = await params;
  const p = rolexPages[side];
  if (!p) return {};
  return { title: { absolute: p.title }, description: p.description, alternates: { canonical: `/rolex/${side}` } };
}

export default async function RolexStaticPage({ params }: P) {
  const { side } = await params;
  const p = rolexPages[side];
  if (!p) notFound();
  return (
    <div className="stack-lg section">
      <div className="ph">Forsidebillede fra Rolex Brand Centre</div>
      <div className="stack measure">
        <h1>{p.h1}</h1>
        <p className="muted">{p.content}</p>
      </div>
      <div className="placeholder">Indhold fra Rolex Brand Centre indsættes her, uændret og i Rolex&apos; rækkefølge.</div>
    </div>
  );
}
