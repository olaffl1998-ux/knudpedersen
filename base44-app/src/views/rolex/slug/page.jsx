import Link from "@/lib/next/link";
import { notFound } from "@/lib/next/navigation";
import { LoadMore, RolexGallery, RolexPrice } from "@/components/rolex/client";
import { RolexMessage, RolexAppointment } from "@/components/rolex/RolexForms";
import { Blocks, RImg, RolexPage } from "@/components/rolex/parts";
import { JsonLd } from "@/components/Seo";
import { RETAILER, availabilityText, catalogueNotice, getCollection, getModel, guaranteeTexts, modelHref, modelTitle, modelsIn, packshot, previewPrice, rolexAssets, rolexCollections, rolexModels, } from "@/data/rolex";
import { SITE_URL, business } from "@/lib/site";
export const dynamicParams = false;
export function generateStaticParams() {
    return [...rolexCollections.map((c) => ({ slug: c.slug })), ...rolexModels.map((m) => ({ slug: m.slug }))];
}
export function generateMetadata({ params }) {
    const { slug } = params;
    const c = getCollection(slug);
    if (c) {
        const intro = c.blocks.find((b) => b.type === "p");
        return {
            title: { absolute: `Rolex ${c.name} ure | ${RETAILER.name}` },
            description: (intro?.text || `Se Rolex ${c.name} hos ${RETAILER.name} i ${RETAILER.city}.`).slice(0, 155),
            alternates: { canonical: `/rolex/${c.slug}` },
        };
    }
    const m = getModel(slug);
    if (!m)
        return {};
    return {
        title: { absolute: modelTitle(m) },
        description: `Oplev Rolex ${m.family} (${m.caseline}), ${m.rmc}, hos ${RETAILER.name}, officiel Rolex-forhandler i ${RETAILER.city}.`,
        alternates: { canonical: modelHref(m) },
        openGraph: { images: [packshot(m)] },
    };
}
export default function RolexSlug({ params }) {
    const { slug } = params;
    const c = getCollection(slug);
    if (c)
        return <Collection c={c}/>;
    const m = getModel(slug);
    if (!m)
        notFound();
    return <Model m={m}/>;
}
function ModelCard({ m }) {
    return (<li>
      <Link href={modelHref(m)} className="rx-model-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={packshot(m)} alt={`Rolex ${m.family}, ${m.caseline}`} loading="lazy"/>
        <span className="rx-eyebrow">Rolex</span>
        <strong>{m.family}</strong>
        <span>{m.caseline}</span>
      </Link>
    </li>);
}
function Collection({ c }) {
    const models = modelsIn(c.slug);
    const [cover, ...rest] = c.blocks.filter((b) => b.type !== "h1");
    const introIdx = rest.findIndex((b) => b.type === "p");
    const intro = rest[introIdx];
    const features = rest.filter((_, i) => i !== introIdx);
    const coverImg = cover?.type === "image" ? cover : null;
    return (<RolexPage crumbs={[{ name: "Rolex-ure", href: "/rolex/watches" }, { name: c.name, href: `/rolex/${c.slug}` }]} current={`/rolex/${c.slug}`}>
      {coverImg && <RImg img={{ l: coverImg.landscape, p: coverImg.portrait }} alt={coverImg.alt?.trim() || `Rolex ${c.name}`} className="rx-cover" eager/>}
      <section className="rx-intro">
        <h1><small>Rolex</small>{c.name}</h1>
        {intro && <p>{intro.text}</p>}
      </section>
      <section className="rx-models" aria-labelledby="modeller">
        <h2 id="modeller">Rolex {c.name}-modeller</h2>
        <p className="rx-note">{catalogueNotice[0]}</p>
        <LoadMore total={models.length}>{models.map((m) => <ModelCard key={m.slug} m={m}/>)}</LoadMore>
      </section>
      <section className="rx-editorial"><Blocks blocks={features}/></section>
    </RolexPage>);
}
function Model({ m }) {
    const c = getCollection(m.collection);
    const gallery = Array.from(new Set(m.gallery.filter(Boolean)));
    const related = modelsIn(m.collection).filter((x) => x.slug !== m.slug).slice(0, 6);
    const crumbs = [{ name: "Rolex-ure", href: "/rolex/watches" }];
    if (c)
        crumbs.push({ name: c.name, href: `/rolex/${c.slug}` });
    crumbs.push({ name: `${m.family} ${m.rmc}`, href: modelHref(m) });
    const subject = `Rolex ${m.family} ${m.rmc}`;
    return (<RolexPage crumbs={crumbs} current={modelHref(m)}>
      <section className="rx-product">
        <div className="rx-packshot">
          <RImg img={{ l: m.top.p || m.top.l, p: m.top.p || m.top.l }} alt={`Rolex ${m.family}, ${m.caseline}, ${m.rmc}`} eager/>
        </div>
        <div className="rx-product-info">
          <p className="rx-eyebrow">Rolex</p>
          <h1>{m.family}</h1>
          <p className="rx-case">{m.caseline}</p>
          <p className="rx-rmc">{m.rmc}</p>
          <RolexPrice rmc={m.rmc} preview={previewPrice(m.price)}/>
          <ul className="rx-cta-list">
            <li><a className="rx-btn" href={`tel:${business.phoneE164}`}>Ring {business.phone}</a></li>
            <li><a className="rx-btn rx-btn-ghost" href="#kontakt">Send en besked</a></li>
            <li><a className="rx-btn rx-btn-ghost" href="#kontakt">Book en tid</a></li>
            <li><Link className="rx-btn rx-btn-ghost" href="/rolex/contact-aarhus">Find os</Link></li>
          </ul>
        </div>
      </section>

      {gallery.length > 1 && <RolexGallery images={gallery} alt={`Rolex ${m.family}`}/>}

      <section className="rx-guarantee">
        <RImg img={rolexAssets.guarantee} alt="Rolex-garanti"/>
        <div>
          {guaranteeTexts.map((g, i) => (<details key={g.title} open={i === 0}>
              <summary>{g.title}</summary>
              <p>{g.text}</p>
            </details>))}
        </div>
      </section>

      <section className="rx-features" aria-label="Modellens kendetegn">
        {m.features.map((f, i) => (<article key={f.title} className={i % 2 ? "rev" : ""}>
            <RImg img={{ l: f.l, p: f.p }} alt={f.title}/>
            <div><h2>{f.title}</h2><p>{f.text}</p></div>
          </article>))}
      </section>

      <section className="rx-specs" aria-labelledby="specs">
        <h2 id="specs">Specifikationer</h2>
        <dl>{m.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        {m.brochure && <p><a className="rx-btn rx-btn-ghost" href={m.brochure} rel="noopener">Download brochure (pdf)</a></p>}
      </section>

      <section className="rx-availability">
        <h2>Lagerstatus for modellen</h2>
        {availabilityText.map((t) => <p key={t.slice(0, 24)}>{t}</p>)}
      </section>

      <section id="kontakt" className="rx-accordion" aria-labelledby="kontakt-h">
        <h2 id="kontakt-h">Kontakt os om denne model</h2>
        <details><summary>Ring til os</summary><p><a href={`tel:${business.phoneE164}`}>+45 {business.phone}</a>. Åbent mandag til torsdag 10–17.30, fredag 10–18 og lørdag 10–15.</p></details>
        <details><summary>Send en besked</summary><RolexMessage subject={subject}/></details>
        <details><summary>Book en tid</summary><RolexAppointment subject={subject}/></details>
        <details><summary>Find os</summary><p>{business.legalName}, {business.street}, {business.postalCode} {business.city}. <Link href="/rolex/contact-aarhus">Se kort og åbningstider</Link>.</p></details>
      </section>

      {related.length > 0 && (<section className="rx-models">
          <h2>Flere {c?.name}-modeller</h2>
          <ul className="rx-grid">{related.map((x) => <ModelCard key={x.slug} m={x}/>)}</ul>
        </section>)}

      <JsonLd data={{
            "@context": "https://schema.org", "@type": "Product", name: `Rolex ${m.family}`, sku: m.rmc, mpn: m.rmc,
            brand: { "@type": "Brand", name: "Rolex" }, image: `${SITE_URL}${encodeURI(packshot(m))}`, description: m.caseline,
        }}/>
    </RolexPage>);
}
