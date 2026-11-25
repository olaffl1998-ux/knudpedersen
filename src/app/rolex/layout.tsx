import Link from "next/link";
import { KeepExploring, RolexMenu } from "@/components/RolexNav";

/**
 * Rolex-sektionen: egen ramme med Rolex-plakette øverst til venstre (linker til Udforsk Rolex),
 * Rolex' menu og "Fortsæt med at udforske" nederst. Ingen andre mærker vises her.
 */
export default function RolexLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rolex-zone">
      <div className="wrap">
        <div className="rolex-head">
          <Link className="plaque" href="/rolex" aria-label="Officiel Rolex-forhandler, udforsk Rolex">
            Rolex-plakette<br />(fil fra Rolex)
          </Link>
          <RolexMenu />
        </div>
        {children}
        <KeepExploring />
      </div>
    </div>
  );
}
