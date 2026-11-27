import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/rolex/watches/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/watches")({
  loader: async () => {
    const mod = await import("@/views/rolex/watches/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
