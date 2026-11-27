import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/sammenlign/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/sammenlign")({
  loader: async () => {
    const mod = await import("@/views/sammenlign/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
