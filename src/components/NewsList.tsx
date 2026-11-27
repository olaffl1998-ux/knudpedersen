"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchNews, type NewsItem } from "@/lib/news-client";
import Newsletter from "./Newsletter";

const fmtDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const today = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Copenhagen" });

export default function NewsList() {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  useEffect(() => { fetchNews().then((r) => setItems(Array.isArray(r) ? r : [])); }, []);

  if (!items) return <div className="news-grid" aria-busy="true">{[0, 1, 2].map((i) => <div key={i} className="news-card news-card--sk" />)}</div>;

  const t = today();
  const events = items.filter((i) => i.type === "Arrangement" && i.dato && i.dato >= t).sort((a, b) => a.dato!.localeCompare(b.dato!));
  const news = items.filter((i) => i.type !== "Arrangement");

  const Card = ({ it }: { it: NewsItem }) => (
    <article className={`news-card${it.billede ? "" : " news-card--plain"}`}>
      {it.billede && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={it.billede} alt="" loading="eager" decoding="async" />
      )}
      <div className="news-card__body">
        <span className="label">{it.type}</span>
        {it.dato && <time dateTime={it.dato}>{fmtDate(it.dato)}{it.tidspunkt ? `, ${it.tidspunkt}` : ""}</time>}
        <h3>{it.titel}</h3>
        {it.tekst && <p>{it.tekst}</p>}
        {it.link ? <a className="linklike" href={it.link}>Læs mere</a> : it.type === "Arrangement" && <Link className="linklike" href={`/book-tid?emne=${encodeURIComponent(it.titel)}`}>Tilmeld dig</Link>}
      </div>
    </article>
  );

  return (
    <>
      <h2 className="news-h">Kommende arrangementer</h2>
      {events.length ? <div className="news-grid">{events.map((e) => <Card key={e.id} it={e} />)}</div>
        : <div className="news-empty"><p>Der er ingen arrangementer i kalenderen lige nu. Tilmeld dig nyhedsbrevet, så hører du først om smykkeaftener, nye kollektioner og urmagerdage.</p><div className="news-empty__form"><Newsletter id="nyheder-nyhedsbrev" /></div></div>}
      {news.length > 0 && <><h2 className="news-h">Nyheder</h2><div className="news-grid">{news.map((e) => <Card key={e.id} it={e} />)}</div></>}
    </>
  );
}
