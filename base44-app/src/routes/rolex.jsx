import { createFileRoute, Outlet } from "@tanstack/react-router";
import RolexLayout from "@/views/rolex/layout";

export const Route = createFileRoute("/rolex")({
  component: () => <RolexLayout><Outlet /></RolexLayout>,
});
