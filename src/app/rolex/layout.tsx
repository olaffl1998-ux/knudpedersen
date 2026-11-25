import Link from "next/link";
import { rolexAssets } from "@/data/rolex";
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
          <Link className="plaque" href="/rolex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rolexAssets.plaque} alt="Officiel Rolex-forhandler" width={120} height={60} />
          </Link>
          <RolexMenu />
        </div>
        {children}
        <KeepExploring />
      </div>
    </div>
  );
}
