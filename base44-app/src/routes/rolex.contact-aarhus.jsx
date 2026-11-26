import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/rolex/contact-aarhus/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/contact-aarhus")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
