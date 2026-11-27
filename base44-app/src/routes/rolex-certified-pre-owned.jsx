import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/rolex-certified-pre-owned/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex-certified-pre-owned")({
  loader: async () => {
    const mod = await import("@/views/rolex-certified-pre-owned/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
