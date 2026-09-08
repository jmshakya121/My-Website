import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sparkles, MeshDistortMaterial } from '@react-three/drei'

function ParticleField({ count = 500 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [count])

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.y += 0.0006
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00f0ff"
        size={0.02}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function SceneTorus() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = state.clock.elapsedTime * 0.5
    ref.current.rotation.y = state.clock.elapsedTime * 0.4
  })
  return (
    <mesh ref={ref} position={[3.2, 1.4, -3]}>
      <torusKnotGeometry args={[0.75, 0.22, 100, 16]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#a855f7"
        emissiveIntensity={1.6}
        roughness={0.2}
        metalness={0.7}
      />
    </mesh>
  )
}

function SceneSphere() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = -1.4 + Math.sin(state.clock.elapsedTime * 0.7) * 0.3
    ref.current.rotation.y = state.clock.elapsedTime * 0.3
  })
  return (
    <mesh ref={ref} position={[-3.4, -1.4, -2]}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <MeshDistortMaterial
        color="#00f0ff"
        emissive="#00f0ff"
        emissiveIntensity={0.8}
        distort={0.35}
        speed={1.5}
        wireframe
      />
    </mesh>
  )
}

function SceneGrid() {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    ref.current.position.z = 0
  })
  return (
    <gridHelper ref={ref} args={[30, 30, '#00f0ff', '#a855f7']} position={[0, -2.8, 0]} />
  )
}

function SceneRig({ children }) {
  useFrame((state) => {
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.25
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.1) * 0.15
    state.camera.lookAt(0, 0, 0)
  })
  return children
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <fog attach="fog" args={['#05050a', 10, 24]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 5, 5]} intensity={60} color="#00f0ff" />
      <pointLight position={[-6, -4, 3]} intensity={45} color="#a855f7" />
      <SceneRig>
        <ParticleField />
        <SceneTorus />
        <SceneSphere />
        <SceneGrid />
        <Stars radius={60} depth={40} count={2500} factor={4} saturation={0} fade speed={0.5} />
        <Sparkles count={150} scale={12} size={2.5} speed={0.5} color="#e879f9" />
      </SceneRig>
    </Canvas>
  )
}