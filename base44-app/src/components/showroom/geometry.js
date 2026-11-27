/** Placering af vitrinerne i det cirkulære galleri. Rolex står i midten af sin zone, lige foran kameraet ved start. */
export const ROOM_RADIUS = 6;
export const WALL_RADIUS = 8.2;
export const EYE_Y = 1.55;
export const TARGET_Y = 1.15;
const ORDER = ["rolex-tudor", "ure", "smykker"];
export function layout(brands) {
    const groups = ORDER.map((z) => brands.filter((b) => b.zone === z));
    // Rolex først i sin zone, så den står centralt
    groups[0].sort((a, b) => (a.slug === "rolex" ? -1 : b.slug === "rolex" ? 1 : 0));
    const total = brands.length + ORDER.length; // én tom plads mellem zonerne
    const step = (Math.PI * 2) / total;
    const slots = [];
    const zoneAngles = {};
    const gaps = [];
    let pos = 0;
    groups.forEach((g, gi) => {
        const start = pos;
        for (const b of g) {
            const angle = pos * step;
            slots.push({ brand: b, index: brands.indexOf(b), angle, x: Math.sin(angle) * ROOM_RADIUS, z: -Math.cos(angle) * ROOM_RADIUS });
            pos++;
        }
        zoneAngles[ORDER[gi]] = ((start + pos - 1) / 2) * step;
        gaps.push(pos * step); // tom plads, her står en plante
        pos++;
    });
    return { slots, zoneAngles, gaps };
}
/** Oversigt: man går rundt i butikken langs vitrinerne og kigger på dem i den retning */
export const WALK_RADIUS = 1.4;
export function overviewPose(angle) {
    const ahead = ROOM_RADIUS;
    return {
        pos: [Math.sin(angle) * WALK_RADIUS, EYE_Y + 0.1, -Math.cos(angle) * WALK_RADIUS],
        target: [Math.sin(angle) * ahead, TARGET_Y + 0.4, -Math.cos(angle) * ahead],
    };
}
/** Tæt på en vitrine: kameraet flyver ind foran den */
export function focusPose(slot, mobile, sheet = false) {
    const d = mobile ? (sheet ? 4.0 : 3.1) : 2.7;
    const k = (ROOM_RADIUS - d) / ROOM_RADIUS;
    // På mobil dækker info-panelet den nederste del, så vitrinen skal stå højt i billedet
    const ty = sheet ? TARGET_Y - 1.1 : TARGET_Y + (mobile ? 0.15 : 0.45);
    return {
        pos: [slot.x * k, EYE_Y, slot.z * k],
        target: [slot.x, ty, slot.z],
    };
}
