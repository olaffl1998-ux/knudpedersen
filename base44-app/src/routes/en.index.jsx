import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/en/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/en/")({
  loader: async () => {
    const mod = await import("@/views/en/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
