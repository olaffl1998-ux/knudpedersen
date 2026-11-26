import type { Model, Strap } from "@/data/catalog";

/**
 * Tegnede pladsholdere for ure og remme. Erstattes af mærkernes egne billeder
 * (med brugsret fra forhandlerportalen), når de er importeret.
 */

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

function Band({ strap, x, y, w, h }: { strap: Strap; x: number; y: number; w: number; h: number }) {
  if (strap.type === "steel" || strap.type === "bicolor") {
    const rows = 6, rh = h / rows;
    return (
      <g>
        {Array.from({ length: rows }, (_, i) => {
          const yy = y + i * rh;
          return (
            <g key={i}>
              <rect x={x} y={yy} width={w * 0.3} height={rh - 1.5} rx={2} fill="#B7BBC0" />
              <rect x={x + w * 0.31} y={yy} width={w * 0.38} height={rh - 1.5} rx={2} fill={strap.type === "bicolor" ? "#C9A55A" : "#D9DCE0"} />
              <rect x={x + w * 0.7} y={yy} width={w * 0.3} height={rh - 1.5} rx={2} fill="#B7BBC0" />
            </g>
          );
        })}
      </g>
    );
  }
  const lines = [];
  if (strap.type === "nato") for (let i = 4; i < h; i += 4) lines.push(<line key={i} x1={x} x2={x + w} y1={y + i} y2={y + i} stroke="rgba(255,255,255,.07)" />);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={strap.type === "rubber" ? 10 : 6} fill={strap.color} />
      {lines}
      {strap.type === "leather" && <rect x={x + 4} y={y + 3} width={w - 8} height={h - 6} rx={4} fill="none" stroke="rgba(255,255,255,.28)" strokeDasharray="3 3" />}
      {strap.type === "rubber" && <rect x={x + w * 0.42} y={y + 6} width={w * 0.16} height={h - 12} rx={4} fill="rgba(255,255,255,.06)" />}
    </g>
  );
}

export function WatchSvg({ model, strap }: { model: Model; strap: Strap }) {
  const cx = 120, cy = 150, r = 68;
  const { dial, bezel } = model.look;
  const caseCol = model.look.case;
  const ink = isLight(dial) ? "#222" : "#EDEDED";
  return (
    <svg viewBox="0 0 240 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`${model.name} på ${strap.name}`}>
      <Band strap={strap} x={cx - 30} y={0} w={60} h={cy - r + 6} />
      <Band strap={strap} x={cx - 30} y={cy + r - 6} w={60} h={300 - (cy + r - 6)} />
      <rect x={cx - 40} y={cy - r - 6} width={80} height={20} rx={6} fill={caseCol} />
      <rect x={cx - 40} y={cy + r - 14} width={80} height={20} rx={6} fill={caseCol} />
      <rect x={cx + r - 4} y={cy - 9} width={16} height={18} rx={3} fill="#B0B4B9" />
      <circle cx={cx} cy={cy} r={r + 6} fill={caseCol} />
      <circle cx={cx} cy={cy} r={r} fill={bezel} />
      {Array.from({ length: 12 }, (_, k) => {
        const a = (k * 5 * Math.PI) / 30;
        return <circle key={k} cx={cx + Math.sin(a) * r * 0.86} cy={cy - Math.cos(a) * r * 0.86} r={k % 3 === 0 ? 2.4 : 1.4} fill="#E8E8E8" opacity={0.8} />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.74} fill={dial} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6, big = i % 3 === 0;
        const r1 = r * 0.62, r2 = big ? r * 0.46 : r * 0.53;
        return <line key={i} x1={cx + Math.sin(a) * r1} y1={cy - Math.cos(a) * r1} x2={cx + Math.sin(a) * r2} y2={cy - Math.cos(a) * r2} stroke={ink} strokeWidth={big ? 5 : 3} strokeLinecap="round" />;
      })}
      <line x1={cx} y1={cy} x2={cx - r * 0.28} y2={cy - r * 0.3} stroke={ink} strokeWidth={5} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + r * 0.38} y2={cy - r * 0.44} stroke={ink} strokeWidth={3.5} strokeLinecap="round" />
      <line x1={cx} y1={cy + r * 0.12} x2={cx} y2={cy - r * 0.62} stroke="#A98024" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={3.5} fill="#A98024" />
    </svg>
  );
}

/** Rem eller lænke tegnet som "flat lay": to remdele lodret, med spænde, huller og syninger */
export function StrapSvg({ strap }: { strap: Strap }) {
  const id = `g-${strap.key}`;
  const metal = strap.type === "steel" || strap.type === "bicolor";
  const base = metal ? "#C9CDD2" : strap.color;
  const stitch = isLight(base) ? "rgba(31,28,26,.28)" : "rgba(255,255,255,.32)";
  // Remdele: øverste (spændeside) og nederste (hulside), let tilspidset
  const upper = "M38 22 H82 V118 Q82 132 76 136 H44 Q38 132 38 118 Z";
  const lower = "M38 176 H82 V282 Q82 300 60 306 Q38 300 38 282 Z";
  return (
    <svg viewBox="0 0 120 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={strap.name}>
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".18" />
          <stop offset=".22" stopColor="#fff" stopOpacity=".10" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".22" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="312" rx="30" ry="4" fill="rgba(31,28,26,.10)" />
      {metal ? (
        <g>
          {[upper, lower].map((d, k) => (
            <g key={k}>
              <clipPath id={`${id}-c${k}`}><path d={d} /></clipPath>
              <g clipPath={`url(#${id}-c${k})`}>
                <rect x="30" y="0" width="60" height="320" fill="#B9BEC4" />
                {Array.from({ length: 22 }, (_, i) => (
                  <g key={i}>
                    <rect x="38" y={20 + i * 14} width="13" height="12.5" rx="2" fill="#D5D9DD" />
                    <rect x="52" y={20 + i * 14} width="16" height="12.5" rx="2" fill={strap.type === "bicolor" ? "#CDA85E" : "#E4E7EA"} />
                    <rect x="69" y={20 + i * 14} width="13" height="12.5" rx="2" fill="#D5D9DD" />
                  </g>
                ))}
                <rect x="30" y="0" width="60" height="320" fill={`url(#${id})`} />
              </g>
            </g>
          ))}
          <rect x="42" y="134" width="36" height="46" rx="5" fill="#C3C8CD" stroke="#A9AEB4" />
          <rect x="47" y="140" width="26" height="34" rx="3" fill="none" stroke="#A9AEB4" />
        </g>
      ) : (
        <g>
          <path d={upper} fill={base} />
          <path d={upper} fill={`url(#${id})`} />
          <path d={lower} fill={base} />
          <path d={lower} fill={`url(#${id})`} />
          {strap.type === "nato" && Array.from({ length: 40 }, (_, i) => <line key={i} x1="38" x2="82" y1={26 + i * 7} y2={26 + i * 7} stroke="rgba(255,255,255,.07)" />)}
          {strap.type === "rubber" && <><rect x="55" y="30" width="10" height="96" rx="5" fill="rgba(0,0,0,.12)" /><rect x="55" y="184" width="10" height="100" rx="5" fill="rgba(0,0,0,.12)" /></>}
          {(strap.type === "leather" || strap.type === "nato") && (
            <>
              <path d="M42.5 26 V117 Q42.5 128 47 131 H73 Q77.5 128 77.5 117 V26" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="3 3" />
              <path d="M42.5 180 V281 Q42.5 296 60 301 Q77.5 296 77.5 281 V180" fill="none" stroke={stitch} strokeWidth="1" strokeDasharray="3 3" />
            </>
          )}
          {/* holdere */}
          <rect x="36" y="100" width="48" height="7" rx="2" fill={base} stroke="rgba(0,0,0,.18)" />
          {/* spænde */}
          <rect x="40" y="128" width="40" height="26" rx="6" fill="none" stroke="#B9BEC4" strokeWidth="4" />
          <line x1="60" y1="128" x2="60" y2="152" stroke="#9EA3A8" strokeWidth="3" strokeLinecap="round" />
          {/* huller */}
          {[214, 230, 246, 262, 278].map((y) => <circle key={y} cx="60" cy={y} r="2.6" fill="rgba(0,0,0,.45)" />)}
          {/* fjederstifter i toppen */}
          <rect x="34" y="18" width="52" height="5" rx="2.5" fill="#B9BEC4" />
          <rect x="34" y="172" width="52" height="5" rx="2.5" fill="#B9BEC4" />
        </g>
      )}
    </svg>
  );
}
