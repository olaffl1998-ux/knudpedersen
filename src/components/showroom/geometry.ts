import type { ShowroomBrand, ShowroomZone } from "@/data/brands";

/**
 * Butikken er en lang gang (langs -z) med vitriner i oplyste nicher på begge sider, skiftevis venstre og højre.
 * Man går ned gennem midtergangen. Rolex & Tudor står ved indgangen, derefter Ure og til sidst Smykker.
 * `angle` på en plads er (af historiske grunde) den position i gangen, hvorfra man ser vitrinen bedst.
 */
export const HALL_HALF = 2.7;      // halv bredde af gangen (væg til væg)
export const VITRINE_X = 2.05;     // vitrinernes afstand fra midten
export const SPACING = 2.9;        // afstand mellem to vitriner på samme side
export const START_Z = -4;         // første vitrine
export const EYE_Y = 1.6;
export const TARGET_Y = 1.2;

export type Side = -1 | 1;
export type Slot = { brand: ShowroomBrand; index: number; angle: number; x: number; z: number; side: Side; rotY: number };
export type Gap = { x: number; z: number; side: Side; rotY: number; zone: ShowroomZone };

const ORDER: ShowroomZone[] = ["rolex-tudor", "ure", "smykker"];

function place(k: number) {
  const side: Side = k % 2 === 0 ? -1 : 1;
  const z = START_Z - k * (SPACING / 2);
  // Venstre væg vender mod +x, højre mod -x
  return { side, z, x: side * VITRINE_X, rotY: side === -1 ? Math.PI / 2 : -Math.PI / 2 };
}

/** Hvor i gangen kameraet står for at se en plads i z */
const viewFrom = (z: number) => Math.max(0, -z - 3.2);

export function layout(brands: ShowroomBrand[]) {
  const groups = ORDER.map((z) => brands.filter((b) => b.zone === z));
  groups[0].sort((a, b) => (a.slug === "rolex" ? -1 : b.slug === "rolex" ? 1 : 0));
  const slots: Slot[] = [];
  const gaps: Gap[] = [];
  const zoneAngles = {} as Record<ShowroomZone, number>;
  let k = 0;
  groups.forEach((g, gi) => {
    // Hver zone (undtagen den første) starter med et zoneskilt på væggen
    if (gi > 0) { const p = place(k); gaps.push({ ...p, zone: ORDER[gi] }); k++; }
    zoneAngles[ORDER[gi]] = viewFrom(place(k).z);
    for (const b of g) {
      const p = place(k);
      slots.push({ brand: b, index: brands.indexOf(b), angle: viewFrom(p.z), ...p });
      k++;
    }
  });
  zoneAngles[ORDER[0]] = 0;
  const length = -place(k).z + 2; // gangens længde til endevæggen
  const walkEnd = Math.max(0, length - 7);
  return { slots, gaps, zoneAngles, length, walkEnd };
}

export type Pose = { pos: [number, number, number]; target: [number, number, number]; walk?: number };

/** Gåturen: kameraet står i midtergangen og kigger fremad, med et let blik ud mod siderne */
export function overviewPose(s: number, dir: 1 | -1 = 1): Pose {
  const glance = Math.sin(s * 0.9) * 0.9;
  return {
    pos: [0, EYE_Y, -s],
    target: [glance, TARGET_Y + 0.25, -s - dir * 5],
    walk: s,
  };
}

/** Tæt på en vitrine: man går hen foran nichen og kigger direkte ind i den */
export function focusPose(slot: Slot, mobile: boolean, sheet = false): Pose {
  // Mobil, når man swiper: man står i gangen lidt før vitrinen og ser den på skrå, så man mærker butikken
  if (mobile && !sheet) {
    return {
      pos: [-slot.side * 0.35, EYE_Y + 0.05, slot.z + 2.9],
      target: [slot.x * 0.72, TARGET_Y + 0.05, slot.z - 0.2],
    };
  }
  const d = mobile ? (sheet ? 3.4 : 3.0) : 2.5;
  const ty = sheet ? TARGET_Y - 1.0 : TARGET_Y + (mobile ? 0.15 : 0.3);
  return {
    pos: [slot.x - slot.side * d, EYE_Y, slot.z],
    target: [slot.x, ty, slot.z],
  };
}
