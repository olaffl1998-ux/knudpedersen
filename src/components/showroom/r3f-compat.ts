/**
 * Base44's editor injects `data-source-location` and `data-dynamic-content` into every JSX element.
 * Inside a react-three-fiber <Canvas> those props are applied to whatever instance the element
 * creates: three.js objects and also postprocessing passes and effects, which do not inherit from
 * three.js. R3F reads a dashed prop as a nested path (`object.data.dynamic-content`) and throws.
 *
 * Declaring both names on Object.prototype makes R3F see them as ordinary, harmless properties on
 * every instance. They are non-enumerable, so nothing that iterates keys ever sees them.
 * (Rettelse fra Base44's editor, 2026-11-27.)
 */
const ATTRIBUTES = ["data-source-location", "data-dynamic-content"];
for (const name of ATTRIBUTES) {
  if (name in Object.prototype) continue;
  Object.defineProperty(Object.prototype, name, { value: undefined, writable: true, configurable: true, enumerable: false });
}
export {};
