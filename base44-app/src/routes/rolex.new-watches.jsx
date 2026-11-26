import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/rolex/new-watches/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/new-watches")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
