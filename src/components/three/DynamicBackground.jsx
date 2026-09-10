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

/* Procedural earth surface — ocean gradient + seeded landmasses + star speckle */
function createEarthTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  const grad = ctx.createLinearGradient(0, 0, 0, 512)
  grad.addColorStop(0, '#071f38')
  grad.addColorStop(0.5, '#0b2f4f')
  grad.addColorStop(1, '#071f38')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1024, 512)

  let seed = 42
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }

  const greens = ['#123f2a', '#1e5736', '#2a6b42', '#1c6340', '#174a31']
  for (let i = 0; i < 30; i++) {
    const cx = rand() * 1024
    const cy = 50 + rand() * 412
    const w = 30 + rand() * 120
    const h = 20 + rand() * 70
    ctx.beginPath()
    ctx.ellipse(cx, cy, w, h, rand() * Math.PI, 0, Math.PI * 2)
    ctx.fillStyle = greens[Math.floor(rand() * greens.length)]
    ctx.globalAlpha = 0.92
    ctx.fill()
    ctx.globalAlpha = 1
  }

  // coastal highlights + polar caps
  ctx.fillStyle = 'rgba(140, 190, 220, 0.12)'
  for (let i = 0; i < 60; i++) {
    const cx = rand() * 1024
    const cy = rand() * 512
    ctx.beginPath()
    ctx.arc(cx, cy, 1 + rand() * 3, 0, Math.PI * 2)
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const EARTH_POS = [2.4, 0.2, 0]

function Earth({ palette, pointer, lite, darkMode }) {
  const group = useRef()
  const earthMat = useRef()
  const atmosphereMat = useRef()
  const { cyan, violet, tick } = useThemeColorRefs(palette)
  const texture = useMemo(createEarthTexture, [])
  const segments = lite ? 32 : 48

  useFrame((state, delta) => {
    tick(delta)

    earthMat.current.emissive.copy(cyan.current)
    earthMat.current.emissiveIntensity = darkMode ? 0.18 : 0.08
    atmosphereMat.current.uniforms.uColor.value.copy(violet.current)

    const g = group.current
    g.rotation.y = THREE.MathUtils.lerp(
      g.rotation.y,
      pointer.current.x * 0.5,
      Math.min(delta * 1.8, 1)
    )
    g.rotation.x = THREE.MathUtils.lerp(
      g.rotation.x,
      pointer.current.y * 0.3,
      Math.min(delta * 1.8, 1)
    )
  })

  return (
    <group ref={group} position={EARTH_POS}>
      <mesh>
        <sphereGeometry args={[1.9, segments, segments]} />
        <meshStandardMaterial
          ref={earthMat}
          map={texture}
          roughness={0.65}
          metalness={0.15}
          emissive="#00f0ff"
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* tech wireframe shell */}
      <mesh scale={1.04}>
        <sphereGeometry args={[1.9, 24, 24]} />
        <meshBasicMaterial wireframe transparent opacity={0.12} color="#00f0ff" depthWrite={false} />
      </mesh>

      {/* glowing atmosphere — fresnel rim shader */}
      <mesh scale={1.14}>
        <sphereGeometry args={[1.9, 32, 32]} />
        <shaderMaterial
          ref={atmosphereMat}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            uniform vec3 uColor;
            void main() {
              float rim = pow(0.78 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
              gl_FragColor = vec4(uColor, rim * 0.9);
            }
          `}
          uniforms={{ uColor: { value: new THREE.Color(PALETTES.dark.violet) } }}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* orbit rings */}
      <mesh rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[2.75, 0.015, 8, 96]} />
        <meshStandardMaterial transparent opacity={0.35} emissive="#00f0ff" emissiveIntensity={1.4} metalness={0.8} roughness={0.2} color="#0ff" />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, -0.6, 0.4]} scale={1.12}>
        <torusGeometry args={[2.75, 0.008, 8, 96]} />
        <meshStandardMaterial transparent opacity={0.2} emissive="#a855f7" emissiveIntensity={1.2} metalness={0.8} roughness={0.2} color="#888" />
      </mesh>
    </group>
  )
}

function ParticlesShell({ palette, count }) {
  const points = useRef()
  const mat = useRef()
  const { cyan, tick } = useThemeColorRefs(palette)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7
      arr[i * 3 + 2] = r * Math.cos(phi) * 0.6
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    tick(delta)
    mat.current.color.copy(cyan.current)
    points.current.rotation.y += delta * 0.05
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
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function BgScene({ palette, pointer, mode, darkMode }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 4, 6]} intensity={2.2} color={palette.cyan} />
      <pointLight position={[-6, -3, 4]} intensity={26} color={palette.violet} />

      <CameraRig pointer={pointer} />

      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.35}>
        <Earth palette={palette} pointer={pointer} lite={mode === 'lite'} darkMode={darkMode} />
      </Float>

      <ParticlesShell palette={palette} count={mode === 'lite' ? 200 : 460} />

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
  const darkMode = theme === 'dark'

  if (mode === 'off') return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={mode === 'lite' ? [1, 1] : [1, 1.5]}
        frameloop="always"
        camera={{ position: [0, 0, 5.4], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <AdaptiveDpr pixelated />
        <BgScene palette={palette} pointer={pointer} mode={mode} darkMode={darkMode} />
      </Canvas>
    </div>
  )
}