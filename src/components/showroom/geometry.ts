import type { ShowroomBrand, ShowroomZone } from "@/data/brands";

/** Placering af vitrinerne i det cirkulære galleri. Rolex står i midten af sin zone, lige foran kameraet ved start. */
export const ROOM_RADIUS = 6;
export const WALL_RADIUS = 8.2;
export const EYE_Y = 1.55;
export const TARGET_Y = 1.15;

export type Slot = { brand: ShowroomBrand; index: number; angle: number; x: number; z: number };

const ORDER: ShowroomZone[] = ["rolex-tudor", "ure", "smykker"];

export function layout(brands: ShowroomBrand[]): { slots: Slot[]; zoneAngles: Record<ShowroomZone, number> } {
  const groups = ORDER.map((z) => brands.filter((b) => b.zone === z));
  // Rolex først i sin zone, så den står centralt
  groups[0].sort((a, b) => (a.slug === "rolex" ? -1 : b.slug === "rolex" ? 1 : 0));
  const total = brands.length + ORDER.length; // én tom plads mellem zonerne
  const step = (Math.PI * 2) / total;
  const slots: Slot[] = [];
  const zoneAngles = {} as Record<ShowroomZone, number>;
  let pos = 0;
  groups.forEach((g, gi) => {
    const start = pos;
    for (const b of g) {
      const angle = pos * step;
      slots.push({ brand: b, index: brands.indexOf(b), angle, x: Math.sin(angle) * ROOM_RADIUS, z: -Math.cos(angle) * ROOM_RADIUS });
      pos++;
    }
    zoneAngles[ORDER[gi]] = ((start + pos - 1) / 2) * step;
    pos++; // tom plads
  });
  return { slots, zoneAngles };
}

/** Oversigt: kameraet står tæt på midten og kigger ud mod en vinkel */
export function overviewPose(angle: number) {
  // Kameraet står lige bag midten og kigger ud mod vitrinerne i den retning
  const back = 0.7, ahead = 2.6;
  return {
    pos: [-Math.sin(angle) * back, EYE_Y + 0.2, Math.cos(angle) * back] as [number, number, number],
    target: [Math.sin(angle) * ahead, TARGET_Y + 0.05, -Math.cos(angle) * ahead] as [number, number, number],
  };
}

/** Tæt på en vitrine: kameraet flyver ind foran den */
export function focusPose(slot: Slot, mobile: boolean, sheet = false) {
  const d = mobile ? (sheet ? 4.0 : 3.1) : 2.3;
  const k = (ROOM_RADIUS - d) / ROOM_RADIUS;
  // På mobil dækker info-panelet den nederste del, så vitrinen skal stå højt i billedet
  const ty = sheet ? TARGET_Y - 1.1 : TARGET_Y + 0.15;
  return {
    pos: [slot.x * k, EYE_Y, slot.z * k] as [number, number, number],
    target: [slot.x, ty, slot.z] as [number, number, number],
  };
}
