import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/rolex/servicing/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/servicing")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
