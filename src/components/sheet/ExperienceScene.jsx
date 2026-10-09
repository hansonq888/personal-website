import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { experiences } from "../../data/experiences";

/* ============================================================================
   The plates that sit beside each role in the timeline, lifted off the page
   into a real scene: they drift, turn toward the pointer, and dolly with the
   scroll. Transparent canvas, so the paper ground still shows through.
   ========================================================================== */

const CARD_W = 1.55;
const CARD_H = CARD_W * (9 / 16);

function Plate({ url, index, count, pointer, progress }) {
  const mesh = useRef();
  const map = useLoader(THREE.TextureLoader, url);

  // a fixed berth for each plate, fanned across the frame
  const home = useMemo(() => {
    const t = count > 1 ? index / (count - 1) : 0.5;
    return {
      x: (t - 0.5) * 4.35,
      y: Math.sin(t * Math.PI * 1.35 + 0.4) * 0.52,
      z: -0.9 + ((index * 7) % 5) * 0.34,
      spin: (index % 2 ? 1 : -1) * 0.16,
      phase: index * 1.7,
    };
  }, [index, count]);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    // the drift
    m.position.x = home.x + Math.sin(t * 0.21 + home.phase) * 0.11;
    m.position.y = home.y + Math.sin(t * 0.3 + home.phase) * 0.16 - progress.current * 0.5;
    m.position.z = home.z + Math.cos(t * 0.18 + home.phase) * 0.14;
    // turn toward the pointer, damped
    const wantY = home.spin + pointer.current.x * 0.4 + Math.sin(t * 0.24 + home.phase) * 0.1;
    const wantX = pointer.current.y * -0.28 + Math.cos(t * 0.2 + home.phase) * 0.07;
    m.rotation.y += (wantY - m.rotation.y) * 0.06;
    m.rotation.x += (wantX - m.rotation.x) * 0.06;
    m.rotation.z = Math.sin(t * 0.16 + home.phase) * 0.04;
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[CARD_W, CARD_H]} />
      <meshBasicMaterial map={map} toneMapped={false} transparent />
    </mesh>
  );
}

function Rig({ pointer, progress }) {
  useFrame((state) => {
    // the camera dollies a little as the section crosses the view
    const z = 4.1 - progress.current * 0.7;
    state.camera.position.x += (pointer.current.x * 0.35 - state.camera.position.x) * 0.04;
    state.camera.position.y += (pointer.current.y * -0.22 - state.camera.position.y) * 0.04;
    state.camera.position.z += (z - state.camera.position.z) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function ExperienceScene() {
  const host = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const progress = useRef(0);

  const plates = useMemo(() => experiences.filter((x) => x.image), []);

  const onPointerMove = (e) => {
    const r = host.current?.getBoundingClientRect();
    if (!r) return;
    pointer.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    pointer.current.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  const onPointerLeave = () => { pointer.current.x = 0; pointer.current.y = 0; };

  return (
    <div
      className="xp-scene"
      ref={host}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.6]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 4.1], fov: 42 }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
        frameloop="always"
      >
        <Suspense fallback={null}>
          {plates.map((x, i) => (
            <Plate
              key={x.org}
              url={x.image}
              index={i}
              count={plates.length}
              pointer={pointer}
              progress={progress}
            />
          ))}
        </Suspense>
        <Rig pointer={pointer} progress={progress} />
        <ScrollLink host={host} progress={progress} />
      </Canvas>
    </div>
  );
}

/* Reads how far the band has travelled through the viewport and hands it to
   the scene, so the whole thing is driven by the same scroll as the page. */
function ScrollLink({ host, progress }) {
  useFrame(() => {
    const el = host.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    progress.current = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
  });
  return null;
}
