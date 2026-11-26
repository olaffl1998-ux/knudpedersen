import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/privatlivspolitik/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/privatlivspolitik")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
