import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/en/watches/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/en/watches")({
  loader: async () => {
    const mod = await import("@/views/en/watches/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
