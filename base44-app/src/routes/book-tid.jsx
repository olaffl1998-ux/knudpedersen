import { createFileRoute } from "@tanstack/react-router";
import * as mod from "@/views/book-tid/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/book-tid")({
  head: () => metaHead(mod),
  component: RouteComponent,
});

function RouteComponent() {
  return <mod.default />;
}
