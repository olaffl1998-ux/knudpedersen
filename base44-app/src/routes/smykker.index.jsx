import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/smykker/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/smykker/")({
  loader: async () => {
    const mod = await import("@/views/smykker/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
