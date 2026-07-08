import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Interactive 3D horizontal audio waveform.
 * Wireframe plane deformed by layered sine waves.
 * Interpolates color from cyan (calm) -> neon green (active) based on scroll or hover.
 */
function WaveMesh({ intensityRef }) {
  const meshRef = useRef();
  const materialRef = useRef();

  const geom = React.useMemo(() => {
    return new THREE.PlaneGeometry(14, 3.2, 220, 60);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const intensity = intensityRef.current;
    const pos = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave1 = Math.sin(x * 1.4 + t * 2.2) * 0.35;
      const wave2 = Math.sin(x * 0.6 - t * 1.4 + y * 0.8) * 0.22;
      const spike = Math.sin(x * 3.5 + t * 4.0) * 0.12 * intensity;
      const z = (wave1 + wave2 + spike) * (0.4 + intensity * 0.9);
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    meshRef.current.rotation.x = -Math.PI / 3.1;

    // color shift cyan -> green
    const c = new THREE.Color("#00F2FE");
    const g = new THREE.Color("#00FF87");
    c.lerp(g, intensity);
    materialRef.current.color = c;
    materialRef.current.emissive = c;
    materialRef.current.emissiveIntensity = 0.9 + intensity * 0.8;
  });

  return (
    <mesh ref={meshRef} geometry={geom}>
      <meshStandardMaterial
        ref={materialRef}
        wireframe
        transparent
        opacity={0.95}
        color="#00F2FE"
        emissive="#00F2FE"
        emissiveIntensity={1}
        toneMapped={false}
      />
    </mesh>
  );
}

function GroundGlow() {
  return (
    <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 20]} />
      <meshBasicMaterial color="#00FF87" opacity={0.06} transparent />
    </mesh>
  );
}

export default function WaveformCanvas() {
  const intensityRef = useRef(0.35);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    intensityRef.current = Math.min(1, Math.max(0.15, x));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={() => (intensityRef.current = 0.35)}
      data-testid="hero-waveform"
      className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] cursor-crosshair"
    >
      {/* underline glow */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[90%] h-px hairline-x" />
      <Canvas camera={{ position: [0, 1.6, 4.4], fov: 55 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 3, 3]} intensity={2} color="#00FF87" />
        <pointLight position={[-3, 2, 2]} intensity={1.5} color="#00F2FE" />
        <WaveMesh intensityRef={intensityRef} />
        <GroundGlow />
      </Canvas>

      {/* corner readouts */}
      <div className="absolute top-3 left-4 font-mono text-[10px] tracking-[0.25em] uppercase text-phasor-mute">
        <span className="text-phasor-green">●</span> LIVE STREAM PARSE
      </div>
      <div className="absolute top-3 right-4 font-mono text-[10px] tracking-[0.25em] uppercase text-phasor-mute">
        SR 48kHz · 120ms
      </div>
      <div className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.25em] uppercase text-phasor-mute">
        MOVE CURSOR &rarr; INCREASE THREAT
      </div>
      <div className="absolute bottom-3 right-4 font-mono text-[10px] tracking-[0.25em] uppercase text-phasor-cyan">
        NEURAL_ARTIFACT_SCAN
      </div>
    </div>
  );
}
