import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/cookiepolitik/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/cookiepolitik")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
