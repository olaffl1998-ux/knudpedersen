"use client";
import Link from "@/lib/next/link";
import { thumb } from "@/lib/site";
import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/lib/site";
import { HeartButton, useWishlist } from "./Wishlist";
function Card({ it }) {
    const label = `${it.brand} ${it.name}`;
    return (<article className="card">
      <div className="card__media">
                {it.image ? <img src={thumb(it.image)} alt={it.ref ? `${label}, reference ${it.ref}` : label} loading="eager" decoding="async"/> : <div className="ph" aria-hidden="true">[Produktbillede]</div>}
        <HeartButton id={it.id} label={label}/>
      </div>
      <div className="card__body">
        <span className="card__brand">{it.brand}</span>
        <Link className="card__name" href={it.href}>{it.name}</Link>
        {it.ref && <span className="card__meta">{it.ref}</span>}
        <span className="card__price">{it.price ? <><small>Vejl. pris</small>{formatPrice(it.price)}</> : "Pris på forespørgsel"}</span>
      </div>
    </article>);
}
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
/** Søgning i ure og smykker (Rolex søges ikke her, Rolex har sin egen sektion) */
export function SearchClient({ items }) {
    const [q, setQ] = useState("");
    const [n, setN] = useState(24);
    useEffect(() => { setQ(new URLSearchParams(window.location.search).get("q") || ""); }, []);
    const hits = useMemo(() => {
        const words = norm(q).split(/\s+/).filter(Boolean);
        if (!words.length)
            return [];
        return items.filter((it) => { const hay = norm(`${it.brand} ${it.name} ${it.ref} ${it.kind}`); return words.every((w) => hay.includes(w)); });
    }, [q, items]);
    const update = (v) => {
        setQ(v);
        setN(24);
        const u = new URL(window.location.href);
        if (v)
            u.searchParams.set("q", v);
        else
            u.searchParams.delete("q");
        window.history.replaceState(null, "", u);
    };
    return (<>
      <form className="search-box" role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="q" className="sr-only">Søg efter ure og smykker</label>
        <input id="q" type="search" value={q} onChange={(e) => update(e.target.value)} placeholder="Søg efter mærke, model eller reference" autoFocus autoComplete="off"/>
      </form>
      <p className="muted" role="status" aria-live="polite">{q ? `${hits.length} resultat${hits.length === 1 ? "" : "er"} for "${q}"` : "Skriv for at søge blandt ure og smykker."}</p>
      {hits.length > 0 && <div className="cards">{hits.slice(0, n).map((it) => <Card key={it.id} it={it}/>)}</div>}
      {hits.length > n && <p className="center"><button className="btn btn--outline" type="button" onClick={() => setN(n + 24)}>Vis flere</button></p>}
      {q && !hits.length && <div className="empty"><p>Ingen resultater. Prøv et andet ord, eller <Link href="/kontakt">kontakt os</Link>, så hjælper vi dig.</p></div>}
    </>);
}
/** Ønskelisten: viser de gemte produkter fra browseren */
export function WishlistClient({ items }) {
    const { ids } = useWishlist();
    const saved = ids.map((id) => items.find((x) => x.id === id)).filter(Boolean);
    if (!saved.length)
        return <div className="empty"><p>Din ønskeliste er tom. Tryk på hjertet ved et ur eller smykke for at gemme det her.</p><p className="btn-row"><Link className="btn" href="/ure">Se ure</Link><Link className="btn btn--outline" href="/smykker">Se smykker</Link></p></div>;
    const subject = saved.map((s) => `${s.brand} ${s.name}${s.ref ? ` (${s.ref})` : ""}`).join(", ");
    return (<>
      <p className="muted">{saved.length} gemt{saved.length === 1 ? "" : "e"}. Listen gemmes kun i denne browser.</p>
      <div className="cards">{saved.map((it) => <Card key={it.id} it={it}/>)}</div>
      <p className="btn-row" style={{ marginTop: 48 }}><Link className="btn" href={`/book-tid?emne=${encodeURIComponent(subject.slice(0, 300))}`}>Book tid og se dem i butikken</Link></p>
    </>);
}
