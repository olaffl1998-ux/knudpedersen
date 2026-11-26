import { notFound as routerNotFound, useRouterState } from "@tanstack/react-router";

/** Erstatninger for next/navigation */
export const usePathname = () => useRouterState({ select: (s) => s.location.pathname });
export function notFound() {
  throw routerNotFound();
}
