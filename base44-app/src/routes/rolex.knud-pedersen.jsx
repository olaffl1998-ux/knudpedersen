import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/rolex/knud-pedersen/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/knud-pedersen")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
