import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/en/visit/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/en/visit")({
  loader: async () => {
    const mod = await import("@/views/en/visit/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
