import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/service/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/service")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
