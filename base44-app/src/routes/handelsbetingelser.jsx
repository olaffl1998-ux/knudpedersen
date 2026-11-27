import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/handelsbetingelser/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/handelsbetingelser")({
  loader: async () => {
    const mod = await import("@/views/handelsbetingelser/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
