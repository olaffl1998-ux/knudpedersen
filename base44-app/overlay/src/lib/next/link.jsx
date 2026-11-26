import { Link as RouterLink } from "@tanstack/react-router";
import { forwardRef } from "react";

/**
 * Erstatning for next/link. Interne stier uden forespørgsel bruger routerens Link,
 * alt andet (forespørgsler, tel:, mailto:, eksterne adresser) er et almindeligt <a>.
 */
const Link = forwardRef(function Link({ href, prefetch, scroll, replace, children, ...rest }, ref) {
  const h = typeof href === "string" ? href : String(href ?? "");
  if (!h.startsWith("/") || h.includes("?")) {
    return <a ref={ref} href={h} {...rest}>{children}</a>;
  }
  const [to, hash] = h.split("#");
  return (
    <RouterLink ref={ref} to={to || "/"} hash={hash} replace={replace} resetScroll={scroll !== false} activeProps={{}} {...rest}>
      {children}
    </RouterLink>
  );
});

export default Link;
