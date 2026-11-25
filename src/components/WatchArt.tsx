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

export function StrapSvg({ strap }: { strap: Strap }) {
  const metal = strap.type === "steel" || strap.type === "bicolor";
  const band = metal ? (strap.type === "bicolor" ? "#C9A55A" : "#D0D3D7") : strap.color;
  return (
    <svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={strap.name}>
      <ellipse cx={120} cy={100} rx={92} ry={52} fill="none" stroke={band} strokeWidth={34} />
      {metal && <ellipse cx={120} cy={100} rx={92} ry={52} fill="none" stroke="#9EA3A8" strokeWidth={34} strokeDasharray="3 9" opacity={0.55} />}
      {strap.type === "nato" && <ellipse cx={120} cy={100} rx={92} ry={52} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={30} strokeDasharray="1 3" />}
      {strap.type === "leather" && <ellipse cx={120} cy={100} rx={92} ry={52} fill="none" stroke="rgba(255,255,255,.3)" strokeWidth={1} strokeDasharray="3 3" />}
      {metal ? (
        <rect x={98} y={134} width={44} height={30} rx={4} fill="#B7BBC0" />
      ) : (
        <>
          <rect x={96} y={132} width={48} height={34} rx={5} fill="none" stroke="#B7BBC0" strokeWidth={5} />
          <line x1={120} y1={132} x2={120} y2={166} stroke="#B7BBC0" strokeWidth={4} />
        </>
      )}
      {strap.type === "nato" && (
        <>
          <rect x={30} y={80} width={10} height={40} rx={3} fill="#C9CCD0" />
          <rect x={200} y={80} width={10} height={40} rx={3} fill="#C9CCD0" />
        </>
      )}
    </svg>
  );
}
