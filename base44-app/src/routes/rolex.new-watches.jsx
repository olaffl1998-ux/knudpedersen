import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/rolex/new-watches/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/new-watches")({
  loader: async () => {
    const mod = await import("@/views/rolex/new-watches/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
