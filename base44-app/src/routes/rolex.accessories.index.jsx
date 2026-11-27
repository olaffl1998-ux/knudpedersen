import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/rolex/accessories/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/accessories/")({
  loader: async () => {
    const mod = await import("@/views/rolex/accessories/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
