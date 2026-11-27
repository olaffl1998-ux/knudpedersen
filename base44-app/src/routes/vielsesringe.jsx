import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/vielsesringe/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/vielsesringe")({
  loader: async () => {
    const mod = await import("@/views/vielsesringe/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
