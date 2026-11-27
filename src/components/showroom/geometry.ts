import type { ShowroomBrand, ShowroomZone } from "@/data/brands";

/**
 * Butikken er ét stort rum. Vitrinerne står i oplyste nicher langs væggene: ned langs venstre væg,
 * hen langs bagvæggen, op ad højre væg og til sidst på hver side af indgangen. I midten står en lounge.
 * Kameraet går en rundtur i rummet (rundt om loungen) og kigger ud mod vitrinerne.
 * `angle` på en plads er (af historiske grunde) den position på rundturen, hvorfra man ser vitrinen bedst.
 */
export const ROOM_HALF = 6;        // halv bredde af rummet (væg til væg)
export const FRONT_Z = 1;          // indgangsvæggen
export const INSET = 0.65;         // vitrinernes afstand fra væggen
export const SPACING = 2.15;       // afstand mellem to vitriner på samme væg
export const AISLE = 2.95;         // rundturens afstand fra væggene
export const EYE_Y = 1.6;
export const TARGET_Y = 1.2;

export type Slot = {
  brand: ShowroomBrand; index: number; angle: number;
  x: number; z: number; rotY: number;
  /** Retning ind i rummet (væk fra væggen) */
  nx: number; nz: number;
  /** Væggens punkt bag vitrinen */
  wx: number; wz: number;
};
export type Gap = { x: number; z: number; rotY: number; nx: number; nz: number; wx: number; wz: number; zone: ShowroomZone };

const ORDER: ShowroomZone[] = ["rolex-tudor", "ure", "smykker"];

type Spot = { x: number; z: number; nx: number; nz: number; wx: number; wz: number; rotY: number };
const spot = (wx: number, wz: number, nx: number, nz: number): Spot =>
  ({ wx, wz, nx, nz, x: wx + nx * INSET, z: wz + nz * INSET, rotY: Math.atan2(nx, nz) });

/** Pladserne langs væggene i rækkefølge rundt i rummet. Rummets dybde vokser med antallet af mærker */
function wallSpots(n: number) {
  const back = 4;                                 // på bagvæggen
  const front = 2;                                // ved siden af indgangen
  const side = Math.max(2, Math.ceil((n - back - front) / 2));
  const firstZ = FRONT_Z - 2.3;
  const backZ = firstZ - (side - 1) * SPACING - 2.4;
  const spots: Spot[] = [];
  for (let i = 0; i < side; i++) spots.push(spot(-ROOM_HALF, firstZ - i * SPACING, 1, 0)); // venstre væg, indad
  for (let i = 0; i < back; i++) spots.push(spot(-3.3 + i * 2.2, backZ, 0, 1));        // bagvæggen, fra venstre
  for (let i = side - 1; i >= 0; i--) spots.push(spot(ROOM_HALF, firstZ - i * SPACING, -1, 0)); // højre væg, udad
  spots.push(spot(3.6, FRONT_Z, 0, -1));                                               // højre for indgangen
  spots.push(spot(-3.6, FRONT_Z, 0, -1));                                              // venstre for indgangen
  return { spots, backZ };
}

/** Rundturen: et rektangel med runde hjørner, der starter midt foran indgangen og går mod venstre */
export type Loop = { cx: number; cz: number; a: number; b: number; r: number; P: number };
function makeLoop(backZ: number): Loop {
  const a = ROOM_HALF - AISLE;
  const zFront = FRONT_Z - AISLE, zBack = backZ + AISLE;
  const b = (zFront - zBack) / 2;
  const r = Math.min(1.6, a, b);
  const P = 4 * (a - r) + 4 * (b - r) + 2 * Math.PI * r;
  return { cx: 0, cz: (zFront + zBack) / 2, a, b, r, P };
}

/** Punkt og retning på rundturen ved buelængden s */
export function loopAt(L: Loop, s: number) {
  let t = ((s % L.P) + L.P) % L.P;
  const { a, b, r, cx, cz } = L;
  const ha = a - r, hb = b - r, q = (Math.PI / 2) * r;
  // Segmenter mod uret set ovenfra med -z ind i butikken: forkant mod venstre, venstre side ind, bagkant mod højre, højre side ud
  const segs: Array<[number, (u: number) => [number, number, number, number]]> = [
    [ha, (u) => [-u, b, -1, 0]],
    [q, (u) => { const th = u / r; return [-ha - Math.sin(th) * r, hb + Math.cos(th) * r, -Math.cos(th), -Math.sin(th)]; }],
    [2 * hb, (u) => [-a, hb - u, 0, -1]],
    [q, (u) => { const th = u / r; return [-ha - Math.cos(th) * r, -hb - Math.sin(th) * r, Math.sin(th), -Math.cos(th)]; }],
    [2 * ha, (u) => [-ha + u, -b, 1, 0]],
    [q, (u) => { const th = u / r; return [ha + Math.sin(th) * r, -hb - Math.cos(th) * r, Math.cos(th), Math.sin(th)]; }],
    [2 * hb, (u) => [a, -hb + u, 0, 1]],
    [q, (u) => { const th = u / r; return [ha + Math.cos(th) * r, hb + Math.sin(th) * r, -Math.sin(th), Math.cos(th)]; }],
    [ha, (u) => [ha - u, b, -1, 0]],
  ];
  for (const [len, f] of segs) {
    if (t <= len) { const [x, z, tx, tz] = f(t); return { x: cx + x, z: cz + z, tx, tz }; }
    t -= len;
  }
  return { x: cx, z: cz + b, tx: -1, tz: 0 };
}

/** Den position på rundturen, hvor man står lidt før en plads og ser den på skrå */
function bestS(L: Loop, x: number, z: number) {
  let best = 0, bd = Infinity;
  for (let s = 0; s < L.P; s += 0.05) {
    const p = loopAt(L, s);
    const d = (p.x - x) ** 2 + (p.z - z) ** 2;
    if (d < bd) { bd = d; best = s; }
  }
  return (best - 2.6 + L.P) % L.P;
}

export function layout(brands: ShowroomBrand[]) {
  const groups = ORDER.map((z) => brands.filter((b) => b.zone === z));
  groups[0].sort((a, b) => (a.slug === "rolex" ? -1 : b.slug === "rolex" ? 1 : 0));
  const total = brands.length + ORDER.length - 1;
  const { spots, backZ } = wallSpots(total);
  const loop = makeLoop(backZ);
  const slots: Slot[] = [];
  const gaps: Gap[] = [];
  const zoneAngles = {} as Record<ShowroomZone, number>;
  let k = 0;
  groups.forEach((g, gi) => {
    // Hver zone (undtagen den første) starter med et rådgivningsbord med stole
    if (gi > 0 && spots[k]) { gaps.push({ ...spots[k], zone: ORDER[gi] }); k++; }
    zoneAngles[ORDER[gi]] = spots[k] ? bestS(loop, spots[k].x, spots[k].z) : 0;
    for (const b of g) {
      const p = spots[k];
      if (!p) break;
      slots.push({ brand: b, index: brands.indexOf(b), angle: bestS(loop, p.x, p.z), ...p });
      k++;
    }
  });
  zoneAngles[ORDER[0]] = 0;
  return { slots, gaps, zoneAngles, backZ, loop, walkEnd: loop.P };
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export type Pose = { pos: [number, number, number]; target: [number, number, number]; walk?: number };

/** Rundturen: kameraet går rundt i rummet og kigger fremad og lidt ud mod vitrinerne */
export function overviewPose(L: Loop, s: number, dir: 1 | -1 = 1): Pose {
  const p = loopAt(L, s);
  const ahead = loopAt(L, s + dir * 3.2);
  // Udad = væk fra rummets midte
  let ox = p.tz, oz = -p.tx;
  if (ox * (p.x - L.cx) + oz * (p.z - L.cz) < 0) { ox = -ox; oz = -oz; }
  const glance = 1.1 + Math.sin(s * 0.7) * 0.5;
  return {
    pos: [p.x, EYE_Y, p.z],
    target: [ahead.x + ox * glance, TARGET_Y + 0.2, ahead.z + oz * glance],
    walk: s,
  };
}

/** Tæt på en vitrine: man går hen foran nichen og kigger direkte ind i den */
export function focusPose(slot: Slot, mobile: boolean, sheet = false, backZ = -Infinity): Pose {
  // Mobil, når man swiper: man står lidt før vitrinen og ser den på skrå, så man mærker butikken
  if (mobile && !sheet) {
    // Langs væggen i gåretningen (højre om normalen)
    const tx = slot.nz, tz = -slot.nx;
    return {
      // Kameraet bliver altid inde i butikken (ellers ser man væggene bagfra)
      pos: [clamp(slot.x + slot.nx * 2.4 - tx * 2.6, -ROOM_HALF + 0.5, ROOM_HALF - 0.5), EYE_Y + 0.05, clamp(slot.z + slot.nz * 2.4 - tz * 2.6, backZ + 0.5, FRONT_Z - 0.5)],
      target: [slot.x + slot.nx * 0.5 + tx * 0.2, TARGET_Y + 0.05, slot.z + slot.nz * 0.5 + tz * 0.2],
    };
  }
  const d = mobile ? (sheet ? 3.4 : 3.0) : 2.5;
  const ty = sheet ? TARGET_Y - 1.0 : TARGET_Y + (mobile ? 0.15 : 0.3);
  return {
    pos: [slot.x + slot.nx * d, EYE_Y, slot.z + slot.nz * d],
    target: [slot.x, ty, slot.z],
  };
}
