import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/smykker/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/smykker/")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
