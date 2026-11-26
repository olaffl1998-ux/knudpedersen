import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/om-os/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/om-os")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
