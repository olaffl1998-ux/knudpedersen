"use client";

import { useEffect, useMemo, useState } from "react";
import ModelCard from "./ModelCard";
import type { Model } from "@/data/catalog";

export type Item = { m: Model; brandName: string; gender: string; size: string | null; material: string; movement: string; band: string; order: number };
type Facet = "maerke" | "koen" | "materiale" | "stoerrelse" | "urvaerk" | "pris";
const FACETS: { key: Facet; label: string; get: (i: Item) => string | null }[] = [
  { key: "maerke", label: "Mærke", get: (i) => i.brandName },
  { key: "koen", label: "Køn", get: (i) => i.gender },
  { key: "materiale", label: "Materiale", get: (i) => i.material || null },
  { key: "stoerrelse", label: "Størrelse", get: (i) => i.size },
  { key: "urvaerk", label: "Urværk", get: (i) => i.movement || null },
  { key: "pris", label: "Pris", get: (i) => i.band },
];
const SORTS = [
  { key: "anbefalet", label: "Anbefalet" },
  { key: "nyeste", label: "Nyeste" },
  { key: "pris-stigende", label: "Pris, lav til høj" },
  { key: "pris-faldende", label: "Pris, høj til lav" },
];
const slug = (s: string) => s.toLowerCase().replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa").replace(/[^a-z0-9]+/g, "-");
const PAGE = 24;

export default function Catalog({ items, bandOrder }: { items: Item[]; bandOrder: string[] }) {
  const [sel, setSel] = useState<Record<Facet, string[]>>({ maerke: [], koen: [], materiale: [], stoerrelse: [], urvaerk: [], pris: [] });
  const [sort, setSort] = useState("anbefalet");
  const [n, setN] = useState(PAGE);
  const [open, setOpen] = useState(false);

  // Læs filtre fra adressen (fx /ure?koen=dame&maerke=omega)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const next = { ...sel };
    for (const f of FACETS) {
      const vals = q.get(f.key)?.split(",") ?? [];
      const all = Array.from(new Set(items.map(f.get).filter(Boolean))) as string[];
      next[f.key] = all.filter((v) => vals.includes(slug(v)));
    }
    setSel(next);
    if (q.get("sortering")) setSort(q.get("sortering")!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const q = new URLSearchParams();
    for (const f of FACETS) if (sel[f.key].length) q.set(f.key, sel[f.key].map(slug).join(","));
    if (sort !== "anbefalet") q.set("sortering", sort);
    const s = q.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
    setN(PAGE);
  }, [sel, sort]);

  const match = (i: Item, skip?: Facet) => FACETS.every((f) => f.key === skip || !sel[f.key].length || sel[f.key].includes(f.get(i) ?? ""));
  const list = useMemo(() => {
    const l = items.filter((i) => match(i));
    if (sort === "pris-stigende") l.sort((a, b) => a.m.price - b.m.price);
    if (sort === "pris-faldende") l.sort((a, b) => b.m.price - a.m.price);
    if (sort === "nyeste") l.sort((a, b) => (b.m.oldId ?? 0) - (a.m.oldId ?? 0));
    return l;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, sel, sort]);

  const toggle = (f: Facet, v: string) => setSel((s) => ({ ...s, [f]: s[f].includes(v) ? s[f].filter((x) => x !== v) : [...s[f], v] }));
  const active = FACETS.flatMap((f) => sel[f.key].map((v) => ({ f: f.key, v })));

  return (
    <div className="catalog">
      <aside className={`filters${open ? " is-open" : ""}`} aria-label="Filtre">
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <h2 className="label" style={{ margin: 0 }}>Filtrér</h2>
          {open && <button type="button" className="btn btn--sm" onClick={() => setOpen(false)}>Vis {list.length} ure</button>}
        </div>
        {FACETS.map((f) => {
          let values = Array.from(new Set(items.map(f.get).filter(Boolean))) as string[];
          values = f.key === "pris" ? bandOrder.filter((b) => values.includes(b)) : values.sort((a, b) => a.localeCompare(b, "da"));
          return (
            <details key={f.key} open={f.key === "maerke" || f.key === "koen" || sel[f.key].length > 0}>
              <summary>{f.label}</summary>
              {values.map((v) => {
                const c = items.filter((i) => match(i, f.key) && f.get(i) === v).length;
                return (
                  <label key={v}>
                    <input type="checkbox" checked={sel[f.key].includes(v)} onChange={() => toggle(f.key, v)} disabled={!c && !sel[f.key].includes(v)} />
                    {v}<span className="count">{c}</span>
                  </label>
                );
              })}
            </details>
          );
        })}
      </aside>
      <div>
        <div className="toolbar">
          <p className="muted" style={{ margin: 0 }} aria-live="polite">{list.length} ure</p>
          <div className="btn-row" style={{ alignItems: "center" }}>
            <button type="button" className="btn btn--outline btn--sm filter-toggle" onClick={() => setOpen(true)}>Filtrér</button>
            <label className="sr-only" htmlFor="sortering">Sortering</label>
            <select id="sortering" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        </div>
        {active.length > 0 && (
          <div className="chips" style={{ marginBottom: 32 }}>
            {active.map((a) => <button key={a.f + a.v} type="button" className="chip chip-x" onClick={() => toggle(a.f, a.v)} aria-label={`Fjern filter ${a.v}`}>{a.v}</button>)}
            <button type="button" className="linklike" onClick={() => setSel({ maerke: [], koen: [], materiale: [], stoerrelse: [], urvaerk: [], pris: [] })}>Ryd alle</button>
          </div>
        )}
        {list.length ? (
          <ul className="cards" style={{ gridTemplateColumns: undefined }}>
            {list.slice(0, n).map((i, k) => <li key={i.m.brand + i.m.slug}><ModelCard model={i.m} eager={k < 4} /></li>)}
          </ul>
        ) : (
          <div className="empty"><p>Ingen ure matcher dine filtre.</p></div>
        )}
        {n < list.length && (
          <p className="center" style={{ marginTop: 48 }}>
            <button type="button" className="btn btn--outline" onClick={() => setN(n + PAGE)}>Vis flere ure</button>
            <span className="muted" style={{ display: "block", marginTop: 12, fontSize: 14 }}>Viser {n} af {list.length}</span>
          </p>
        )}
      </div>
    </div>
  );
}
