import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/om-os/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/om-os")({
  loader: async () => {
    const mod = await import("@/views/om-os/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
