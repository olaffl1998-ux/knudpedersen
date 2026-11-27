"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, ContactShadows, Environment, Html, Lightformer, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { zoneLabels } from "@/data/brands";
import { WALL_RADIUS, focusPose, layout, overviewPose } from "./geometry";
const STONE = "#ebe6de";
const WALL = "#efe5d7";
const BRASS = "#b08d57";
/** Navnet på messingpladen tegnes som en tekstur i samme serif som logoet */
const plates = new Map();
function plateTexture(name) {
    const hit = plates.get(name);
    if (hit)
        return hit;
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 220;
    const ctx = c.getContext("2d");
    const fam = getComputedStyle(document.body).getPropertyValue("--font-display").trim() || "Georgia, serif";
    let size = 120;
    ctx.font = `400 ${size}px ${fam}`;
    while (ctx.measureText(name).width > 940 && size > 40) {
        size -= 6;
        ctx.font = `400 ${size}px ${fam}`;
    }
    ctx.fillStyle = "#2a2016";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, 512, 116);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    plates.set(name, t);
    return t;
}
const GLASS_EDGES = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.7, 0.72, 0.7));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Kameraet: i oversigten står det i midten og kigger rundt (træk for at kigge, ingen fri bevægelse).
    Ved klik flyver det blødt (1,2 sek., ease-in-out) ind foran vitrinen og tilbage igen. */
function CameraRig({ pose, overview, look, auto }) {
    const { camera } = useThree();
    const cur = useRef({ target: new THREE.Vector3(...overviewPose(0).target) });
    const anim = useRef(null);
    useEffect(() => {
        if (!pose)
            return;
        anim.current = { t: 0, fromP: camera.position.clone(), fromT: cur.current.target.clone(), toP: new THREE.Vector3(...pose.pos), toT: new THREE.Vector3(...pose.target) };
    }, [pose, camera]);
    useFrame((_, dt) => {
        const cam = camera;
        const a = anim.current;
        if (a) {
            a.t = Math.min(1, a.t + dt / 1.2);
            const k = ease(a.t);
            cam.position.lerpVectors(a.fromP, a.toP, k);
            cur.current.target.lerpVectors(a.fromT, a.toT, k);
            cam.lookAt(cur.current.target);
            if (a.t >= 1) {
                anim.current = null;
                if (overview) {
                    const d = a.toT.clone().sub(a.toP);
                    look.current.yaw = Math.atan2(d.x, -d.z);
                    look.current.pitch = 0;
                }
            }
        }
        else if (overview) {
            const L = look.current;
            if (auto && !L.touched)
                L.yaw += dt * 0.06;
            const p = overviewPose(L.yaw);
            cam.position.lerp(new THREE.Vector3(...p.pos), Math.min(1, dt * 8));
            const t = new THREE.Vector3(p.target[0], p.target[1] + L.pitch * 2.6, p.target[2]);
            cur.current.target.lerp(t, Math.min(1, dt * 8));
            cam.lookAt(cur.current.target);
        }
        if (Math.abs(cam.fov - look.current.fov) > 0.01) {
            cam.fov += (look.current.fov - cam.fov) * Math.min(1, dt * 6);
            cam.updateProjectionMatrix();
        }
    });
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
function Vitrine({ slot, active, hover, showProduct, still, dragRot, onHover, onSelect }) {
    const b = slot.brand;
    const product = useRef(null);
    const glow = useRef(null);
    const cone = useRef(null);
    const rolex = b.slug === "rolex";
    useFrame((state, dt) => {
        const g = product.current;
        if (g && !still) {
            // Løfter sig let og drejer langsomt, når vitrinen er valgt (aldrig for Rolex og Tudor)
            const lift = active ? 0.1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.015 : 0;
            g.position.y += (1.32 + lift - g.position.y) * Math.min(1, dt * 4);
            if (b.model)
                g.rotation.y = active ? g.rotation.y + dt * 0.35 + dragRot.current : g.rotation.y * 0.95;
            if (active)
                dragRot.current *= 0.85;
        }
        const target = hover || active ? 1 : 0.35;
        if (glow.current)
            glow.current.opacity += (target * 0.55 - glow.current.opacity) * Math.min(1, dt * 6);
        if (cone.current)
            cone.current.opacity += (target * 0.06 - cone.current.opacity) * Math.min(1, dt * 6);
    });
    const scale = rolex ? 1.12 : 1;
    return (<group position={[slot.x, 0, slot.z]} rotation={[0, -slot.angle, 0]} scale={scale} onPointerOver={(e) => { e.stopPropagation(); onHover(slot.index); document.body.style.cursor = "pointer"; }} onPointerOut={() => { onHover(null); document.body.style.cursor = ""; }} onClick={(e) => { e.stopPropagation(); onSelect(slot.index); }}>
      {/* Stensokkel */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 1, 0.78]}/>
        <meshStandardMaterial color="#faf7f1" roughness={0.5}/>
      </mesh>
      <mesh position={[0, 1.015, 0]}>
        <boxGeometry args={[0.82, 0.03, 0.82]}/>
        <meshStandardMaterial color="#e2dbd0" roughness={0.4}/>
      </mesh>
      {/* Lyspøl på soklen og en blød lyskegle ovenfra (billigere end et rigtigt spotlys pr. vitrine) */}
      <mesh position={[0, 1.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 32]}/>
        <meshBasicMaterial ref={glow} color="#fff6e6" transparent opacity={0.25} depthWrite={false}/>
      </mesh>
      <mesh position={[0, 2.35, 0]}>
        <coneGeometry args={[0.36, 2.6, 24, 1, true]}/>
        <meshBasicMaterial ref={cone} color="#fff3dc" transparent opacity={0.04} side={THREE.DoubleSide} depthWrite={false}/>
      </mesh>
      {/* Glaskasse med fine kanter */}
      <lineSegments position={[0, 1.39, 0]} geometry={GLASS_EDGES}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.55}/>
      </lineSegments>
      <mesh position={[0, 1.39, 0]}>
        <boxGeometry args={[0.7, 0.72, 0.7]}/>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.1} roughness={0.04} metalness={0.2} envMapIntensity={2.2} depthWrite={false}/>
      </mesh>
      {/* Produkt */}
      <group ref={product} position={[0, 1.32, 0]}>
        {showProduct && b.model ? (<Suspense fallback={null}><ProductModel url={b.model}/></Suspense>) : showProduct && b.image ? (<ProductImage url={b.image} framed={b.framed}/>) : null}
      </group>
      {/* Messingplade med navnet (rigtig HTML-tekst) */}
      <mesh position={[0, 0.82, 0.395]}>
        <boxGeometry args={[0.46, 0.11, 0.012]}/>
        <meshStandardMaterial color="#d2b37c" metalness={0.35} roughness={0.4}/>
      </mesh>
      <mesh position={[0, 0.82, 0.403]}>
        <planeGeometry args={[0.44, 0.095]}/>
        <meshBasicMaterial map={plateTexture(b.name)} transparent toneMapped={false}/>
      </mesh>
      {(hover || active) && (<Html position={[0, 1.95, 0]} center pointerEvents="none" zIndexRange={[20, 10]}>
          <span className="sr3d-label">{b.name}</span>
        </Html>)}
    </group>);
}
/** Let zoom med scroll/pinch, når man har rørt scenen. Ved grænsen ruller siden videre som normalt */
function Zoom({ look, enabled }) {
    const { gl } = useThree();
    useEffect(() => {
        const el = gl.domElement;
        const on = (e) => {
            const L = look.current;
            if (!enabled || !L.touched)
                return;
            const next = Math.max(30, Math.min(46, L.fov + Math.sign(e.deltaY) * 1.5));
            if (next === L.fov)
                return;
            e.preventDefault();
            L.fov = next;
        };
        el.addEventListener("wheel", on, { passive: false });
        return () => el.removeEventListener("wheel", on);
    }, [gl, look, enabled]);
    return null;
}
function Room({ zoneAngles }) {
    return (<>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[WALL_RADIUS, 64]}/>
        <meshStandardMaterial color={STONE} roughness={0.35} metalness={0.05}/>
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[WALL_RADIUS, WALL_RADIUS, 5.2, 64, 1, true]}/>
        <meshStandardMaterial color={WALL} roughness={0.95} side={THREE.BackSide}/>
      </mesh>
      {/* Tynd messinglist langs væggen */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[WALL_RADIUS - 0.01, WALL_RADIUS - 0.01, 0.04, 64, 1, true]}/>
        <meshStandardMaterial color={BRASS} metalness={0.4} roughness={0.4} side={THREE.BackSide}/>
      </mesh>
      {Object.keys(zoneAngles).map((z) => {
            const a = zoneAngles[z];
            const r = WALL_RADIUS - 0.05;
            return (<Html key={z} transform position={[Math.sin(a) * r, 3.1, -Math.cos(a) * r]} rotation={[0, -a, 0]} distanceFactor={4} pointerEvents="none" zIndexRange={[5, 0]}>
            <span className="sr3d-zone">{zoneLabels[z]}</span>
          </Html>);
        })}
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
        const want = slot ? 26 : 0;
        l.intensity += (want - l.intensity) * Math.min(1, dt * 5);
        if (slot) {
            l.position.set(slot.x * 0.92, 4.4, slot.z * 0.92);
            tgt.position.set(slot.x, 1.1, slot.z);
            tgt.updateMatrixWorld();
        }
    });
    return (<>
      <primitive object={tgt}/>
      <spotLight ref={light} angle={0.32} penumbra={0.7} intensity={0} distance={9} decay={1.4} color="#fff1da" target={tgt}/>
    </>);
}
export default function ShowroomScene({ brands, active, hover, lookAngle, mobile, current, onHover, onSelect, onReady }) {
    const { slots, zoneAngles } = useMemo(() => layout(brands), [brands]);
    const dragRot = useRef(0);
    const look = useRef({ yaw: 0, pitch: 0, fov: mobile ? 50 : 40, touched: false, dragging: false, lastX: 0, lastY: 0 });
    const bySlot = (i) => (i == null ? null : slots.find((s) => s.index === i) ?? null);
    const pose = useMemo(() => {
        const a = bySlot(active);
        if (a)
            return focusPose(a, mobile, mobile);
        if (mobile) {
            const c = bySlot(current);
            if (c)
                return focusPose(c, true);
        }
        if (lookAngle != null)
            return overviewPose(lookAngle);
        return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, lookAngle, mobile, current, slots]);
    const start = overviewPose(0);
    const near = (i) => {
        if (!mobile)
            return true;
        const n = slots.length;
        const a = slots.findIndex((s) => s.index === current);
        const b = slots.findIndex((s) => s.index === i);
        const d = Math.abs(a - b);
        return Math.min(d, n - d) <= 1;
    };
    return (<Canvas dpr={mobile ? [1, 1.5] : [1, 2]} camera={{ position: mobile ? focusPose(slots[0], true).pos : start.pos, fov: mobile ? 50 : 40, near: 0.1, far: 60 }} gl={{ antialias: !mobile, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; }} onPointerDown={(e) => { const L = look.current; L.dragging = true; L.touched = true; L.lastX = e.clientX; L.lastY = e.clientY; }} onPointerUp={() => { look.current.dragging = false; }} onPointerLeave={() => { look.current.dragging = false; }} onPointerMove={(e) => {
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
            L.yaw -= dx * 0.0035;
            L.pitch = Math.max(-0.12, Math.min(0.1, L.pitch + dy * 0.0012));
        }} onPointerMissed={() => onHover(null)}>
      <color attach="background" args={["#efe7dc"]}/>
      <fog attach="fog" args={["#efe7dc", 12, 26]}/>
      <ambientLight intensity={0.85} color="#fff7ec"/>
      <hemisphereLight args={["#fffaf2", "#d9cfc0", 0.5]}/>
      <directionalLight position={[3, 8, 2]} intensity={0.6} color="#fff4e2"/>
      <Environment resolution={mobile ? 64 : 256} frames={1}>
        {/* Blødt "studie"-lys uden at hente en HDRI udefra */}
        <Lightformer form="rect" intensity={2.2} position={[0, 5, -4]} scale={[10, 3, 1]} color="#fff3e0"/>
        <Lightformer form="rect" intensity={1.4} position={[-5, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]}/>
        <Lightformer form="rect" intensity={1.4} position={[5, 2, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]}/>
        <Lightformer form="ring" intensity={1.8} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={4}/>
      </Environment>
      <Suspense fallback={null}>
        <Room zoneAngles={zoneAngles}/>
        {slots.map((s) => (<Vitrine key={s.brand.slug} slot={s} active={active === s.index} hover={hover === s.index} showProduct={near(s.index)} still={!!s.brand.framed} dragRot={dragRot} onHover={onHover} onSelect={onSelect}/>))}
        <MovingSpot slot={bySlot(hover ?? active)}/>
        <ContactShadows position={[0, 0.005, 0]} scale={WALL_RADIUS * 2} resolution={mobile ? 256 : 1024} blur={2.4} opacity={0.45} far={1.4} frames={1} color="#5a4a3a"/>
        <Ready onReady={onReady}/>
      </Suspense>
      <Zoom look={look} enabled={active == null && !mobile}/>
      <CameraRig pose={pose} overview={active == null && !mobile} look={look} auto={active == null && !mobile}/>
    </Canvas>);
}
