import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/rolex/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/")({
  loader: async () => {
    const mod = await import("@/views/rolex/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
