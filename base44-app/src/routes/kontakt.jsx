import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/kontakt/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/kontakt")({
  loader: async () => {
    const mod = await import("@/views/kontakt/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
