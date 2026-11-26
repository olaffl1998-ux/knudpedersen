import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/handelsbetingelser/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/handelsbetingelser")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
