import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { CAKE_CONFIG } from "@/data/content";

interface CandleProps {
  position: [number, number, number];
  lit: boolean;
  onBlow: () => void;
}

/**
 * Candle — a slim candlestick with a warm, flickering flame and a soft
 * glow halo behind it (a cheap additive-sprite glow standing in for a
 * real bloom post-processing pass).
 */
function Candle({ position, lit, onBlow }: CandleProps) {
  const flameRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const seedRef = useRef(Math.random() * 10);

  useFrame(({ clock }) => {
    if (!lit) return;
    const t = clock.getElapsedTime() + seedRef.current;
    const flicker =
      1 + Math.sin(t * 9) * 0.1 + Math.sin(t * 23) * 0.05 + Math.sin(t * 5.3) * 0.06;
    if (flameRef.current) {
      flameRef.current.scale.set(flicker * 0.9, flicker * 1.15, flicker * 0.9);
      flameRef.current.position.x = Math.sin(t * 3.1) * 0.01;
      flameRef.current.position.z = Math.cos(t * 2.4) * 0.01;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 6) * 0.15);
    }
  });

  return (
    <group position={position}>
      {/* candle body — plain cylinder, no extra stripe mesh (the
          stripe accent mesh in the previous version is one less thing
          that can go wrong geometrically; a simple painted stripe
          texture would be the next step up, but isn't worth the risk
          for such a small visual gain) */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.4, 16]} />
        <meshStandardMaterial color="#fff4f8" roughness={0.35} />
      </mesh>

      {/* clickable hit-area, invisible, larger than the flame so taps
          register easily on mobile */}
      <mesh position={[0, 0.46, 0]} onClick={onBlow} visible={false}>
        <sphereGeometry args={[0.15, 8, 8]} />
      </mesh>

      {lit && (
        <>
          <mesh ref={glowRef} position={[0, 0.43, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshBasicMaterial
              color="#ffb86b"
              transparent
              opacity={0.25}
              depthWrite={false}
            />
          </mesh>
          <mesh ref={flameRef} position={[0, 0.43, 0]}>
            <coneGeometry args={[0.05, 0.14, 12]} />
            <meshStandardMaterial
              color="#ffd27a"
              emissive="#ff8c2e"
              emissiveIntensity={2.4}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            position={[0, 0.46, 0]}
            color="#ffb15e"
            intensity={0.8}
            distance={1.6}
            decay={2}
          />
        </>
      )}
    </group>
  );
}

interface CakeMeshProps {
  litCandles: boolean[];
  onBlowCandle: (i: number) => void;
}

/**
 * CakeMesh — a simple, cute two-tier cartoon-style cake: soft pink
 * icing, light yellow sponge edge peeking underneath each tier, a
 * white plate, and a ring of small cream-colored "pearl" beads around
 * each tier's base. Every shape here is a basic, well-understood
 * primitive (cylinder / sphere / cone) — deliberately avoiding
 * TorusGeometry and LatheGeometry, both of which produced rendering
 * artifacts in earlier versions of this scene (a vertical torus ring
 * with no rotation applied rendered as a stray arc/tube shape above
 * the cake, and a multi-point lathe profile triangulated incorrectly
 * on some GPUs).
 */
function CakeMesh({ litCandles, onBlowCandle }: CakeMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.18;
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.02;
    }
  });

  const candleCount = CAKE_CONFIG.candleCount;
  const baseTierRadius = 1.3;
  const topTierRadius = 0.85;
  // Candles sit well inside the top tier's edge so they're always
  // framed in camera regardless of orbit angle.
  const candleRadius = 0.45;

  // small "cream pearl" beads piped around each tier's base — simple
  // spheres in a circle, nothing that can render incorrectly
  const baseBeads = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    return { x: Math.cos(angle) * (baseTierRadius + 0.02), z: Math.sin(angle) * (baseTierRadius + 0.02) };
  });
  const topBeads = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    return { x: Math.cos(angle) * (topTierRadius + 0.02), z: Math.sin(angle) * (topTierRadius + 0.02) };
  });

  return (
    <group ref={groupRef}>
      {/* white plate */}
      <mesh position={[0, -1.38, 0]} receiveShadow>
        <cylinderGeometry args={[1.75, 1.8, 0.07, 64]} />
        <meshStandardMaterial color="#fbfbfb" roughness={0.3} />
      </mesh>

      {/* base tier: light yellow sponge core, slightly taller and
          wider than the pink icing layer above it, so a thin sponge
          "edge" peeks out underneath — like the reference image */}
      <mesh position={[0, -1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[baseTierRadius, baseTierRadius, 0.22, 48]} />
        <meshStandardMaterial color="#fdeec0" roughness={0.6} />
      </mesh>
      {/* base tier: pink icing body */}
      <mesh position={[0, -0.72, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[baseTierRadius * 0.97, baseTierRadius * 0.97, 0.62, 48]} />
        <meshStandardMaterial color="#ffb3c6" roughness={0.5} />
      </mesh>
      {/* base tier: cream pearl border at the icing/sponge seam */}
      {baseBeads.map((b, i) => (
        <mesh key={`base-bead-${i}`} position={[b.x, -1.02, b.z]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color="#fff6e8" roughness={0.4} />
        </mesh>
      ))}

      {/* top tier: light yellow sponge edge peeking out */}
      <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[topTierRadius, topTierRadius, 0.18, 48]} />
        <meshStandardMaterial color="#fdeec0" roughness={0.6} />
      </mesh>
      {/* top tier: pink icing body */}
      <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[topTierRadius * 0.96, topTierRadius * 0.96, 0.46, 48]} />
        <meshStandardMaterial color="#ffb3c6" roughness={0.5} />
      </mesh>
      {/* top tier: cream pearl border */}
      {topBeads.map((b, i) => (
        <mesh key={`top-bead-${i}`} position={[b.x, -0.27, b.z]}>
          <sphereGeometry args={[0.038, 10, 10]} />
          <meshStandardMaterial color="#fff6e8" roughness={0.4} />
        </mesh>
      ))}

      {/* flat icing cap on top, a soft cream-white so the icing top
          reads slightly different from the pink sides */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[topTierRadius * 0.9, 48]} />
        <meshStandardMaterial color="#fff7ea" roughness={0.6} />
      </mesh>

      {/* candles */}
      {Array.from({ length: candleCount }, (_, i) => {
        const angle =
          candleCount === 1 ? 0 : (i / (candleCount - 1) - 0.5) * 1.6;
        const x = Math.sin(angle) * candleRadius;
        const z = Math.cos(angle) * candleRadius * 0.3; // slight forward fan, not a full ring
        return (
          <Candle
            key={i}
            position={[x, 0.24, z]}
            lit={litCandles[i]}
            onBlow={() => onBlowCandle(i)}
          />
        );
      })}
    </group>
  );
}

interface Cake3DSceneProps {
  litCandles: boolean[];
  onBlowCandle: (i: number) => void;
}

/**
 * Cake3DScene — the <Canvas> wrapper: soft three-point lighting,
 * shadows enabled, gentle auto-rotate. Drag to orbit.
 */
export function Cake3DScene({ litCandles, onBlowCandle }: Cake3DSceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.9, 3.6], fov: 38 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#0a0410"]} />
      <fog attach="fog" args={["#1a0e26", 5, 11]} />

      <directionalLight
        position={[2.5, 4, 2.5]}
        intensity={1.3}
        color="#fff3e6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 1.5, -2]} intensity={0.4} color="#a06bff" />
      <directionalLight position={[0, 2, -4]} intensity={0.45} color="#ff9bb8" />
      <ambientLight intensity={0.4} color="#2a1638" />

      <CakeMesh litCandles={litCandles} onBlowCandle={onBlowCandle} />

      <mesh position={[0, -1.43, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial opacity={0.35} />
      </mesh>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 2.15}
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
