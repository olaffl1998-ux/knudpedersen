import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/rolex/servicing-procedure/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/servicing-procedure")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
