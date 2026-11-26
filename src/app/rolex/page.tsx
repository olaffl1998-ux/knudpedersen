import type { Metadata } from "next";
import DiscoverRolex, { metadata as m } from "./discover/page";

/** /rolex viser Udforsk Rolex (kanonisk adresse er /rolex/discover) */
export const metadata: Metadata = { ...m };
export default DiscoverRolex;
