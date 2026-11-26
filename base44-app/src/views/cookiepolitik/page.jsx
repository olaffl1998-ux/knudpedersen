import { Breadcrumbs } from "@/components/Seo";
import { CookieSettingsButton } from "@/components/Consent";
export const metadata = { title: "Cookiepolitik", alternates: { canonical: "/cookiepolitik" } };
const rows = [
    ["kp-consent-v1", "Nødvendig", "Husker dit cookievalg (gemmes i din browser)", "Til du sletter det"],
    ["Rolex-ur (static.rolex.com)", "Nødvendig for Rolex-indhold", "Viser Rolex-uret, som Rolex kræver. Rolex kan sætte egne cookies, fx rlx-consent", "Se Rolex' cookiepolitik"],
    ["Google Maps", "Eksternt indhold", "Viser kortet på kontaktsiden. Indlæses kun efter samtykke", "Se Googles politik"],
    ["Statistik", "Statistik", "Indlæses kun efter samtykke. Værktøj vælges før lancering", "Op til 13 måneder"],
];
export default function Cookies() {
    return (<section className="section">
      <div className="container container--narrow">
        <Breadcrumbs items={[{ name: "Cookiepolitik", href: "/cookiepolitik" }]}/>
        <div className="prose">
          <p className="tag">Udkast – opdateres med den endelige cookieliste før lancering</p>
          <h1>Cookiepolitik</h1>
          <p>Vi bruger kun nødvendige cookies, medmindre du giver samtykke til andet. Du kan til enhver tid ændre eller trække dit samtykke tilbage.</p>
          <div><CookieSettingsButton /></div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: ".9rem" }}>
              <thead><tr>{["Navn", "Kategori", "Formål", "Varighed"].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid var(--line)", padding: ".5rem" }}>{h}</th>)}</tr></thead>
              <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} style={{ borderBottom: "1px solid var(--line)", padding: ".5rem", verticalAlign: "top" }}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </section>);
}
