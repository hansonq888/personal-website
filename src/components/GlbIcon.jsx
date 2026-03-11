import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

function Model({ url, hover, scale = 0.8, lighten = false, position = [0, 0, 0] }) {
  const { scene } = useGLTF(url);
  const ref = useRef();
  const clone = scene.clone();
  clone.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      if (lighten && child.material) {
        child.material = child.material.clone();
        if (child.material.color) child.material.color.setStyle("#555");
        if (child.material.emissive) child.material.emissive.setStyle("#222");
      }
    }
  });
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += (hover ? 0.6 : 0.15) * delta;
  });
  return (
    <primitive
      ref={ref}
      object={clone}
      scale={scale}
      position={position}
    />
  );
}

function Fallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#ccc" />
    </mesh>
  );
}

export default function GlbIcon({ src, alt, className = "", modelScale = 0.8, size = 88, lighten = false, position = [0, 0, 0], cameraY = 0, fov = 42 }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [0, cameraY, 2.2], fov }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ambientLight intensity={1.4} color="#fff5eb" />
        <directionalLight position={[3, 3, 3]} intensity={1.8} color="#fff0e0" />
        <directionalLight position={[-2, 2, 2]} intensity={1} color="#ffe8d0" />
        <pointLight position={[0, 0, 2]} intensity={0.6} color="#ffecd2" />
        <pointLight position={[-1, -0.5, 1]} intensity={0.4} color="#ffddb8" />
        <Suspense fallback={<Fallback />}>
          <Model url={src} hover={hover} scale={modelScale} lighten={lighten} position={position} />
        </Suspense>
      </Canvas>
    </div>
  );
}
