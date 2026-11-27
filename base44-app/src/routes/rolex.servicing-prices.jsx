import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/rolex/servicing-prices/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/servicing-prices")({
  loader: async () => {
    const mod = await import("@/views/rolex/servicing-prices/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
