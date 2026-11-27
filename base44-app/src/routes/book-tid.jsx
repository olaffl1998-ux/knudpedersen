import { createFileRoute } from "@tanstack/react-router";
import Page from "@/views/book-tid/page";
import { metaHead } from "@/lib/next/meta";

export const Route = createFileRoute("/book-tid")({
  loader: async () => {
    const mod = await import("@/views/book-tid/page");
    return { head: metaHead(mod) };
  },
  head: ({ loaderData }) => loaderData?.head ?? {},
  component: RouteComponent,
});

function RouteComponent() {
  return <Page />;
}
