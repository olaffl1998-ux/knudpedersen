import { ErrorComponent, Link, rootRouteId, useMatch, useRouter } from "@tanstack/react-router";

/** Fejlside, hvis en side ikke kan indlæses */
export function DefaultCatchBoundary({ error }) {
  const router = useRouter();
  const isRoot = useMatch({ strict: false, select: (s) => s.id === rootRouteId });
  console.error(error);
  return (
    <section className="container page-head" style={{ padding: "120px 0", textAlign: "center" }}>
      <h1>Siden kunne ikke indlæses</h1>
      <p className="lead">Prøv igen, eller ring til os på 86 12 17 99.</p>
      <p style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button className="btn" type="button" onClick={() => router.invalidate()}>Prøv igen</button>
        {isRoot ? <Link className="btn btn--ghost" to="/">Til forsiden</Link> : <a className="btn btn--ghost" href="/">Til forsiden</a>}
      </p>
      {import.meta.env.DEV && <ErrorComponent error={error} />}
    </section>
  );
}
