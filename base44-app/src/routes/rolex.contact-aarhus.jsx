import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/rolex/contact-aarhus/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/rolex/contact-aarhus")({
  loader: async () => {
    const mod = await import("@/views/rolex/contact-aarhus/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
