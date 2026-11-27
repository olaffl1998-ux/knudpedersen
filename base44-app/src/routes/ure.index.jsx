import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/ure/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/ure/")({
  loader: async () => {
    const mod = await import("@/views/ure/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
