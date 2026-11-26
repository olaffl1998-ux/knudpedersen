import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/soeg/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/soeg")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
