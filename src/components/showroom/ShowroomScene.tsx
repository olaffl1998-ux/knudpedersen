"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, ContactShadows, Environment, Html, Lightformer, MeshReflectorMaterial, RoundedBox, useGLTF, useTexture } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import "./r3f-compat";
import type { ShowroomBrand, ShowroomZone } from "@/data/brands";
import { zoneLabels } from "@/data/brands";
import { HALL_HALF, focusPose, layout, overviewPose, type Gap, type Pose, type Slot } from "./geometry";

export type SceneProps = {
  brands: ShowroomBrand[];
  active: number | null;
  hover: number | null;
  /** Hvor langt nede i butikken kameraet skal stå i gåturen (zone eller mærke) */
  lookAngle: number | null;
  mobile: boolean;
  /** Mobil: det mærke, der står foran kameraet */
  current: number;
  onHover: (i: number | null) => void;
  onSelect: (i: number) => void;
  onReady: () => void;
  /** Sand, når scenen er rullet ud af syne: så stopper tegningen */
  paused?: boolean;
  /** Sand ved "reducér bevægelse": kameraet går ikke af sig selv */
  calm?: boolean;
};

const BRASS = "#b8955e";
const WALNUT = "#4a3427";
const CEIL = 4.0;
const NICHE_W = 1.7;

const fonts = () => ({
  display: getComputedStyle(document.body).getPropertyValue("--font-display").trim() || "Georgia, serif",
  body: getComputedStyle(document.body).getPropertyValue("--font-body").trim() || "sans-serif",
});
const spaced = (s: string) => s.toUpperCase().split("").join(String.fromCharCode(8202));

function canvasTex(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
const cache = new Map<string, THREE.CanvasTexture>();
function cached(key: string, make: () => THREE.CanvasTexture) {
  let t = cache.get(key);
  if (!t) { t = make(); cache.set(key, t); }
  return t;
}

/** Messingpladen på soklen */
function plateTexture(name: string) {
  return cached("plate:" + name, () => canvasTex(1024, 220, (ctx) => {
    const { display } = fonts();
    let size = 120;
    ctx.font = `400 ${size}px ${display}`;
    while (ctx.measureText(name).width > 940 && size > 40) { size -= 6; ctx.font = `400 ${size}px ${display}`; }
    ctx.fillStyle = "#2a2016"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(name, 512, 116);
  }));
}

/** Skilt i messing på mørk valnød: bruges både som udhængsskilt og over nichen */
function signTexture(name: string, eyebrow: string) {
  return cached("sign:" + name + eyebrow, () => canvasTex(1024, 320, (ctx) => {
    const { display, body } = fonts();
    const g = ctx.createLinearGradient(0, 0, 0, 320);
    g.addColorStop(0, "#3d2b20"); g.addColorStop(1, "#2e2018");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1024, 320);
    ctx.strokeStyle = "#c9a56b"; ctx.lineWidth = 5; ctx.strokeRect(16, 16, 992, 288);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    if (eyebrow) { ctx.fillStyle = "#b89a6a"; ctx.font = `500 30px ${body}`; ctx.fillText(spaced(eyebrow), 512, 76); }
    let size = 132;
    ctx.font = `400 ${size}px ${display}`;
    while (ctx.measureText(name).width > 900 && size > 50) { size -= 6; ctx.font = `400 ${size}px ${display}`; }
    ctx.fillStyle = "#e9d3a6";
    ctx.fillText(name, 512, eyebrow ? 186 : 160);
  }));
}

/** Travertin på gulvet: varm beige sten i store fliser med vandrette årer (som i Rolex-afdelingen) */
function marbleTexture() {
  return cached("travertine", () => {
    const t = canvasTex(1024, 1024, (ctx) => {
      ctx.fillStyle = "#e6dac7"; ctx.fillRect(0, 0, 1024, 1024);
      let seed = 11;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < 140; i++) {
        const y = rnd() * 1024, h = 1 + rnd() * 5;
        ctx.fillStyle = `rgba(${rnd() > 0.5 ? "170,150,120" : "250,244,232"},${0.08 + rnd() * 0.18})`;
        ctx.fillRect(0, y, 1024, h);
      }
      for (let i = 0; i < 900; i++) { ctx.fillStyle = `rgba(150,128,100,${0.1 + rnd() * 0.2})`; ctx.fillRect(rnd() * 1024, rnd() * 1024, 1 + rnd() * 5, 1 + rnd() * 2); }
      ctx.strokeStyle = "rgba(140,120,95,.35)"; ctx.lineWidth = 2;
      for (const y of [0, 512]) { ctx.strokeRect(0, y, 1024, 512); }
      ctx.beginPath(); ctx.moveTo(512, 0); ctx.lineTo(512, 512); ctx.moveTo(256, 512); ctx.lineTo(256, 1024); ctx.moveTo(768, 512); ctx.lineTo(768, 1024); ctx.stroke();
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  });
}

/** Lodrette træ-lameller på væggene, som i Rolex-afdelingen hos Knud Pedersen */
function walnutTexture() {
  return cached("slats", () => {
    const t = canvasTex(512, 512, (ctx) => {
      const n = 8, w = 512 / n;
      for (let i = 0; i < n; i++) {
        const x = i * w;
        const g = ctx.createLinearGradient(x, 0, x + w, 0);
        g.addColorStop(0, "#4e3320"); g.addColorStop(0.18, "#86603f"); g.addColorStop(0.55, "#765236"); g.addColorStop(0.85, "#63432a"); g.addColorStop(1, "#24170d");
        ctx.fillStyle = g; ctx.fillRect(x, 0, w, 512);
        for (let k = 0; k < 7; k++) {
          ctx.strokeStyle = `rgba(${k % 2 ? "40,22,10" : "150,100,65"},.18)`; ctx.lineWidth = 1;
          const gx = x + 6 + ((k * 13 + i * 7) % (w - 12));
          ctx.beginPath(); ctx.moveTo(gx, 0); ctx.bezierCurveTo(gx + 3, 170, gx - 3, 340, gx + 1, 512); ctx.stroke();
        }
      }
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  });
}

/** Bagvæggen i nichen: lyst kalkpuds med et lysfald fra spottet ovenover, ligesom i en rigtig butik */
function nicheTexture() {
  return cached("niche", () => canvasTex(256, 512, (ctx) => {
    ctx.fillStyle = "#ddd0bb"; ctx.fillRect(0, 0, 256, 512);
    for (let y = 0; y < 512; y += 3) { ctx.fillStyle = `rgba(${y % 9 ? "180,160,130" : "255,250,240"},.07)`; ctx.fillRect(0, y, 256, 1 + (y % 5)); }
    const g = ctx.createRadialGradient(128, 40, 4, 128, 120, 300);
    g.addColorStop(0, "rgba(255,246,228,1)");
    g.addColorStop(0.35, "rgba(250,236,210,.85)");
    g.addColorStop(1, "rgba(250,236,210,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 512);
    const v = ctx.createLinearGradient(0, 0, 0, 512);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(60,40,25,.25)");
    ctx.fillStyle = v; ctx.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 1400; i++) { ctx.fillStyle = `rgba(${i % 2 ? "255,255,255" : "90,70,50"},.04)`; ctx.fillRect((i * 73) % 256, (i * 137) % 512, 2, 2); }
  }));
}

const GLASS_EDGES = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.7, 0.72, 0.7));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Look = { s: number; dir: 1 | -1; pitch: number; step: number; touched: boolean; dragging: boolean; lastX: number; lastY: number };

/** Kameraet: i gåturen går man langsomt ned gennem butikken (og vender ved enden).
    Træk eller scroll for selv at gå frem og tilbage. Ved klik går man hen foran vitrinen (1,2 sek., ease-in-out). */
function CameraRig({ pose, overview, look, auto, walkEnd }: { pose: Pose | null; overview: boolean; look: React.MutableRefObject<Look>; auto: boolean; walkEnd: number }) {
  const { camera } = useThree();
  const cur = useRef({ target: new THREE.Vector3(...overviewPose(0).target) });
  const anim = useRef<{ t: number; fromP: THREE.Vector3; fromT: THREE.Vector3; toP: THREE.Vector3; toT: THREE.Vector3; walk?: number } | null>(null);
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), t: new THREE.Vector3() }), []);
  useEffect(() => {
    if (!pose) return;
    anim.current = { t: 0, fromP: camera.position.clone(), fromT: cur.current.target.clone(), toP: new THREE.Vector3(...pose.pos), toT: new THREE.Vector3(...pose.target), walk: pose.walk };
  }, [pose, camera]);
  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const cam = camera as THREE.PerspectiveCamera;
    const a = anim.current;
    const L = look.current;
    if (a) {
      a.t = Math.min(1, a.t + dt / 1.2);
      const k = ease(a.t);
      cam.position.lerpVectors(a.fromP, a.toP, k);
      cur.current.target.lerpVectors(a.fromT, a.toT, k);
      cam.lookAt(cur.current.target);
      if (a.t >= 1) { anim.current = null; if (a.walk != null) { L.s = a.walk; L.dir = 1; } }
    } else if (overview) {
      if (auto && !L.touched) {
        L.s += dt * 0.42 * L.dir;
        L.step += dt;
        if (L.s > walkEnd) { L.s = walkEnd; L.dir = -1; }
        if (L.s < 0) { L.s = 0; L.dir = 1; }
      }
      L.s = Math.max(0, Math.min(walkEnd, L.s));
      const p = overviewPose(L.s, L.dir);
      // Et ganske let skridt-vip, når man går
      const bob = auto && !L.touched ? Math.sin(L.step * 4.2) * 0.01 : 0;
      cam.position.lerp(tmp.p.set(p.pos[0], p.pos[1] + bob, p.pos[2]), Math.min(1, dt * 5));
      cur.current.target.lerp(tmp.t.set(p.target[0], p.target[1] + L.pitch * 3, p.target[2]), Math.min(1, dt * 2.2));
      cam.lookAt(cur.current.target);
    }
  });
  return null;
}

/** Scroll med hjulet går frem og tilbage i butikken, når man har rørt scenen. Ved enderne ruller siden videre */
function WheelWalk({ look, enabled, walkEnd }: { look: React.MutableRefObject<Look>; enabled: boolean; walkEnd: number }) {
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    const on = (e: WheelEvent) => {
      const L = look.current;
      if (!enabled || !L.touched) return;
      const next = Math.max(0, Math.min(walkEnd, L.s + Math.sign(e.deltaY) * 0.7));
      if (next === L.s) return;
      e.preventDefault();
      L.s = next; L.dir = e.deltaY > 0 ? 1 : -1;
    };
    el.addEventListener("wheel", on, { passive: false });
    return () => el.removeEventListener("wheel", on);
  }, [gl, look, enabled, walkEnd]);
  return null;
}

function ProductImage({ url, framed, w = 0.5 }: { url: string; framed?: boolean; w?: number }) {
  const tex = useTexture(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const img = tex.image as { width: number; height: number } | undefined;
  const aspect = img ? img.width / img.height : 1;
  const width = framed ? (aspect > 1.4 ? 0.56 : 0.36) : aspect > 1 ? w : w * aspect;
  const height = width / aspect;
  return (
    <Billboard>
      {framed && (
        <mesh position={[0, 0, -0.005]}>
          <planeGeometry args={[width + 0.06, height + 0.06]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
      )}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={tex} transparent={!framed} alphaTest={framed ? 0 : 0.02} toneMapped={false} />
      </mesh>
    </Billboard>
  );
}

function ProductModel({ url }: { url: string }) {
  const { scene } = useGLTF(url, true);
  const obj = useMemo(() => {
    const s = scene.clone(true);
    const box = new THREE.Box3().setFromObject(s);
    const size = box.getSize(new THREE.Vector3());
    const scale = 0.45 / Math.max(size.x, size.y, size.z || 1);
    s.scale.setScalar(scale);
    const c = box.getCenter(new THREE.Vector3()).multiplyScalar(scale);
    s.position.sub(c);
    return s;
  }, [scene]);
  return <primitive object={obj} />;
}

/** Udhængsskilt, der stikker ud fra væggen, så man kan læse mærket, mens man går ned gennem butikken */
function BladeSign({ x, z, name, eyebrow }: { x: number; z: number; name: string; eyebrow: string }) {
  const tex = signTexture(name, eyebrow);
  return (
    <group position={[x, 3.0, z]}>
      <mesh position={[0, 0.36, 0]}>
        <boxGeometry args={[0.02, 0.22, 0.02]} />
        <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh>
        <boxGeometry args={[1.16, 0.38, 0.03]} />
        <meshStandardMaterial color="#2e2018" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[1.14, 0.356]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.017]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.14, 0.356]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Oplyst niche i væggen bag vitrinen, med mærkets navn over */
function Niche({ slot }: { slot: Slot }) {
  const wx = slot.side * (HALL_HALF - 0.02);
  return (
    <group position={[wx, 0, slot.z]} rotation={[0, slot.rotY, 0]}>
      {/* Lys bagvæg i nichen */}
      <mesh position={[0, 1.7, 0.01]}>
        <planeGeometry args={[NICHE_W, 3.0]} />
        <meshStandardMaterial map={nicheTexture()} emissiveMap={nicheTexture()} emissive="#ffffff" emissiveIntensity={0.18} roughness={0.95} />
      </mesh>
      {/* Messingramme */}
      {[-1, 1].map((k) => (
        <mesh key={k} position={[k * (NICHE_W / 2 + 0.02), 1.7, 0.03]}>
          <boxGeometry args={[0.04, 3.0, 0.04]} />
          <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 3.22, 0.03]}>
        <boxGeometry args={[NICHE_W + 0.08, 0.04, 0.04]} />
        <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Navneskilt over nichen */}
      <mesh position={[0, 3.55, 0.03]}>
        <planeGeometry args={[1.5, 0.47]} />
        <meshBasicMaterial map={signTexture(slot.brand.name, zoneLabels[slot.brand.zone])} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Vitrine({ slot, active, hover, showProduct, still, dragRot, onHover, onSelect }: {
  slot: Slot; active: boolean; hover: boolean; showProduct: boolean; still: boolean; dragRot: React.MutableRefObject<number>;
  onHover: (i: number | null) => void; onSelect: (i: number) => void;
}) {
  const b = slot.brand;
  // Ure står på puden; Rolex- og Tudor-billederne står uændret lidt højere
  const base = still ? 1.32 : 1.24;
  const product = useRef<THREE.Group>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const cone = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state, dt) => {
    const g = product.current;
    if (g && !still) {
      // Løfter sig let og drejer langsomt, når vitrinen er valgt (aldrig for Rolex og Tudor)
      const lift = active ? 0.1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.015 : 0;
      g.position.y += (base + lift - g.position.y) * Math.min(1, dt * 4);
      if (b.model) g.rotation.y = active ? g.rotation.y + dt * 0.35 + dragRot.current : g.rotation.y * 0.95;
      if (active) dragRot.current *= 0.85;
    }
    const target = hover || active ? 1 : 0.45;
    if (glow.current) glow.current.opacity += (target * 0.55 - glow.current.opacity) * Math.min(1, dt * 6);
    if (cone.current) cone.current.opacity += (target * 0.07 - cone.current.opacity) * Math.min(1, dt * 6);
  });
  return (
    <group position={[slot.x, 0, slot.z]} rotation={[0, slot.rotY, 0]}
      onPointerOver={(e) => { e.stopPropagation(); onHover(slot.index); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { onHover(null); document.body.style.cursor = ""; }}
      onClick={(e) => { e.stopPropagation(); onSelect(slot.index); }}>
      {/* Montre: træskab med lys stenplade, som i butikken */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.74, 0.1, 0.74]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.54, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.88, 0.78]} />
        <meshStandardMaterial color="#7e4c2e" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.84, 0.05, 0.84]} />
        <meshStandardMaterial color="#efe6d6" roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial ref={glow} color="#fff6e6" transparent opacity={0.25} depthWrite={false} />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <coneGeometry args={[0.36, 2.7, 24, 1, true]} />
        <meshBasicMaterial ref={cone} color="#fff3dc" transparent opacity={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Glaskasse med fine kanter */}
      <lineSegments position={[0, 1.39, 0]} geometry={GLASS_EDGES}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </lineSegments>
      <mesh position={[0, 1.39, 0]}>
        <boxGeometry args={[0.7, 0.72, 0.7]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.08} roughness={0.02} metalness={0} clearcoat={1} clearcoatRoughness={0.02} reflectivity={0.9} envMapIntensity={2.6} depthWrite={false} />
      </mesh>
      {/* Urpude i ruskind, som uret står på */}
      {!still && b.image && (
        <RoundedBox args={[0.3, 0.09, 0.2]} radius={0.04} smoothness={3} position={[0, 1.075, 0]} castShadow>
          <meshStandardMaterial color="#c9b79e" roughness={1} />
        </RoundedBox>
      )}
      <group ref={product} position={[0, base, 0]}>
        {showProduct && b.model ? (
          <Suspense fallback={null}><ProductModel url={b.model} /></Suspense>
        ) : showProduct && b.image ? (
          <ProductImage url={b.image} framed={b.framed} />
        ) : null}
      </group>
      {/* Messingplade med navnet */}
      <mesh position={[0, 0.8, 0.385]}>
        <boxGeometry args={[0.62, 0.15, 0.012]} />
        <meshStandardMaterial color="#d2b37c" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.8, 0.393]}>
        <planeGeometry args={[0.6, 0.13]} />
        <meshBasicMaterial map={plateTexture(b.name)} transparent toneMapped={false} />
      </mesh>
      {hover && !active && (
        <Html position={[0, 1.95, 0]} center pointerEvents="none" zIndexRange={[20, 10]}>
          <span className="sr3d-label">{b.name}</span>
        </Html>
      )}
    </group>
  );
}

/** Barstol med grønt sæde i læder og træben (som i Rolex-afdelingen) */
function Stool({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.66, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.19, 0.08, 28]} />
        <meshStandardMaterial color="#2f7d52" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.705, 0]}>
        <sphereGeometry args={[0.2, 24, 8, 0, Math.PI * 2, 0, Math.PI / 6]} />
        <meshStandardMaterial color="#2f7d52" roughness={0.55} />
      </mesh>
      {[0, 1, 2, 3].map((k) => {
        const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh key={k} position={[Math.cos(a) * 0.13, 0.31, Math.sin(a) * 0.13]} rotation={[Math.sin(a) * 0.1, 0, -Math.cos(a) * 0.1]}>
            <cylinderGeometry args={[0.018, 0.014, 0.64, 8]} />
            <meshStandardMaterial color="#6e4127" roughness={0.5} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.008, 6, 28]} />
        <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** Rådgivningsbord i træ med stenplade og to grønne stole */
function Counter({ x, z, side }: { x: number; z: number; side: 1 | -1 }) {
  return (
    <group>
      <mesh position={[x, 0.47, z]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.94, 1.5]} />
        <meshStandardMaterial color="#7e4c2e" roughness={0.5} />
      </mesh>
      <mesh position={[x - side * 0.05, 0.965, z]}>
        <boxGeometry args={[0.74, 0.05, 1.6]} />
        <meshStandardMaterial color="#efe6d6" roughness={0.35} />
      </mesh>
      <Stool x={x - side * 0.62} z={z - 0.4} />
      <Stool x={x - side * 0.62} z={z + 0.4} />
    </group>
  );
}

/** Lænestol i mørkegrøn velour */
function Armchair({ x, z, rotY }: { x: number; z: number; rotY: number }) {
  const mat = <meshStandardMaterial color="#1e4636" roughness={0.9} />;
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <RoundedBox args={[0.72, 0.2, 0.66]} radius={0.06} smoothness={3} position={[0, 0.38, 0]} castShadow>{mat}</RoundedBox>
      <RoundedBox args={[0.74, 0.5, 0.16]} radius={0.07} smoothness={3} position={[0, 0.66, -0.27]} rotation={[-0.12, 0, 0]} castShadow>{mat}</RoundedBox>
      {[-1, 1].map((k) => <RoundedBox key={k} args={[0.12, 0.22, 0.6]} radius={0.05} smoothness={3} position={[k * 0.36, 0.52, 0]}>{mat}</RoundedBox>)}
      {[[-0.28, -0.24], [0.28, -0.24], [-0.28, 0.24], [0.28, 0.24]].map(([lx, lz], k) => (
        <mesh key={k} position={[lx, 0.14, lz]}>
          <cylinderGeometry args={[0.02, 0.015, 0.28, 8]} />
          <meshStandardMaterial color="#2a1a10" />
        </mesh>
      ))}
    </group>
  );
}

/** Lounge for enden af butikken: to lænestole og et rundt bord med grøn marmorplade */
function Lounge({ z }: { z: number }) {
  return (
    <group>
      <Armchair x={-0.85} z={z} rotY={Math.PI / 2 - 0.25} />
      <Armchair x={0.85} z={z} rotY={-Math.PI / 2 + 0.25} />
      <mesh position={[0, 0.42, z]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.035, 40]} />
        <meshStandardMaterial color="#2c5a45" roughness={0.25} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.2, z]}>
        <cylinderGeometry args={[0.06, 0.16, 0.4, 20]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Messingportal på tværs af gangen, der markerer en ny zone */
function ZonePortal({ z, zone }: { z: number; zone: ShowroomZone }) {
  const tex = signTexture(zoneLabels[zone], "");
  return (
    <group position={[0, 0, z]}>
      {[-1, 1].map((k) => (
        <mesh key={k} position={[k * (HALL_HALF - 0.12), CEIL / 2, 0]}>
          <boxGeometry args={[0.08, CEIL, 0.08]} />
          <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, CEIL - 0.25, 0]}>
        <boxGeometry args={[HALL_HALF * 2 - 0.2, 0.08, 0.08]} />
        <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, CEIL - 0.62, 0]}>
        <planeGeometry args={[1.9, 0.6]} />
        <meshBasicMaterial map={tex} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Pendant({ z }: { z: number }) {
  return (
    <group position={[0, CEIL, z]}>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.7, 6]} />
        <meshStandardMaterial color={BRASS} />
      </mesh>
      <mesh position={[0, -0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.025, 12, 48]} />
        <meshStandardMaterial color={BRASS} metalness={0.7} roughness={0.25} emissive="#ffdca0" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, -0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.012, 8, 48]} />
        <meshBasicMaterial color="#fff2d6" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Room({ slots, gaps, length, hq }: { slots: Slot[]; gaps: Gap[]; length: number; hq: boolean }) {
  const W = HALL_HALF * 2;
  const floor = useMemo(() => { const t = marbleTexture().clone(); t.needsUpdate = true; t.repeat.set(W / 2, (length + 6) / 2); return t; }, [W, length]);
  const walls = useMemo(() => { const t = walnutTexture().clone(); t.needsUpdate = true; t.repeat.set((length + 6) / 0.96, 1); return t; }, [length]);
  const endWall = useMemo(() => { const t = walnutTexture().clone(); t.needsUpdate = true; t.repeat.set(W / 0.96, 1); return t; }, [W]);
  const zMid = -(length - 3) / 2;
  const L = length + 6;
  const pendants = useMemo(() => { const a: number[] = []; for (let z = -3; z > -length; z -= 5.5) a.push(z); return a; }, [length]);
  return (
    <>
      {/* Travertingulv */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, zMid]} receiveShadow>
        <planeGeometry args={[W, L]} />
        {hq ? (
          <MeshReflectorMaterial map={floor} blur={[400, 120]} resolution={512} mixBlur={1} mixStrength={0.5} mirror={0.3}
            roughness={0.5} depthScale={0.6} minDepthThreshold={0.4} maxDepthThreshold={1.3} metalness={0.05} color="#ffffff" />
        ) : (
          <meshStandardMaterial map={floor} roughness={0.3} metalness={0.02} envMapIntensity={1.1} />
        )}
      </mesh>
      {/* Løber ned gennem gangen med messingkant */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, zMid]}>
        <planeGeometry args={[1.5, L - 3]} />
        <meshStandardMaterial color="#cdbfae" roughness={1} />
      </mesh>
      {[-1, 1].map((k) => (
        <mesh key={k} rotation={[-Math.PI / 2, 0, 0]} position={[k * 0.8, 0.005, zMid]}>
          <planeGeometry args={[0.04, L - 3]} />
          <meshStandardMaterial color={BRASS} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {/* Vægge med træ-lameller */}
      {[-1, 1].map((k) => (
        <mesh key={k} position={[k * HALL_HALF, CEIL / 2, zMid]} rotation={[0, -k * Math.PI / 2, 0]}>
          <planeGeometry args={[L, CEIL]} />
          <meshStandardMaterial map={walls} bumpMap={walls} bumpScale={4} roughness={0.6} />
        </mesh>
      ))}
      {/* Endevæg med navnet */}
      <mesh position={[0, CEIL / 2, -length - 0.5]}>
        <planeGeometry args={[W, CEIL]} />
        <meshStandardMaterial map={endWall} bumpMap={endWall} bumpScale={4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.2, -length - 0.48]}>
        <planeGeometry args={[2.6, 0.81]} />
        <meshBasicMaterial map={signTexture("Knud Pedersen", "Skt. Clemens Torv · Aarhus")} toneMapped={false} />
      </mesh>
      <mesh position={[0, CEIL / 2, 2.5]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, CEIL]} />
        <meshStandardMaterial map={endWall} roughness={0.6} />
      </mesh>
      {/* Loft med lysliste langs begge sider */}
      <mesh position={[0, CEIL, zMid]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial color="#f3ede4" roughness={1} />
      </mesh>
      {[-1, 1].map((k) => (
        <mesh key={k} position={[k * (HALL_HALF - 0.25), CEIL - 0.01, zMid]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.06, L]} />
          <meshBasicMaterial color="#fff3dc" toneMapped={false} />
        </mesh>
      ))}
      {pendants.map((z) => <Pendant key={z} z={z} />)}
      {slots.map((s) => <Niche key={s.brand.slug} slot={s} />)}
      {slots.map((s) => (
        <BladeSign key={s.brand.slug} x={s.side * (HALL_HALF - 0.62)} z={s.z} name={s.brand.name} eyebrow={zoneLabels[s.brand.zone]} />
      ))}
      {gaps.map((g) => <ZonePortal key={g.zone} z={g.z} zone={g.zone} />)}
      {gaps.map((g) => <Counter key={"c" + g.zone} x={g.side * (HALL_HALF - 0.45)} z={g.z - 0.9} side={g.side} />)}
      <Lounge z={-length + 1.3} />
    </>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    if (++frames.current > 3) { done.current = true; onReady(); }
  });
  return null;
}

/** Ét rigtigt spotlys, der følger det mærke, man peger på eller har valgt */
function MovingSpot({ slot }: { slot: Slot | null }) {
  const light = useRef<THREE.SpotLight>(null);
  const tgt = useMemo(() => new THREE.Object3D(), []);
  useFrame((_, dt) => {
    const l = light.current;
    if (!l) return;
    const want = slot ? 22 : 0;
    l.intensity += (want - l.intensity) * Math.min(1, dt * 5);
    if (slot) {
      l.position.set(slot.x - slot.side * 0.7, 3.8, slot.z);
      tgt.position.set(slot.x, 1.1, slot.z);
      tgt.updateMatrixWorld();
    }
  });
  return (
    <>
      <primitive object={tgt} />
      <spotLight ref={light} angle={0.34} penumbra={0.7} intensity={0} distance={7} decay={1.4} color="#fff1da" target={tgt} />
    </>
  );
}

export default function ShowroomScene({ brands, active, hover, lookAngle, mobile, current, onHover, onSelect, onReady, paused, calm }: SceneProps) {
  const { slots, gaps, length, walkEnd } = useMemo(() => layout(brands), [brands]);
  const dragRot = useRef(0);
  const look = useRef<Look>({ s: 0, dir: 1, pitch: 0, step: 0, touched: false, dragging: false, lastX: 0, lastY: 0 });
  const bySlot = (i: number | null) => (i == null ? null : slots.find((s) => s.index === i) ?? null);

  const pose = useMemo<Pose | null>(() => {
    const a = bySlot(active);
    if (a) return focusPose(a, mobile, mobile);
    if (mobile) { const c = bySlot(current); if (c) return focusPose(c, true); }
    if (lookAngle != null) return overviewPose(Math.min(walkEnd, lookAngle));
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, lookAngle, mobile, current, slots, walkEnd]);

  const start = mobile ? focusPose(slots[0], true) : overviewPose(0);
  const near = (i: number) => {
    if (!mobile) return true;
    const a = slots.findIndex((s) => s.index === current);
    const b = slots.findIndex((s) => s.index === i);
    return Math.abs(a - b) <= 2;
  };

  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: start.pos, fov: mobile ? 52 : 50, near: 0.1, far: 60 }}
      onCreated={({ camera }) => camera.lookAt(...start.target)}
      gl={{ antialias: !mobile, powerPreference: "high-performance" }}
      onPointerDown={(e) => { const L = look.current; L.dragging = true; L.touched = true; L.lastX = e.clientX; L.lastY = e.clientY; }}
      onPointerUp={() => { look.current.dragging = false; }}
      onPointerLeave={() => { look.current.dragging = false; }}
      onPointerMove={(e) => {
        const L = look.current;
        if (!L.dragging || e.pointerType === "touch") return;
        const dx = e.clientX - L.lastX, dy = e.clientY - L.lastY;
        L.lastX = e.clientX; L.lastY = e.clientY;
        if (active != null) { dragRot.current = dx * 0.004; return; }
        // Træk mod venstre = gå frem
        L.s -= dx * 0.012; if (dx) L.dir = dx < 0 ? 1 : -1;
        L.pitch = Math.max(-0.12, Math.min(0.12, L.pitch + dy * 0.0012));
      }}
      onPointerMissed={() => onHover(null)}
    >
      <color attach="background" args={["#2e2219"]} />
      <fog attach="fog" args={["#3a2b20", 16, 34]} />
      <ambientLight intensity={0.7} color="#fff3e2" />
      <hemisphereLight args={["#fff6e8", "#8a7560", 0.55]} />
      <directionalLight position={[0, 6, 2]} intensity={0.45} color="#fff0da" />
      <Environment resolution={mobile ? 64 : 256} frames={1}>
        {/* Blødt butikslys uden at hente en HDRI udefra */}
        <Lightformer form="rect" intensity={2.4} position={[0, 5, -6]} scale={[6, 20, 1]} rotation-x={Math.PI / 2} color="#fff3e0" />
        <Lightformer form="rect" intensity={1.2} position={[-4, 2, -6]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} color="#ffe9c8" />
        <Lightformer form="rect" intensity={1.2} position={[4, 2, -6]} rotation-y={-Math.PI / 2} scale={[20, 2, 1]} color="#ffe9c8" />
      </Environment>
      <Suspense fallback={null}>
        <Room slots={slots} gaps={gaps} length={length} hq={!mobile} />
        {slots.map((s) => (
          <Vitrine key={s.brand.slug} slot={s} active={active === s.index} hover={hover === s.index}
            showProduct={near(s.index)} still={!!s.brand.framed} dragRot={dragRot}
            onHover={onHover} onSelect={onSelect} />
        ))}
        <MovingSpot slot={bySlot(hover ?? active)} />
        <ContactShadows position={[0, 0.006, -(length - 3) / 2]} scale={[HALL_HALF * 2, length + 3]} resolution={mobile ? 256 : 1024} blur={2.2} opacity={0.4} far={1.2} frames={1} color="#3a2a1a" />
        <Ready onReady={onReady} />
      </Suspense>
      {!mobile && (
        <EffectComposer multisampling={4} enableNormalPass={false}>
          <N8AO aoRadius={0.7} intensity={2.2} distanceFalloff={0.6} halfRes quality="medium" color="#1c120a" />
          <Bloom mipmapBlur luminanceThreshold={0.92} luminanceSmoothing={0.2} intensity={0.45} />
          <Vignette offset={0.32} darkness={0.55} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
      <WheelWalk look={look} enabled={active == null && !mobile} walkEnd={walkEnd} />
      <CameraRig pose={pose} overview={active == null && !mobile} look={look} auto={active == null && !mobile && !calm} walkEnd={walkEnd} />
    </Canvas>
  );
}
