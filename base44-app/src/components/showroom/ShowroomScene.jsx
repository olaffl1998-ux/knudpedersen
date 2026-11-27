"use client";
import { Suspense, createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, ContactShadows, Environment, Html, Lightformer, MeshReflectorMaterial, PerformanceMonitor, RoundedBox, useGLTF, useTexture } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, ToneMapping, Vignette } from "@react-three/postprocessing";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import "./r3f-compat";
import { zoneLabels } from "@/data/brands";
import { FRONT_Z, ROOM_HALF, focusPose, layout, overviewPose } from "./geometry";
const BRASS = "#b8955e";
const WALNUT = "#4a3427";
const CEIL = 4.0;
const NICHE_W = 1.7;
const fonts = () => ({
    display: getComputedStyle(document.body).getPropertyValue("--font-display").trim() || "Georgia, serif",
    body: getComputedStyle(document.body).getPropertyValue("--font-body").trim() || "sans-serif",
});
const spaced = (s) => s.toUpperCase().split("").join(String.fromCharCode(8202));
function canvasTex(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"));
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
}
const cache = new Map();
function cached(key, make) {
    let t = cache.get(key);
    if (!t) {
        t = make();
        cache.set(key, t);
    }
    return t;
}
/** Rigtige materialer (CC0 fra Poly Haven): travertin, valnød, velour og kalkpuds.
    Hentes én gang (ca. 280 kB i alt) og deles af alle møbler */
const TEX = "/showroom/tex/";
const PBR_FILES = {
    stone: ["marble_01_diff", "marble_01_nor", "marble_01_rough"],
    walnut: ["walnut_veneer_diff", "walnut_veneer_nor", "walnut_veneer_rough"],
    velvet: [null, "velour_velvet_nor", "velour_velvet_rough"],
    plaster: [null, "beige_wall_001_nor", "beige_wall_001_rough"],
};
const PBR_URLS = {};
for (const [k, files] of Object.entries(PBR_FILES))
    files.forEach((f, i) => { if (f)
        PBR_URLS[`${k}${i}`] = `${TEX}${f}.webp`; });
if (typeof window !== "undefined")
    useTexture.preload(Object.values(PBR_URLS));
const PbrCtx = createContext(null);
function PbrProvider({ children }) {
    const t = useTexture(PBR_URLS);
    useMemo(() => {
        for (const [k, tex] of Object.entries(t)) {
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            tex.anisotropy = 8;
            tex.colorSpace = k.endsWith("0") ? THREE.SRGBColorSpace : THREE.NoColorSpace;
            tex.needsUpdate = true;
        }
    }, [t]);
    return <PbrCtx.Provider value={t}>{children}</PbrCtx.Provider>;
}
/** Kort til ét materiale med egen gentagelse (kopierne deler billedet på grafikkortet) */
function useMaps(kind, rx, ry, ox = 0, oy = 0) {
    const t = useContext(PbrCtx);
    return useMemo(() => {
        const c = (i) => {
            const src = t[`${kind}${i}`];
            if (!src)
                return undefined;
            const x = src.clone();
            x.repeat.set(rx, ry);
            x.offset.set(ox, oy);
            x.needsUpdate = true;
            return x;
        };
        return { map: c(0), normalMap: c(1), roughnessMap: c(2) };
    }, [t, kind, rx, ry, ox, oy]);
}
/** Messingpladen på soklen */
function plateTexture(name) {
    return cached("plate:" + name, () => canvasTex(1024, 220, (ctx) => {
        const { display } = fonts();
        let size = 120;
        ctx.font = `400 ${size}px ${display}`;
        while (ctx.measureText(name).width > 940 && size > 40) {
            size -= 6;
            ctx.font = `400 ${size}px ${display}`;
        }
        ctx.fillStyle = "#2a2016";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(name, 512, 116);
    }));
}
/** Skilt i messing på mørk valnød: bruges både som udhængsskilt og over nichen */
function signTexture(name, eyebrow) {
    return cached("sign:" + name + eyebrow, () => canvasTex(1024, 320, (ctx) => {
        const { display, body } = fonts();
        const g = ctx.createLinearGradient(0, 0, 0, 320);
        g.addColorStop(0, "#3d2b20");
        g.addColorStop(1, "#2e2018");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 1024, 320);
        ctx.strokeStyle = "#c9a56b";
        ctx.lineWidth = 5;
        ctx.strokeRect(16, 16, 992, 288);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (eyebrow) {
            ctx.fillStyle = "#b89a6a";
            ctx.font = `500 30px ${body}`;
            ctx.fillText(spaced(eyebrow), 512, 76);
        }
        let size = 132;
        ctx.font = `400 ${size}px ${display}`;
        while (ctx.measureText(name).width > 900 && size > 50) {
            size -= 6;
            ctx.font = `400 ${size}px ${display}`;
        }
        ctx.fillStyle = "#e9d3a6";
        ctx.fillText(name, 512, eyebrow ? 186 : 160);
    }));
}
/** Bagvæggen i nichen: lyst kalkpuds med et lysfald fra spottet ovenover, ligesom i en rigtig butik */
function nicheTexture() {
    return cached("niche", () => canvasTex(256, 512, (ctx) => {
        ctx.fillStyle = "#ddd0bb";
        ctx.fillRect(0, 0, 256, 512);
        for (let y = 0; y < 512; y += 3) {
            ctx.fillStyle = `rgba(${y % 9 ? "180,160,130" : "255,250,240"},.07)`;
            ctx.fillRect(0, y, 256, 1 + (y % 5));
        }
        const g = ctx.createRadialGradient(128, 40, 4, 128, 120, 300);
        g.addColorStop(0, "rgba(255,246,228,1)");
        g.addColorStop(0.35, "rgba(250,236,210,.85)");
        g.addColorStop(1, "rgba(250,236,210,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 256, 512);
        const v = ctx.createLinearGradient(0, 0, 0, 512);
        v.addColorStop(0, "rgba(0,0,0,0)");
        v.addColorStop(1, "rgba(60,40,25,.25)");
        ctx.fillStyle = v;
        ctx.fillRect(0, 0, 256, 512);
    }));
}
/** Blød skygge under møblerne, så de står på gulvet */
function blobTexture() {
    return cached("blob", () => canvasTex(128, 128, (ctx) => {
        const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
        g.addColorStop(0, "rgba(30,18,8,.75)");
        g.addColorStop(0.5, "rgba(30,18,8,.35)");
        g.addColorStop(1, "rgba(30,18,8,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);
    }));
}
function Blob({ w, d, opacity = 0.55, y = 0.004 }) {
    return (<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} renderOrder={1}>
      <planeGeometry args={[w, d]}/>
      <meshBasicMaterial map={blobTexture()} transparent opacity={opacity} depthWrite={false}/>
    </mesh>);
}
function poolTexture() {
    return cached("pool", () => canvasTex(128, 128, (ctx) => {
        const g = ctx.createRadialGradient(64, 40, 2, 64, 56, 64);
        g.addColorStop(0, "rgba(255,232,190,.55)");
        g.addColorStop(1, "rgba(255,232,190,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);
    }));
}
/** Mønstret tæppe med kant, som i loungen */
function rugTexture() {
    return cached("rug", () => canvasTex(1024, 1024, (ctx) => {
        ctx.fillStyle = "#2f4a3c";
        ctx.fillRect(0, 0, 1024, 1024);
        ctx.fillStyle = "#c9b48e";
        ctx.fillRect(28, 28, 968, 968);
        ctx.fillStyle = "#2f4a3c";
        ctx.fillRect(44, 44, 936, 936);
        ctx.fillStyle = "#e4d8c2";
        ctx.fillRect(84, 84, 856, 856);
        ctx.strokeStyle = "rgba(47,74,60,.35)";
        ctx.lineWidth = 2;
        for (let i = 0; i < 20; i++) {
            const k = 84 + i * 45;
            ctx.beginPath();
            ctx.moveTo(k, 84);
            ctx.lineTo(84, k);
            ctx.moveTo(940 - (i * 45), 940);
            ctx.lineTo(940, 940 - i * 45);
            ctx.stroke();
        }
        for (let i = 0; i < 6000; i++) {
            ctx.fillStyle = `rgba(${i % 2 ? "255,255,255" : "60,50,40"},.05)`;
            ctx.fillRect((i * 97) % 1024, (i * 211) % 1024, 2, 2);
        }
    }));
}
/** Fin messingramme om glasset: 12 smalle profiler samlet i én geometri */
const GLASS_FRAME = (() => {
    const w = 0.7, h = 0.72, t = 0.014, parts = [];
    for (const sx of [-1, 1])
        for (const sz of [-1, 1])
            parts.push(new THREE.BoxGeometry(t, h, t).translate(sx * w / 2, 0, sz * w / 2));
    for (const y of [-h / 2, h / 2])
        for (const s of [-1, 1]) {
            parts.push(new THREE.BoxGeometry(w + t, t, t).translate(0, y, s * w / 2));
            parts.push(new THREE.BoxGeometry(t, t, w + t).translate(s * w / 2, y, 0));
        }
    return mergeGeometries(parts);
})();
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Kameraet: i gåturen går man langsomt rundt i butikken.
    Træk eller scroll for selv at gå frem og tilbage. Ved klik går man hen foran vitrinen (1,2 sek., ease-in-out). */
function CameraRig({ pose, overview, look, auto, loop }) {
    const { camera } = useThree();
    const cur = useRef({ target: new THREE.Vector3(...overviewPose(loop, 0).target) });
    const anim = useRef(null);
    const tmp = useMemo(() => ({ p: new THREE.Vector3(), t: new THREE.Vector3() }), []);
    useEffect(() => {
        if (!pose)
            return;
        anim.current = { t: 0, fromP: camera.position.clone(), fromT: cur.current.target.clone(), toP: new THREE.Vector3(...pose.pos), toT: new THREE.Vector3(...pose.target), walk: pose.walk };
    }, [pose, camera]);
    useFrame((_, rawDt) => {
        const dt = Math.min(rawDt, 0.1);
        const cam = camera;
        const a = anim.current;
        const L = look.current;
        if (a) {
            a.t = Math.min(1, a.t + dt / 1.2);
            const k = ease(a.t);
            cam.position.lerpVectors(a.fromP, a.toP, k);
            cur.current.target.lerpVectors(a.fromT, a.toT, k);
            cam.lookAt(cur.current.target);
            if (a.t >= 1) {
                anim.current = null;
                if (a.walk != null) {
                    L.s = a.walk;
                    L.dir = 1;
                }
            }
        }
        else if (overview) {
            // Rundturen fortsætter i ring: når man er hele vejen rundt, er man tilbage ved indgangen
            if (auto && !L.touched) {
                L.s += dt * 0.42;
                L.dir = 1;
                L.step += dt;
            }
            const p = overviewPose(loop, L.s, L.dir);
            // Et ganske let skridt-vip, når man går
            const bob = auto && !L.touched ? Math.sin(L.step * 4.2) * 0.01 : 0;
            cam.position.lerp(tmp.p.set(p.pos[0], p.pos[1] + bob, p.pos[2]), Math.min(1, dt * 5));
            cur.current.target.lerp(tmp.t.set(p.target[0], p.target[1] + L.pitch * 3, p.target[2]), Math.min(1, dt * 2.2));
            cam.lookAt(cur.current.target);
        }
    });
    return null;
}
/** Scroll med hjulet går rundt i butikken, når man har rørt scenen. Efter én runde (eller tilbage ved indgangen) ruller siden videre */
function WheelWalk({ look, enabled, walkEnd }) {
    const { gl } = useThree();
    useEffect(() => {
        const el = gl.domElement;
        const on = (e) => {
            const L = look.current;
            if (!enabled || !L.touched)
                return;
            const s0 = ((L.s % walkEnd) + walkEnd) % walkEnd;
            const next = Math.max(0, Math.min(walkEnd, s0 + Math.sign(e.deltaY) * 0.7));
            if (next === s0)
                return;
            e.preventDefault();
            L.s = next;
            L.dir = e.deltaY > 0 ? 1 : -1;
        };
        el.addEventListener("wheel", on, { passive: false });
        return () => el.removeEventListener("wheel", on);
    }, [gl, look, enabled, walkEnd]);
    return null;
}
function ProductImage({ url, framed, w = 0.5 }) {
    const tex = useTexture(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const img = tex.image;
    const aspect = img ? img.width / img.height : 1;
    const width = framed ? (aspect > 1.4 ? 0.56 : 0.36) : aspect > 1 ? w : w * aspect;
    const height = width / aspect;
    return (<Billboard>
      {framed && (<mesh position={[0, 0, -0.005]}>
          <planeGeometry args={[width + 0.06, height + 0.06]}/>
          <meshStandardMaterial color="#ffffff" roughness={0.9}/>
        </mesh>)}
      <mesh>
        <planeGeometry args={[width, height]}/>
        <meshBasicMaterial map={tex} transparent={!framed} alphaTest={framed ? 0 : 0.02} toneMapped={false}/>
      </mesh>
    </Billboard>);
}
function ProductModel({ url }) {
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
    return <primitive object={obj}/>;
}
/** Udhængsskilt, der stikker ud fra væggen, så man kan læse mærket, mens man går ned gennem butikken */
function BladeSign({ x, z, rotY, name, eyebrow }) {
    const tex = signTexture(name, eyebrow);
    return (<group position={[x, 3.0, z]} rotation={[0, rotY + Math.PI / 2, 0]}>
      <mesh position={[0, 0.36, 0]}>
        <boxGeometry args={[0.02, 0.22, 0.02]}/>
        <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.35}/>
      </mesh>
      <mesh>
        <boxGeometry args={[1.16, 0.38, 0.03]}/>
        <meshStandardMaterial color="#2e2018" roughness={0.6}/>
      </mesh>
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[1.14, 0.356]}/>
        <meshBasicMaterial map={tex} toneMapped={false}/>
      </mesh>
      <mesh position={[0, 0, -0.017]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.14, 0.356]}/>
        <meshBasicMaterial map={tex} toneMapped={false}/>
      </mesh>
    </group>);
}
/** Oplyst niche i væggen bag vitrinen, med mærkets navn over */
function Niche({ slot }) {
    return (<group position={[slot.wx + slot.nx * 0.045, 0, slot.wz + slot.nz * 0.045]} rotation={[0, slot.rotY, 0]}>
      {/* Lys bagvæg i nichen */}
      <mesh position={[0, 1.7, 0.01]}>
        <planeGeometry args={[NICHE_W, 3.0]}/>
        <meshStandardMaterial map={nicheTexture()} emissiveMap={nicheTexture()} emissive="#ffffff" emissiveIntensity={0.22} roughness={1}/>
      </mesh>
      {/* Messingramme */}
      {[-1, 1].map((k) => (<mesh key={k} position={[k * (NICHE_W / 2 + 0.02), 1.7, 0.03]}>
          <boxGeometry args={[0.04, 3.0, 0.04]}/>
          <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.35}/>
        </mesh>))}
      <mesh position={[0, 3.22, 0.03]}>
        <boxGeometry args={[NICHE_W + 0.08, 0.04, 0.04]}/>
        <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.35}/>
      </mesh>
      {/* Lyset fra spottet falder ud på gulvet foran nichen */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 1.0]}>
        <planeGeometry args={[2.4, 2.0]}/>
        <meshBasicMaterial map={poolTexture()} transparent opacity={0.5} depthWrite={false} toneMapped={false}/>
      </mesh>
      {/* Navneskilt over nichen */}
      <mesh position={[0, 3.55, 0.03]}>
        <planeGeometry args={[1.5, 0.47]}/>
        <meshBasicMaterial map={signTexture(slot.brand.name, zoneLabels[slot.brand.zone])} toneMapped={false}/>
      </mesh>
    </group>);
}
function Vitrine({ slot, active, hover, showProduct, still, dragRot, onHover, onSelect }) {
    const b = slot.brand;
    // Ure står på puden; Rolex- og Tudor-billederne står uændret lidt højere
    const base = still ? 1.32 : 1.24;
    const product = useRef(null);
    const wood = useMaps("walnut", 0.5, 0.6);
    const velvet = useMaps("velvet", 1, 1);
    const stone = useMaps("stone", 0.2, 0.2, 0.04 + (slot.index % 3) * 0.25, 0.04);
    const glow = useRef(null);
    const cone = useRef(null);
    useFrame((state, dt) => {
        const g = product.current;
        if (g && !still) {
            // Løfter sig let og drejer langsomt, når vitrinen er valgt (aldrig for Rolex og Tudor)
            const lift = active ? 0.1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.015 : 0;
            g.position.y += (base + lift - g.position.y) * Math.min(1, dt * 4);
            if (b.model)
                g.rotation.y = active ? g.rotation.y + dt * 0.35 + dragRot.current : g.rotation.y * 0.95;
            if (active)
                dragRot.current *= 0.85;
        }
        const target = hover || active ? 1 : 0.45;
        if (glow.current)
            glow.current.opacity += (target * 0.55 - glow.current.opacity) * Math.min(1, dt * 6);
        if (cone.current)
            cone.current.opacity += (target * 0.07 - cone.current.opacity) * Math.min(1, dt * 6);
    });
    return (<group position={[slot.x, 0, slot.z]} rotation={[0, slot.rotY, 0]} onPointerOver={(e) => { e.stopPropagation(); onHover(slot.index); document.body.style.cursor = "pointer"; }} onPointerOut={() => { onHover(null); document.body.style.cursor = ""; }} onClick={(e) => { e.stopPropagation(); onSelect(slot.index); }}>
      <Blob w={1.4} d={1.4} opacity={0.6}/>
      {/* Montre: træskab med lys stenplade, som i butikken */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.72, 0.1, 0.72]}/>
        <meshStandardMaterial color="#1a100a" roughness={0.6}/>
      </mesh>
      <RoundedBox args={[0.78, 0.88, 0.78]} radius={0.012} smoothness={2} position={[0, 0.54, 0]}>
        <meshStandardMaterial {...wood} color="#b08a68" roughness={0.9} envMapIntensity={1}/>
      </RoundedBox>
      <RoundedBox args={[0.84, 0.05, 0.84]} radius={0.01} smoothness={2} position={[0, 1.0, 0]}>
        <meshStandardMaterial {...stone} color="#fbf6ee" roughness={1} envMapIntensity={1.1}/>
      </RoundedBox>
      {/* Indbygget spot i loftet over vitrinen */}
      <mesh position={[0, CEIL - 0.006, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.07, 24]}/>
        <meshBasicMaterial color="#fff4dc" toneMapped={false}/>
      </mesh>
      <mesh position={[0, CEIL - 0.004, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.07, 0.095, 24]}/>
        <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.3}/>
      </mesh>
      <mesh position={[0, 1.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 32]}/>
        <meshBasicMaterial ref={glow} color="#fff6e6" transparent opacity={0.25} depthWrite={false}/>
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <coneGeometry args={[0.36, 2.7, 24, 1, true]}/>
        <meshBasicMaterial ref={cone} color="#fff3dc" transparent opacity={0.05} side={THREE.DoubleSide} depthWrite={false}/>
      </mesh>
      {/* Glaskasse med fin messingramme. Glasset spejler butikkens lys */}
      <mesh position={[0, 1.39, 0]} geometry={GLASS_FRAME}>
        <meshStandardMaterial color="#e0c088" metalness={0.8} roughness={0.28} envMapIntensity={2}/>
      </mesh>
      <mesh position={[0, 1.39, 0]}>
        <boxGeometry args={[0.7, 0.72, 0.7]}/>
        <meshPhysicalMaterial color="#f4fbff" transparent opacity={0.1} roughness={0} metalness={0} ior={1.5} specularIntensity={1} clearcoat={1} clearcoatRoughness={0} envMapIntensity={3} depthWrite={false}/>
      </mesh>
      {/* Urpude i ruskind, som uret står på */}
      {!still && b.image && (<RoundedBox args={[0.3, 0.09, 0.2]} radius={0.04} smoothness={3} position={[0, 1.075, 0]} castShadow>
          <meshStandardMaterial {...velvet} color="#cdbca2" roughness={1}/>
        </RoundedBox>)}
      <group ref={product} position={[0, base, 0]}>
        {showProduct && b.model ? (<Suspense fallback={null}><ProductModel url={b.model}/></Suspense>) : showProduct && b.image ? (<ProductImage url={b.image} framed={b.framed}/>) : null}
      </group>
      {/* Messingplade med navnet */}
      <mesh position={[0, 0.8, 0.385]}>
        <boxGeometry args={[0.62, 0.15, 0.012]}/>
        <meshStandardMaterial color="#d6b67e" metalness={0.45} roughness={0.35} envMapIntensity={1.2}/>
      </mesh>
      <mesh position={[0, 0.8, 0.393]}>
        <planeGeometry args={[0.6, 0.13]}/>
        <meshBasicMaterial map={plateTexture(b.name)} transparent toneMapped={false}/>
      </mesh>
      {hover && !active && (<Html position={[0, 1.95, 0]} center pointerEvents="none" zIndexRange={[20, 10]}>
          <span className="sr3d-label">{b.name}</span>
        </Html>)}
    </group>);
}
/** Barstol med grønt sæde i læder og træben (som i Rolex-afdelingen). Benene spreder sig ud mod gulvet */
function Stool({ x, z }) {
    const velvet = useMaps("velvet", 1.5, 1.5);
    const wood = useMaps("walnut", 0.05, 0.6);
    const legs = [0, 1, 2, 3].map((k) => {
        const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
        const top = new THREE.Vector3(Math.cos(a) * 0.11, 0.63, Math.sin(a) * 0.11);
        const foot = new THREE.Vector3(Math.cos(a) * 0.17, 0, Math.sin(a) * 0.17);
        const mid = top.clone().add(foot).multiplyScalar(0.5);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), top.clone().sub(foot).normalize());
        return { mid, q, len: top.distanceTo(foot), foot };
    });
    return (<group position={[x, 0, z]}>
      <Blob w={0.62} d={0.62} opacity={0.7}/>
      <mesh position={[0, 0.67, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.08, 28]}/>
        <meshStandardMaterial {...velvet} color="#2c7a50" roughness={1}/>
      </mesh>
      <mesh position={[0, 0.71, 0]}>
        <sphereGeometry args={[0.2, 24, 8, 0, Math.PI * 2, 0, Math.PI / 6]}/>
        <meshStandardMaterial {...velvet} color="#2c7a50" roughness={1}/>
      </mesh>
      {legs.map((l, k) => (<group key={k}>
          <mesh position={l.mid} quaternion={l.q}>
            <cylinderGeometry args={[0.017, 0.014, l.len, 8]}/>
            <meshStandardMaterial {...wood} color="#8a5434" roughness={0.8}/>
          </mesh>
          {/* Filtdup under benet */}
          <mesh position={[l.foot.x, 0.006, l.foot.z]}>
            <cylinderGeometry args={[0.02, 0.02, 0.012, 8]}/>
            <meshStandardMaterial color="#2a1a10" roughness={0.9}/>
          </mesh>
        </group>))}
      <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.152, 0.008, 6, 28]}/>
        <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.35}/>
      </mesh>
    </group>);
}
/** Rådgivningsbord i træ med stenplade og to grønne stole. Over bordet hænger zonens navn på væggen */
function Counter({ gap }) {
    const wood = useMaps("walnut", 1, 0.6);
    const stone = useMaps("stone", 0.4, 0.2, 0.05, 0.3);
    return (<group position={[gap.wx + gap.nx * 0.5, 0, gap.wz + gap.nz * 0.5]} rotation={[0, gap.rotY, 0]}>
      <Blob w={2.0} d={1.1} opacity={0.6}/>
      <RoundedBox args={[1.5, 0.94, 0.6]} radius={0.012} smoothness={2} position={[0, 0.47, 0]}>
        <meshStandardMaterial {...wood} color="#b08a68" roughness={0.9}/>
      </RoundedBox>
      <RoundedBox args={[1.6, 0.05, 0.74]} radius={0.01} smoothness={2} position={[0, 0.965, 0.05]}>
        <meshStandardMaterial {...stone} color="#fbf6ee" roughness={1}/>
      </RoundedBox>
      {/* Bordlampe i messing */}
      <mesh position={[0.55, 1.12, -0.1]}>
        <cylinderGeometry args={[0.012, 0.05, 0.26, 12]}/>
        <meshStandardMaterial color={BRASS} metalness={0.7} roughness={0.3}/>
      </mesh>
      <mesh position={[0.55, 1.3, -0.1]}>
        <cylinderGeometry args={[0.07, 0.11, 0.12, 20, 1, true]}/>
        <meshStandardMaterial color="#f3e6cc" emissive="#ffdca0" emissiveIntensity={0.6} side={THREE.DoubleSide}/>
      </mesh>
      <Stool x={-0.4} z={0.75}/>
      <Stool x={0.4} z={0.75}/>
      <mesh position={[0, 2.7, -0.45]}>
        <planeGeometry args={[1.9, 0.6]}/>
        <meshBasicMaterial map={signTexture(zoneLabels[gap.zone], "")} toneMapped={false}/>
      </mesh>
    </group>);
}
/** Lænestol i mørkegrøn velour */
function Armchair({ x, z, rotY }) {
    const velvet = useMaps("velvet", 2, 2);
    const mat = <meshStandardMaterial {...velvet} color="#1f4a38" roughness={1}/>;
    return (<group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <Blob w={1.1} d={1.0} opacity={0.65}/>
      <RoundedBox args={[0.72, 0.2, 0.66]} radius={0.06} smoothness={3} position={[0, 0.38, 0]} castShadow>{mat}</RoundedBox>
      <RoundedBox args={[0.74, 0.5, 0.16]} radius={0.07} smoothness={3} position={[0, 0.66, -0.27]} rotation={[-0.12, 0, 0]} castShadow>{mat}</RoundedBox>
      {[-1, 1].map((k) => <RoundedBox key={k} args={[0.12, 0.22, 0.6]} radius={0.05} smoothness={3} position={[k * 0.36, 0.52, 0]}>{mat}</RoundedBox>)}
      {[[-0.28, -0.24], [0.28, -0.24], [-0.28, 0.24], [0.28, 0.24]].map(([lx, lz], k) => (<mesh key={k} position={[lx, 0.14, lz]}>
          <cylinderGeometry args={[0.02, 0.015, 0.28, 8]}/>
          <meshStandardMaterial color="#2a1a10"/>
        </mesh>))}
    </group>);
}
/** Svigermors tunge (Sansevieria) i stenkrukke: lange, spidse blade */
const BLADE = new THREE.ConeGeometry(0.045, 1, 5, 1).scale(1, 1, 0.22).translate(0, 0.5, 0);
function Plant({ x, z, s = 1 }) {
    const ref = useRef(null);
    const n = 22;
    useLayoutEffect(() => {
        const m = ref.current;
        if (!m)
            return;
        let seed = Math.round((x * 31 + z * 17) * 100) || 7;
        const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
        const o = new THREE.Object3D(), c = new THREE.Color();
        for (let i = 0; i < n; i++) {
            const a = rnd() * Math.PI * 2, r = rnd() * 0.13;
            o.position.set(Math.cos(a) * r, 0.56, Math.sin(a) * r);
            o.rotation.set(Math.sin(a) * (0.05 + r * 1.2), rnd() * Math.PI, -Math.cos(a) * (0.05 + r * 1.2));
            o.scale.set(0.8 + rnd() * 0.6, 0.55 + rnd() * 0.75, 1);
            o.updateMatrix();
            m.setMatrixAt(i, o.matrix);
            m.setColorAt(i, c.setHSL(0.27 + rnd() * 0.05, 0.35 + rnd() * 0.15, 0.17 + rnd() * 0.1));
        }
        m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor)
            m.instanceColor.needsUpdate = true;
    }, [x, z]);
    return (<group position={[x, 0, z]} scale={s}>
      <Blob w={0.9} d={0.9} opacity={0.6}/>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.24, 0.2, 0.6, 32]}/>
        <meshStandardMaterial color="#d9d0c2" roughness={0.55}/>
      </mesh>
      <mesh position={[0, 0.585, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.225, 24]}/>
        <meshStandardMaterial color="#3a2a1e" roughness={1}/>
      </mesh>
      <instancedMesh ref={ref} args={[BLADE, undefined, n]} frustumCulled={false}>
        <meshStandardMaterial roughness={0.45} side={THREE.DoubleSide}/>
      </instancedMesh>
    </group>);
}
/** Lounge i midten: to lænestole og et rundt bord med grøn marmorplade og en buket */
function Lounge({ x, z, turn = 0 }) {
    return (<group position={[x, 0, z]} rotation={[0, turn, 0]}>
      <Armchair x={-0.85} z={0} rotY={Math.PI / 2 - 0.25}/>
      <Armchair x={0.85} z={0} rotY={-Math.PI / 2 + 0.25}/>
      <group>
        <Blob w={1.0} d={1.0} opacity={0.6}/>
        <mesh position={[0, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.035, 40]}/>
          <meshStandardMaterial color="#2c5a45" roughness={0.25} metalness={0.05}/>
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.06, 0.16, 0.4, 20]}/>
          <meshStandardMaterial color="#2a1a10" roughness={0.5}/>
        </mesh>
        {/* Vase med hvide blomster */}
        <mesh position={[0, 0.53, 0]}>
          <cylinderGeometry args={[0.05, 0.07, 0.18, 16]}/>
          <meshStandardMaterial color="#f4efe6" roughness={0.2}/>
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((k) => (<mesh key={k} position={[Math.cos(k) * 0.07, 0.68 + (k % 3) * 0.03, Math.sin(k) * 0.07]}>
            <sphereGeometry args={[0.05, 10, 8]}/>
            <meshStandardMaterial color="#fbf6ee" roughness={0.9}/>
          </mesh>))}
      </group>
    </group>);
}
/** Lysekrone af messingringe */
function Pendant({ x, z, r = 0.42 }) {
    return (<group position={[x, CEIL, z]}>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.7, 6]}/>
        <meshStandardMaterial color={BRASS}/>
      </mesh>
      {[0, 1].map((k) => (<group key={k} position={[0, -0.72 - k * 0.14, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r * (1 - k * 0.3), 0.025, 12, 48]}/>
            <meshStandardMaterial color={BRASS} metalness={0.7} roughness={0.25} emissive="#ffdca0" emissiveIntensity={0.35}/>
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r * (1 - k * 0.3), 0.012, 8, 48]}/>
            <meshBasicMaterial color="#fff2d6" toneMapped={false}/>
          </mesh>
        </group>))}
    </group>);
}
const rugW_ = (l) => l.a * 2 - 1.6;
const rugD_ = (l) => l.b * 2 - 1.6;
const SLAT_W = 0.085, SLAT_D = 0.035, SLAT_PITCH = 0.12;
/** Lodrette valnøddelameller langs alle vægge, som i Rolex-afdelingen. Ét kald til grafikkortet for dem alle */
function Slats({ walls }) {
    const walnut = useMaps("walnut", 0.09, 1.6);
    const ref = useRef(null);
    const items = useMemo(() => {
        const out = [];
        for (const w of walls) {
            const len = Math.hypot(w.bx - w.ax, w.bz - w.az), ux = (w.bx - w.ax) / len, uz = (w.bz - w.az) / len;
            for (let d = SLAT_PITCH / 2; d < len; d += SLAT_PITCH) {
                const x = w.ax + ux * d + w.nx * SLAT_D / 2, z = w.az + uz * d + w.nz * SLAT_D / 2;
                if (w.skip && (w.nz ? x : z) > w.skip[0] && (w.nz ? x : z) < w.skip[1])
                    continue;
                out.push({ x, z, r: Math.atan2(w.nx, w.nz) });
            }
        }
        return out;
    }, [walls]);
    useLayoutEffect(() => {
        const m = ref.current;
        if (!m)
            return;
        const o = new THREE.Object3D(), c = new THREE.Color();
        let seed = 5;
        const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
        items.forEach((it, i) => {
            o.position.set(it.x, CEIL / 2, it.z);
            o.rotation.set(0, it.r, 0);
            o.updateMatrix();
            m.setMatrixAt(i, o.matrix);
            const v = 0.86 + rnd() * 0.22;
            m.setColorAt(i, c.setRGB(v, v * (0.97 + rnd() * 0.04), v * (0.95 + rnd() * 0.05)));
        });
        m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor)
            m.instanceColor.needsUpdate = true;
    }, [items]);
    return (<instancedMesh key={items.length} ref={ref} args={[undefined, undefined, items.length]} frustumCulled={false}>
      <boxGeometry args={[SLAT_W, CEIL, SLAT_D]}/>
      <meshStandardMaterial {...walnut} color="#b48e6c" roughness={1} envMapIntensity={0.8}/>
    </instancedMesh>);
}
function Room({ slots, gaps, backZ, loop, hq }) {
    const W = ROOM_HALF * 2;
    const D = FRONT_Z - backZ;
    const zMid = (FRONT_Z + backZ) / 2;
    // Travertinfliserne i teksturen er ca. 60 cm, så ét billede dækker 2,4 m
    const floor = useMaps("stone", W / 2.4, D / 2.4);
    const ceil = useMaps("plaster", W / 3, D / 3);
    const rugFiber = useMaps("velvet", rugW_(loop) * 2, rugD_(loop) * 2);
    const rugW = rugW_(loop), rugD = rugD_(loop);
    const lounges = rugD > 6 ? [loop.cz + rugD / 4, loop.cz - rugD / 4] : [loop.cz];
    const wallMat = () => <meshStandardMaterial color="#2a1a10" roughness={0.9}/>;
    const walls = useMemo(() => [
        { ax: -ROOM_HALF, az: FRONT_Z, bx: -ROOM_HALF, bz: backZ, nx: 1, nz: 0 },
        { ax: ROOM_HALF, az: backZ, bx: ROOM_HALF, bz: FRONT_Z, nx: -1, nz: 0 },
        { ax: -ROOM_HALF, az: backZ, bx: ROOM_HALF, bz: backZ, nx: 0, nz: 1 },
        { ax: ROOM_HALF, az: FRONT_Z, bx: -ROOM_HALF, bz: FRONT_Z, nx: 0, nz: -1, skip: [-1.45, 1.45] },
    ], [backZ]);
    return (<>
      {/* Travertingulv */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, zMid]} receiveShadow>
        <planeGeometry args={[W, D]}/>
        {hq ? (<MeshReflectorMaterial {...floor} normalScale={new THREE.Vector2(0.5, 0.5)} blur={[300, 80]} resolution={512} mixBlur={0.8} mixStrength={0.9} mirror={0.4} roughness={0.85} depthScale={0.8} minDepthThreshold={0.3} maxDepthThreshold={1.4} metalness={0} color="#f7f2ec"/>) : (<meshStandardMaterial {...floor} roughness={0.8} metalness={0} envMapIntensity={1} color="#f7f2ec"/>)}
      </mesh>
      {/* Tæppe under loungen i midten */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, loop.cz]}>
        <planeGeometry args={[rugW, rugD]}/>
        <meshStandardMaterial map={rugTexture()} normalMap={rugFiber.normalMap} roughness={1}/>
      </mesh>
      {/* Vægge med træ-lameller */}
      {[-1, 1].map((k) => (<mesh key={k} position={[k * ROOM_HALF, CEIL / 2, zMid]} rotation={[0, -k * Math.PI / 2, 0]}>
          <planeGeometry args={[D, CEIL]}/>
          {wallMat()}
        </mesh>))}
      <mesh position={[0, CEIL / 2, backZ]}>
        <planeGeometry args={[W, CEIL]}/>
        {wallMat()}
      </mesh>
      <mesh position={[0, CEIL / 2, FRONT_Z]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, CEIL]}/>
        {wallMat()}
      </mesh>
      <Slats walls={walls}/>
      {/* Indgangen: glasdør med dagslys udefra */}
      <mesh position={[0, 1.35, FRONT_Z - 0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.2, 2.7]}/>
        <meshBasicMaterial color="#fbf4e6" toneMapped={false}/>
      </mesh>
      {[-1.12, 0, 1.12].map((x) => (<mesh key={x} position={[x, 1.35, FRONT_Z - 0.03]}>
          <boxGeometry args={[0.05, 2.74, 0.05]}/>
          <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.35}/>
        </mesh>))}
      <mesh position={[0, 2.72, FRONT_Z - 0.03]}>
        <boxGeometry args={[2.3, 0.05, 0.05]}/>
        <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.35}/>
      </mesh>
      <mesh position={[0, 3.3, FRONT_Z - 0.02]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.6, 0.81]}/>
        <meshBasicMaterial map={signTexture("Knud Pedersen", "Skt. Clemens Torv · Aarhus")} toneMapped={false}/>
      </mesh>
      {/* Sokkel i mørkt træ langs alle vægge */}
      {[[-ROOM_HALF + 0.05, zMid, D, Math.PI / 2], [ROOM_HALF - 0.05, zMid, D, -Math.PI / 2], [0, backZ + 0.05, W, 0], [0, FRONT_Z - 0.05, W, Math.PI]].map(([x, z, len, r], i) => (<mesh key={i} position={[x, 0.06, z]} rotation={[0, r, 0]}>
          <boxGeometry args={[len, 0.12, 0.03]}/>
          <meshStandardMaterial color="#2a1a10" roughness={0.5}/>
        </mesh>))}
      {/* Loft med lysliste langs alle vægge */}
      <mesh position={[0, CEIL, zMid]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]}/>
        <meshStandardMaterial {...ceil} map={undefined} color="#f3ede4" roughness={1}/>
      </mesh>
      {[[-(ROOM_HALF - 0.25), zMid, 0.06, D], [ROOM_HALF - 0.25, zMid, 0.06, D], [0, backZ + 0.25, W - 0.5, 0.06], [0, FRONT_Z - 0.25, W - 0.5, 0.06]].map(([x, z, w, d], i) => (<mesh key={i} position={[x, CEIL - 0.01, z]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w, d]}/>
          <meshBasicMaterial color="#fff3dc" toneMapped={false}/>
        </mesh>))}
      {lounges.map((z) => <Pendant key={z} x={0} z={z} r={0.6}/>)}
      {[loop.cz + loop.b, loop.cz - loop.b].map((z) => <Pendant key={"p" + z} x={0} z={z}/>)}
      {slots.map((s) => <Niche key={s.brand.slug} slot={s}/>)}
      {slots.map((s) => (<BladeSign key={s.brand.slug} x={s.wx + s.nx * 0.62} z={s.wz + s.nz * 0.62} rotY={s.rotY} name={s.brand.name} eyebrow={zoneLabels[s.brand.zone]}/>))}
      {gaps.map((g) => <Counter key={g.zone} gap={g}/>)}
      {lounges.map((z, i) => <Lounge key={z} x={0} z={z} turn={i % 2 ? Math.PI : 0}/>)}
      {/* Planter i hjørnerne og ved indgangen */}
      <Plant x={-ROOM_HALF + 0.55} z={backZ + 0.55} s={1.2}/>
      <Plant x={ROOM_HALF - 0.55} z={backZ + 0.55} s={1.2}/>
      <Plant x={-ROOM_HALF + 0.55} z={FRONT_Z - 0.55}/>
      <Plant x={-1.6} z={FRONT_Z - 0.45} s={0.9}/>
      <Plant x={1.6} z={FRONT_Z - 0.45} s={0.9}/>
    </>);
}
function Ready({ onReady }) {
    const frames = useRef(0);
    const done = useRef(false);
    useFrame(() => {
        if (done.current)
            return;
        if (++frames.current > 3) {
            done.current = true;
            onReady();
        }
    });
    return null;
}
/** Ét rigtigt spotlys, der følger det mærke, man peger på eller har valgt */
function MovingSpot({ slot }) {
    const light = useRef(null);
    const tgt = useMemo(() => new THREE.Object3D(), []);
    useFrame((_, dt) => {
        const l = light.current;
        if (!l)
            return;
        const want = slot ? 22 : 0;
        l.intensity += (want - l.intensity) * Math.min(1, dt * 5);
        if (slot) {
            l.position.set(slot.x + slot.nx * 0.7, 3.8, slot.z + slot.nz * 0.7);
            tgt.position.set(slot.x, 1.1, slot.z);
            tgt.updateMatrixWorld();
        }
    });
    return (<>
      <primitive object={tgt}/>
      <spotLight ref={light} angle={0.34} penumbra={0.7} intensity={0} distance={7} decay={1.4} color="#fff1da" target={tgt}/>
    </>);
}
export default function ShowroomScene({ brands, active, hover, lookAngle, mobile, current, onHover, onSelect, onReady, paused, calm }) {
    const { slots, gaps, backZ, loop, walkEnd } = useMemo(() => layout(brands), [brands]);
    const dragRot = useRef(0);
    const [low, setLow] = useState(false);
    const look = useRef({ s: 0, dir: 1, pitch: 0, step: 0, touched: false, dragging: false, lastX: 0, lastY: 0 });
    const bySlot = (i) => (i == null ? null : slots.find((s) => s.index === i) ?? null);
    const pose = useMemo(() => {
        const a = bySlot(active);
        if (a)
            return focusPose(a, mobile, mobile, backZ);
        if (mobile) {
            const c = bySlot(current);
            if (c)
                return focusPose(c, true, false, backZ);
        }
        if (lookAngle != null)
            return overviewPose(loop, lookAngle);
        return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, lookAngle, mobile, current, slots, loop]);
    const start = mobile ? focusPose(slots[0], true, false, backZ) : overviewPose(loop, 0);
    const near = (i) => {
        if (!mobile)
            return true;
        const a = slots.findIndex((s) => s.index === current);
        const b = slots.findIndex((s) => s.index === i);
        return Math.abs(a - b) <= 2;
    };
    return (<Canvas frameloop={paused ? "never" : "always"} dpr={mobile ? [1, 1.5] : low ? 1 : [1, 1.5]} camera={{ position: start.pos, fov: mobile ? 52 : 50, near: 0.1, far: 60 }} onCreated={({ camera }) => camera.lookAt(...start.target)} gl={{ antialias: !mobile, powerPreference: "high-performance" }} onPointerDown={(e) => { const L = look.current; L.dragging = true; L.touched = true; L.lastX = e.clientX; L.lastY = e.clientY; }} onPointerUp={() => { look.current.dragging = false; }} onPointerLeave={() => { look.current.dragging = false; }} onPointerMove={(e) => {
            const L = look.current;
            if (!L.dragging || e.pointerType === "touch")
                return;
            const dx = e.clientX - L.lastX, dy = e.clientY - L.lastY;
            L.lastX = e.clientX;
            L.lastY = e.clientY;
            if (active != null) {
                dragRot.current = dx * 0.004;
                return;
            }
            // Træk mod venstre = gå frem
            L.s -= dx * 0.012;
            if (dx)
                L.dir = dx < 0 ? 1 : -1;
            L.pitch = Math.max(-0.12, Math.min(0.12, L.pitch + dy * 0.0012));
        }} onPointerMissed={() => onHover(null)}>
      <color attach="background" args={["#2e2219"]}/>
      <fog attach="fog" args={["#3a2b20", 16, 34]}/>
      {/* Lyset: blødt, varmt butikslys ovenfra med dybere skygger end før, så rummet får dybde */}
      <ambientLight intensity={0.45} color="#fff1de"/>
      <hemisphereLight args={["#fff4e2", "#8a7058", 0.7]}/>
      <directionalLight position={[2, 6, 3]} intensity={0.6} color="#ffeccf"/>
      <Environment resolution={mobile ? 64 : 256} frames={1}>
        {/* Butikkens lys som spejlinger i glas, messing og sten: loftspots, lyslister og dagslys fra døren */}
        <Lightformer form="rect" intensity={1.6} position={[0, 5, -6]} scale={[6, 20, 1]} rotation-x={Math.PI / 2} color="#fff3e0"/>
        {[-6, -3, 0, 3, 6].map((z) => [-2.5, 2.5].map((x) => (<Lightformer key={`${x}${z}`} form="circle" intensity={6} position={[x, 4.5, z - 4]} scale={0.5} rotation-x={Math.PI / 2} color="#fff2d8"/>)))}
        <Lightformer form="rect" intensity={1.4} position={[-5, 3.6, -6]} rotation-y={Math.PI / 2} scale={[24, 0.3, 1]} color="#ffe2b4"/>
        <Lightformer form="rect" intensity={1.4} position={[5, 3.6, -6]} rotation-y={-Math.PI / 2} scale={[24, 0.3, 1]} color="#ffe2b4"/>
        <Lightformer form="rect" intensity={0.5} position={[-5, 1.5, -6]} rotation-y={Math.PI / 2} scale={[24, 3, 1]} color="#8a5a38"/>
        <Lightformer form="rect" intensity={0.5} position={[5, 1.5, -6]} rotation-y={-Math.PI / 2} scale={[24, 3, 1]} color="#8a5a38"/>
        <Lightformer form="rect" intensity={3} position={[0, 1.6, 4]} rotation-y={Math.PI} scale={[2.4, 3, 1]} color="#fffaf0"/>
      </Environment>
      <Suspense fallback={null}>
        <PbrProvider>
        <Room slots={slots} gaps={gaps} backZ={backZ} loop={loop} hq={!mobile && !low}/>
        {slots.map((s) => (<Vitrine key={s.brand.slug} slot={s} active={active === s.index} hover={hover === s.index} showProduct={near(s.index)} still={!!s.brand.framed} dragRot={dragRot} onHover={onHover} onSelect={onSelect}/>))}
        <MovingSpot slot={bySlot(hover ?? active)}/>
        <ContactShadows position={[0, 0.008, (FRONT_Z + backZ) / 2]} scale={[ROOM_HALF * 2, FRONT_Z - backZ]} resolution={mobile || low ? 256 : 512} blur={2.2} opacity={0.4} far={1.2} frames={1} color="#3a2a1a"/>
        <Ready onReady={onReady}/>
        </PbrProvider>
      </Suspense>
      {/* Kører computeren for tungt, skrues der automatisk ned for effekterne, så gåturen forbliver glat */}
      <PerformanceMonitor onDecline={() => setLow(true)} flipflops={1}/>
      {!mobile && !low && (<EffectComposer multisampling={2} enableNormalPass={false}>
          {/* Bløde skygger i hjørner, under møbler og mellem lamellerne */}
          <N8AO halfRes quality="performance" aoRadius={0.55} distanceFalloff={0.6} intensity={1.6} color="#2a1a10"/>
          <Bloom mipmapBlur luminanceThreshold={0.92} luminanceSmoothing={0.2} intensity={0.5}/>
          <Vignette offset={0.32} darkness={0.55}/>
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC}/>
        </EffectComposer>)}
      <WheelWalk look={look} enabled={active == null && !mobile} walkEnd={walkEnd}/>
      <CameraRig pose={pose} overview={active == null && !mobile} look={look} auto={active == null && !mobile && !calm} loop={loop}/>
    </Canvas>);
}
