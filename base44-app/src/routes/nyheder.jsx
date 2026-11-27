import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/nyheder/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/nyheder")({
  loader: async () => {
    const mod = await import("@/views/nyheder/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
