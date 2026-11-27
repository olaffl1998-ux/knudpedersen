import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/en/jewellery/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/en/jewellery")({
  loader: async () => {
    const mod = await import("@/views/en/jewellery/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
