import { createFileRoute, notFound } from "@tanstack/react-router";
import * as mod from "@/views/ur/slug/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/ur/$slug")({
  loader: ({ params }) => {
    if (mod.generateMetadata && !Object.keys(mod.generateMetadata({ params }) || {}).length) throw notFound();
  },
  head: ({ params }) => metaHead(mod, params),
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return <mod.default params={params} />;
}
