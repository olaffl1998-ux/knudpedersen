import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/")({
  loader: async () => {
    const mod = await import("@/views/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
