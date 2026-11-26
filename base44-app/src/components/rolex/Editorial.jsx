import { Blocks, RImg, RolexPage } from "./parts";
/** Redaktionel Rolex-side: forsidebillede, H1 og Rolex' blokke i leveret rækkefølge */
export default function Editorial({ h1, blocks, crumbs, current, after }) {
    const body = blocks.filter((b) => b.type !== "h1");
    const first = body[0]?.type === "image" ? body.shift() : null;
    return (<RolexPage crumbs={crumbs} current={current}>
      {first && <RImg img={{ l: first.landscape, p: first.portrait }} alt={first.alt?.trim() || h1} className="rx-cover" eager/>}
      <section className="rx-intro"><h1>{h1}</h1></section>
      <section className="rx-editorial"><Blocks blocks={body}/></section>
      {after}
    </RolexPage>);
}
