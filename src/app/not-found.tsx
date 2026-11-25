import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap stack">
        <p className="eyebrow">Fejl 404</p>
        <h1>Siden findes ikke</h1>
        <p className="muted">Siden kan være flyttet, da vi har fået ny hjemmeside. Prøv forsiden eller kontakt os.</p>
        <div className="cta-row"><Link className="btn" href="/">Til forsiden</Link><Link className="btn ghost" href="/kontakt">Kontakt os</Link></div>
      </div>
    </section>
  );
}
