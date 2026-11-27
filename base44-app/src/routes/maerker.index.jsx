import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/maerker/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/maerker/")({
  loader: async () => {
    const mod = await import("@/views/maerker/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
