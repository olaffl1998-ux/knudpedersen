import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/ure/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/ure")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
