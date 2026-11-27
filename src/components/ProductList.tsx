"use client";

import Link from "next/link";
import { thumb } from "@/lib/site";
import { useEffect, useMemo, useState } from "react";
import type { IndexItem } from "@/lib/productIndex";
import { formatPrice } from "@/lib/site";
import { HeartButton, useWishlist } from "./Wishlist";

function Card({ it }: { it: IndexItem }) {
  const label = `${it.brand} ${it.name}`;
  return (
    <article className="card">
      <div className="card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {it.image ? <img src={thumb(it.image)} alt={it.ref ? `${label}, reference ${it.ref}` : label} loading="eager" decoding="async" /> : <div className="ph" aria-hidden="true">[Produktbillede]</div>}
        <HeartButton id={it.id} label={label} />
      </div>
      <div className="card__body">
        <span className="card__brand">{it.brand}</span>
        <Link className="card__name" href={it.href}>{it.name}</Link>
        {it.ref && <span className="card__meta">{it.ref}</span>}
        <span className="card__price">{it.price ? <><small>Vejl. pris</small>{formatPrice(it.price)}</> : "Pris på forespørgsel"}</span>
      </div>
    </article>
  );
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Søgning i ure og smykker (Rolex søges ikke her, Rolex har sin egen sektion) */
export function SearchClient({ items }: { items: IndexItem[] }) {
  const [q, setQ] = useState("");
  const [n, setN] = useState(24);
  useEffect(() => { setQ(new URLSearchParams(window.location.search).get("q") || ""); }, []);
  const hits = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return items.filter((it) => { const hay = norm(`${it.brand} ${it.name} ${it.ref} ${it.kind}`); return words.every((w) => hay.includes(w)); });
  }, [q, items]);
  const update = (v: string) => {
    setQ(v); setN(24);
    const u = new URL(window.location.href);
    if (v) u.searchParams.set("q", v); else u.searchParams.delete("q");
    window.history.replaceState(null, "", u);
  };
  return (
    <>
      <form className="search-box" role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="q" className="sr-only">Søg efter ure og smykker</label>
        <input id="q" type="search" value={q} onChange={(e) => update(e.target.value)} placeholder="Søg efter mærke, model eller reference" autoFocus autoComplete="off" />
      </form>
      <p className="muted" role="status" aria-live="polite">{q ? `${hits.length} resultat${hits.length === 1 ? "" : "er"} for "${q}"` : "Skriv for at søge blandt ure og smykker."}</p>
      {hits.length > 0 && <div className="cards">{hits.slice(0, n).map((it) => <Card key={it.id} it={it} />)}</div>}
      {hits.length > n && <p className="center"><button className="btn btn--outline" type="button" onClick={() => setN(n + 24)}>Vis flere</button></p>}
      {q && !hits.length && <div className="empty"><p>Ingen resultater. Prøv et andet ord, eller <Link href="/kontakt">kontakt os</Link>, så hjælper vi dig.</p></div>}
    </>
  );
}

const SHARE_KEY = "liste";
const shareUrl = (ids: string[]) => `${window.location.origin}/oenskeliste?${SHARE_KEY}=${encodeURIComponent(ids.join("|"))}`;

function ShareBar({ ids, names }: { ids: string[]; names: string }) {
  const [msg, setMsg] = useState("");
  const share = async () => {
    const url = shareUrl(ids);
    const text = "Min ønskeliste hos Knud Pedersen";
    try {
      if (navigator.share) { await navigator.share({ title: text, text, url }); return; }
      await navigator.clipboard.writeText(url); setMsg("Linket er kopieret. Sæt det ind i en besked.");
    } catch { /* brugeren lukkede delingen */ }
  };
  const mail = () => {
    const url = shareUrl(ids);
    window.location.href = `mailto:?subject=${encodeURIComponent("Min ønskeliste hos Knud Pedersen")}&body=${encodeURIComponent(`Hej\n\nHer er min ønskeliste fra Knud Pedersen på Skt. Clemens Torv i Aarhus:\n${names}\n\nSe den her: ${url}\n`)}`;
  };
  return (
    <div className="wish-share">
      <div><strong>Del din ønskeliste</strong><span>Send listen til kæresten, familien eller vennerne. De kan se den uden at oprette noget.</span></div>
      <div className="wish-share__btns">
        <button type="button" className="btn" onClick={share}>Del link</button>
        <button type="button" className="btn btn--outline" onClick={mail}>Send på mail</button>
      </div>
      {msg && <p className="muted" role="status">{msg}</p>}
    </div>
  );
}

/** Ønskelisten: viser de gemte produkter fra browseren, eller en liste nogen har delt */
export function WishlistClient({ items }: { items: IndexItem[] }) {
  const { ids, toggle } = useWishlist();
  const [shared, setShared] = useState<string[] | null>(null);
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get(SHARE_KEY);
    if (v) setShared(v.split("|").filter(Boolean));
  }, []);
  const find = (list: string[]) => list.map((id) => items.find((x) => x.id === id)).filter(Boolean) as IndexItem[];

  if (shared) {
    const got = find(shared);
    const missing = got.filter((g) => !ids.includes(g.id));
    return (
      <>
        <div className="wish-shared"><span className="label">Delt med dig</span><p>Nogen har sendt dig sin ønskeliste med {got.length} {got.length === 1 ? "favorit" : "favoritter"}. Kom forbi butikken, så viser vi dem gerne frem.</p></div>
        {got.length ? <div className="cards">{got.map((it) => <Card key={it.id} it={it} />)}</div> : <div className="empty"><p>Listen er tom, eller varerne findes ikke længere.</p></div>}
        <p className="btn-row" style={{ marginTop: 48 }}>
          {missing.length > 0 && <button type="button" className="btn btn--outline" onClick={() => missing.forEach((m) => toggle(m.id))}>Gem dem på min egen ønskeliste</button>}
          <Link className="btn" href="/book-tid">Book tid i butikken</Link>
          <button type="button" className="btn btn--outline" onClick={() => { window.history.replaceState(null, "", "/oenskeliste"); setShared(null); }}>Se min egen liste</button>
        </p>
      </>
    );
  }

  const saved = find(ids);
  if (!saved.length) return <div className="empty"><p>Din ønskeliste er tom. Tryk på hjertet ved et ur eller smykke for at gemme det her.</p><p className="btn-row"><Link className="btn" href="/ure">Se ure</Link><Link className="btn btn--outline" href="/smykker">Se smykker</Link></p></div>;
  const subject = saved.map((s) => `${s.brand} ${s.name}${s.ref ? ` (${s.ref})` : ""}`).join(", ");
  return (
    <>
      <ShareBar ids={saved.map((s) => s.id)} names={saved.map((s) => `- ${s.brand} ${s.name}`).join("\n")} />
      <p className="muted">{saved.length} gemt{saved.length === 1 ? "" : "e"}. Listen gemmes i denne browser.</p>
      <div className="cards">{saved.map((it) => <Card key={it.id} it={it} />)}</div>
      <p className="btn-row" style={{ marginTop: 48 }}><Link className="btn" href={`/book-tid?emne=${encodeURIComponent(subject.slice(0, 300))}`}>Book tid og se dem i butikken</Link></p>
    </>
  );
}
