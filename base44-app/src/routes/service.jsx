import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/service/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/service")({
  loader: async () => {
    const mod = await import("@/views/service/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
