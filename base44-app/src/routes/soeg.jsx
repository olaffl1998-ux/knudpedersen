import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/soeg/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/soeg")({
  loader: async () => {
    const mod = await import("@/views/soeg/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
