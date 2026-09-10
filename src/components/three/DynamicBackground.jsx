import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sparkles, Float, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'

const PALETTES = {
  dark: { cyan: '#00f0ff', violet: '#a855f7', fuchsia: '#e879f9' },
  light: { cyan: '#0e7490', violet: '#6d28d9', fuchsia: '#a21caf' },
}

function detectMode() {
  if (typeof window === 'undefined') return 'off'
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off'
  if (/Android|iPhone|iPad|Mobi|Mobile/i.test(navigator.userAgent)) return 'off'
  const cores = navigator.hardwareConcurrency || 8
  if (cores <= 4) return 'lite'
  return 'full'
}

function useThemeColorRefs(palette) {
  const cyan = useRef(new THREE.Color(palette.cyan))
  const violet = useRef(new THREE.Color(palette.violet))
  const targetCyan = useRef(new THREE.Color(palette.cyan))
  const targetViolet = useRef(new THREE.Color(palette.violet))

  targetCyan.current.set(palette.cyan)
  targetViolet.current.set(palette.violet)

  const tick = (delta) => {
    const d = Math.min(delta * 2.2, 1)
    cyan.current.lerp(targetCyan.current, d)
    violet.current.lerp(targetViolet.current, d)
  }

  return { cyan, violet, tick }
}

function usePointer() {
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return pointer
}

function CameraRig({ pointer }) {
  useFrame((state, delta) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      pointer.current.x * 0.8,
      Math.min(delta * 2, 1)
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      pointer.current.y * 0.45,
      Math.min(delta * 2, 1)
    )
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function HaloCore({ palette, pointer }) {
  const { cyan, violet, tick } = useThemeColorRefs(palette)
  const wire = useRef()
  const solid = useRef()

  useFrame((state, delta) => {
    tick(delta)
    wire.current.material.color.copy(cyan.current)
    wire.current.material.emissive.copy(cyan.current)
    solid.current.material.color.copy(violet.current)
    solid.current.material.emissive.copy(violet.current)

    wire.current.rotation.y += delta * 0.18
    wire.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.35) * 0.35 + pointer.current.y * 0.25
    wire.current.position.x = THREE.MathUtils.lerp(
      wire.current.position.x,
      pointer.current.x * 0.7,
      Math.min(delta * 1.8, 1)
    )
    wire.current.position.y = THREE.MathUtils.lerp(
      wire.current.position.y,
      pointer.current.y * 0.45,
      Math.min(delta * 1.8, 1)
    )
  })

  return (
    <group>
      <mesh ref={wire}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial
          wireframe
          transparent
          opacity={0.85}
          emissiveIntensity={1.5}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>
      <mesh ref={solid} scale={0.8}>
        <sphereGeometry args={[1.15, 24, 24]} />
        <meshStandardMaterial
          transparent
          opacity={0.22}
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.6}
        />
      </mesh>
    </group>
  )
}

function OrbitRing({ palette }) {
  const { cyan, tick } = useThemeColorRefs(palette)
  const ring = useRef()

  useFrame((_, delta) => {
    tick(delta)
    ring.current.material.color.copy(cyan.current)
    ring.current.rotation.z += delta * 0.12
  })

  return (
    <mesh ref={ring} rotation={[Math.PI / 2.5, 0.3, 0]}>
      <torusGeometry args={[1.9, 0.015, 8, 96]} />
      <meshStandardMaterial transparent opacity={0.7} emissiveIntensity={1.2} metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

function ParticlesShell({ palette, pointer, count }) {
  const points = useRef()
  const mat = useRef()
  const { cyan, tick } = useThemeColorRefs(palette)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 3.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65
      arr[i * 3 + 2] = r * Math.cos(phi) * 0.55
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    tick(delta)
    mat.current.color.copy(cyan.current)
    points.current.rotation.y += delta * 0.06
    points.current.rotation.x = THREE.MathUtils.lerp(
      points.current.rotation.x,
      pointer.current.y * 0.2,
      Math.min(delta * 1.5, 1)
    )
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.035}
        color="#00f0ff"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function BgScene({ palette, pointer, mode }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 4, 4]} intensity={28} color={palette.cyan} />
      <pointLight position={[-4, -2, 3]} intensity={20} color={palette.violet} />

      <CameraRig pointer={pointer} />

      <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.7}>
        <HaloCore palette={palette} pointer={pointer} />
        <OrbitRing palette={palette} />
      </Float>

      <ParticlesShell palette={palette} pointer={pointer} count={mode === 'lite' ? 200 : 460} />

      <Stars radius={40} depth={35} count={mode === 'lite' ? 500 : 1300} factor={3} saturation={0} fade speed={1} />

      {mode === 'full' && (
        <Sparkles count={70} scale={[9, 5, 5]} size={2} speed={0.35} color={palette.fuchsia} opacity={0.5} />
      )}
    </>
  )
}

export default function DynamicBackground({ theme = 'dark' }) {
  const mode = useMemo(detectMode, [])
  const palette = PALETTES[theme] || PALETTES.dark
  const pointer = usePointer()

  if (mode === 'off') return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={mode === 'lite' ? [1, 1] : [1, 1.5]}
        frameloop="always"
        camera={{ position: [0, 0, 4.4], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <AdaptiveDpr pixelated />
        <BgScene palette={palette} pointer={pointer} mode={mode} />
      </Canvas>
    </div>
  )
}