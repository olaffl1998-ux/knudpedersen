import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/rolex-certified-pre-owned/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex-certified-pre-owned")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
