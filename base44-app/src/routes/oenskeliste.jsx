import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/oenskeliste/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/oenskeliste")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
