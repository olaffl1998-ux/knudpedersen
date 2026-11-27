import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/cookiepolitik/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/cookiepolitik")({
  loader: async () => {
    const mod = await import("@/views/cookiepolitik/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
