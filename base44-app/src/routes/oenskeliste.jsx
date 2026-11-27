import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/oenskeliste/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/oenskeliste")({
  loader: async () => {
    const mod = await import("@/views/oenskeliste/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
