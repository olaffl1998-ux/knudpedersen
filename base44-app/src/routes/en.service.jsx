import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/en/service/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/en/service")({
  loader: async () => {
    const mod = await import("@/views/en/service/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
