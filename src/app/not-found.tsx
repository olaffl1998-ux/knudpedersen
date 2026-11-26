import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section not-found">
      <div className="container container--narrow center">
        <span className="label">Fejl 404</span>
        <h1>Siden findes ikke</h1>
        <p className="lead">Siden kan være flyttet, da vi har fået ny hjemmeside. Søg efter det, du leder efter, eller gå til forsiden.</p>
        <form className="search-box" role="search" action="/soeg"><label htmlFor="nf-q" className="sr-only">Søg</label><input id="nf-q" name="q" type="search" placeholder="Søg efter mærke, model eller reference" /></form>
        <p className="btn-row" style={{ justifyContent: "center" }}><Link className="btn" href="/">Til forsiden</Link><Link className="btn btn--outline" href="/ure">Se ure</Link><Link className="btn btn--outline" href="/kontakt">Kontakt os</Link></p>
      </div>
    </section>
  );
}
