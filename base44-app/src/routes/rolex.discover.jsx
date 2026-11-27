import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/rolex/discover/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/discover")({
  loader: async () => {
    const mod = await import("@/views/rolex/discover/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
