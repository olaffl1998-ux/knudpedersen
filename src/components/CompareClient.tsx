"use client";

import Link from "next/link";
import { formatPrice, thumb } from "@/lib/site";
import { useCompare } from "./Compare";

export type CmpItem = { key: string; brand: string; name: string; ref: string; price: number; image: string | null; href: string; rows: Record<string, string> };

export function CompareClient({ items }: { items: CmpItem[] }) {
  const { ids, toggle } = useCompare();
  const list = ids.map((id) => items.find((i) => i.key === id)).filter(Boolean) as CmpItem[];
  if (!list.length) return <div className="empty"><p>Du har ikke valgt nogen ure endnu. Tryk på &quot;Sammenlign&quot; ved et ur for at sætte det her.</p><p className="btn-row"><Link className="btn" href="/ure">Se alle ure</Link></p></div>;
  const rows = Object.keys(list[0].rows).filter((r) => list.some((i) => i.rows[r]));
  const differs = (r: string) => new Set(list.map((i) => i.rows[r])).size > 1;
  const subject = list.map((i) => `${i.brand} ${i.name} (${i.ref})`).join(", ");
  return (
    <>
      <div className="cmp-wrap">
        <table className="cmp" style={{ ["--n" as string]: list.length }}>
          <thead>
            <tr>
              <th scope="col"><span className="sr-only">Egenskab</span></th>
              {list.map((i) => (
                <th scope="col" key={i.key}>
                  <div className="cmp__media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {i.image && <img src={thumb(i.image)} alt={`${i.brand} ${i.name}`} loading="eager" decoding="async" />}
                    <button type="button" className="cmp__x" onClick={() => toggle(i.key)} aria-label={`Fjern ${i.brand} ${i.name}`}>×</button>
                  </div>
                  <span className="card__brand">{i.brand}</span>
                  <Link className="cmp__name" href={i.href}>{i.name}</Link>
                  <span className="card__meta">{i.ref}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="cmp__price"><th scope="row">Vejl. pris</th>{list.map((i) => <td key={i.key}>{formatPrice(i.price)}</td>)}</tr>
            {rows.map((r) => (
              <tr key={r} className={differs(r) ? "is-diff" : ""}><th scope="row">{r}</th>{list.map((i) => <td key={i.key}>{i.rows[r] || "–"}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length < 3 && <p className="muted" style={{ marginTop: 24 }}>Du kan tilføje {3 - list.length === 1 ? "ét ur" : "to ure"} mere. <Link href="/ure">Find flere ure</Link></p>}
      <p className="btn-row" style={{ marginTop: 40 }}><Link className="btn" href={`/book-tid?emne=${encodeURIComponent(subject.slice(0, 300))}`}>Book tid og prøv dem i butikken</Link></p>
    </>
  );
}
