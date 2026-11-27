import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/rolex/world-of-rolex/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/world-of-rolex")({
  loader: async () => {
    const mod = await import("@/views/rolex/world-of-rolex/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
