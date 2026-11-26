import Script from "@/lib/next/script";
import { RolexBar } from "@/components/rolex/client";
/**
 * Rolex-sektionen: egen ramme med Rolex-plakette øverst til venstre (linker til Udforsk Rolex),
 * Rolex' menu, Helvetica/Arial og ingen andre mærker.
 * Adobe Launch: Rolex leverer et script til måling. Det indsættes via NEXT_PUBLIC_ROLEX_ADOBE_LAUNCH_URL
 * og indlæses kun på Rolex-sider. [Adobe Launch-URL fra Rolex Digital Officer]
 */
const ADOBE = import.meta.env.VITE_ROLEX_ADOBE_LAUNCH_URL;
export default function RolexLayout({ children }) {
    return (<div className="rx" data-rolex-section="true">
      {ADOBE ? <Script src={ADOBE} strategy="afterInteractive"/> : <meta name="rolex-adobe-launch" content="[Adobe Launch-script fra Rolex indsættes her]"/>}
      <RolexBar />
      <div className="rx-wrap">{children}</div>
    </div>);
}
