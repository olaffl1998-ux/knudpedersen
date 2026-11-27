/**
 * Alle mærker samlet ét sted (bruges på siden Mærker).
 *
 * Felter: navn, kategori, antal, link, produktbillede og (kun Rolex og Tudor) hero-billede/video.
 * Antal tælles automatisk ud fra varerne, og tallet i overskriften følger listens længde.
 * Rolex og Tudor: kun officielt materiale fra mærkerne. Billederne vises uændrede (ingen beskæring, zoom eller effekter).
 */
import { brands, brandHref, getModelsForBrand } from "./catalog";
import { jewelleryBrandList, piecesFor } from "./jewellery";
import { showroomBrands } from "./brands";
import { rolexAssets } from "./rolex";
const productImage = (slug) => showroomBrands.find((b) => b.slug === slug && !b.framed)?.image
    ?? getModelsForBrand(slug).find((m) => m.image)?.image
    ?? piecesFor(slug).find((p) => p.image)?.image;
const watchBrands = brands.map((b) => {
    const watches = getModelsForBrand(b.slug).length;
    const jewels = piecesFor(b.slug).length;
    return {
        slug: b.slug,
        name: b.name,
        category: jewels && watches ? "Ure og smykker" : jewels ? "Smykker" : "Ure",
        count: watches + jewels,
        href: brandHref(b),
        image: productImage(b.slug),
    };
});
const onlyJewellery = jewelleryBrandList
    .filter((j) => !brands.some((b) => b.slug === j.slug))
    .map((j) => ({ slug: j.slug, name: j.name, category: "Smykker", count: piecesFor(j.slug).length, href: `/smykker/${j.slug}`, image: productImage(j.slug) }));
const heroes = {
    rolex: { src: rolexAssets.slides[2].mobile, width: 768, height: 1034, alt: "Rolex og urmageri", note: "Officiel Rolex-forhandler" },
    tudor: { src: "/billeder/pics/_thumbs/tudor-monarch-mobil.w640.h640.jpg", width: 640, height: 640, alt: "Tudor Monarch", note: "Officiel Tudor-forhandler" },
};
export const brandIndex = [...watchBrands, ...onlyJewellery].map((b) => heroes[b.slug] ? { ...b, hero: heroes[b.slug], note: heroes[b.slug].note } : b);
export const featuredBrands = brandIndex.filter((b) => b.hero);
export const gridBrands = brandIndex.filter((b) => !b.hero);
