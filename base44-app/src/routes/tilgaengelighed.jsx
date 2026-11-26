import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/tilgaengelighed/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/tilgaengelighed")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
