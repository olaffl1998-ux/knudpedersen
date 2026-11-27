import * as THREE from "three";
/**
 * Base44's editor adds `data-source-location` and `data-dynamic-content` to every JSX element.
 * Inside a react-three-fiber <Canvas> those props land on three.js objects, and R3F reads a dashed
 * prop as a nested path (`object.data.dynamic-content`) and throws. Declaring the names on the
 * three base classes makes R3F treat them as plain, harmless properties.
 */
const BASES = [THREE.Object3D, THREE.Material, THREE.BufferGeometry, THREE.Color, THREE.Fog];
const ATTRIBUTES = ["data-source-location", "data-dynamic-content"];
for (const Base of BASES) {
    if (!Base)
        continue;
    for (const name of ATTRIBUTES) {
        if (name in Base.prototype)
            continue;
        Object.defineProperty(Base.prototype, name, { value: undefined, writable: true, configurable: true, enumerable: false });
    }
}
