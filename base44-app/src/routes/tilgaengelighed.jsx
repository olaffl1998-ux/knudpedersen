import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/tilgaengelighed/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/tilgaengelighed")({
  loader: async () => {
    const mod = await import("@/views/tilgaengelighed/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
