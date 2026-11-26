import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/vielsesringe/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/vielsesringe")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
