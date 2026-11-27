import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/privatlivspolitik/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/privatlivspolitik")({
  loader: async () => {
    const mod = await import("@/views/privatlivspolitik/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
