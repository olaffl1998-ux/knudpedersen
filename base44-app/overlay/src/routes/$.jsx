import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { findRedirect } from "@/lib/redirects";
import NotFoundPage from "@/views/not-found";

/** Alle ukendte adresser: gamle webshop-adresser sendes videre (301), resten får 404-siden */
export const Route = createFileRoute("/$")({
  loader: ({ location }) => {
    const to = findRedirect(location.pathname);
    if (to) throw redirect({ href: to, statusCode: 301 });
    throw notFound();
  },
  head: () => ({ meta: [{ title: "Siden findes ikke | Knud Pedersen" }, { name: "robots", content: "noindex" }] }),
  component: NotFoundPage,
  notFoundComponent: NotFoundPage,
});
