import { createFileRoute, notFound } from "@tanstack/react-router";
import Page from "@/views/rolex/slug/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/$slug")({
  loader: async ({ params }) => {
    const mod = await import("@/views/rolex/slug/page");
    if (mod.generateMetadata && !Object.keys(mod.generateMetadata({ params }) || {}).length) throw notFound();
    return { head: metaHead(mod, params) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return <Page params={params} />;
}
