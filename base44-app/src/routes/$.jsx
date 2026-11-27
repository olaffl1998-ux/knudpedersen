import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import NotFoundPage from "@/views/not-found";

/** Alle ukendte adresser: gamle webshop-adresser sendes videre (301), resten får 404-siden */
export const Route = createFileRoute("/$")({
  // Omdirigeringstabellen hentes først her, så Rolex-kataloget og alle produkter ikke kommer med i hovedbundtet
  loader: async ({ location }) => {
    const { findRedirect } = await import("@/lib/redirects");
    const to = findRedirect(location.pathname);
    if (to) throw redirect({ href: to, statusCode: 301 });
    throw notFound();
  },
  head: () => ({ meta: [{ title: "Siden findes ikke | Knud Pedersen" }, { name: "robots", content: "noindex" }] }),
  component: NotFoundPage,
  notFoundComponent: NotFoundPage,
});
