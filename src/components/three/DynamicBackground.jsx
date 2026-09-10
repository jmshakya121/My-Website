import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Float, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'

const PALETTES = {
  dark: { cyan: '#00f0ff', violet: '#a855f7', fuchsia: '#e879f9' },
  light: { cyan: '#0e7490', violet: '#6d28d9', fuchsia: '#a21caf' },
}

const STAR_VERT = `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aPhase;
  attribute float aSize;
  varying float vTwinkle;
  void main() {
    float tw = 0.5 + 0.5 * sin(uTime * (1.1 + aPhase * 1.7) + aPhase * 6.2831);
    vTwinkle = tw;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (1.5 + aSize * 2.6) * (0.35 + 0.65 * tw) * uPixelRatio * (260.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const STAR_FRAG = `
  uniform vec3 uColor;
  varying float vTwinkle;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;
    float f = smoothstep(0.5, 0.0, d);
    vec3 col = mix(vec3(1.0), uColor, 0.6);
    gl_FragColor = vec4(col, f * (0.18 + 0.82 * vTwinkle));
  }
`

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

/* Soft radial glow sprite used for star clusters */
function makeGlowTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.45)')
  g.addColorStop(0.6, 'rgba(255,255,255,0.1)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
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
        <meshBasicMaterial wireframe transparent opacity={0.1} color="#00f0ff" depthWrite={false} />
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
        <meshStandardMaterial transparent opacity={0.32} emissive="#00f0ff" emissiveIntensity={1.4} metalness={0.8} roughness={0.2} color="#0ff" />
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

/* Twinkling deep-space starfield — GPU shader shimmer + slow drift */
function TwinklingStars({ palette, count }) {
  const points = useRef()
  const mat = useRef()
  const uTime = useRef({ value: 0 })

  const { positions, phases, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const r = 34 + Math.random() * 40
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.62
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.85
      phases[i] = Math.random()
      sizes[i] = Math.random()
    }
    return { positions, phases, sizes }
  }, [count])

  useFrame((_, delta) => {
    uTime.current.value += delta
    mat.current.uniforms.uTime.value = uTime.current.value
    points.current.rotation.y += delta * 0.006
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={STAR_VERT}
        fragmentShader={STAR_FRAG}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(palette.cyan) },
          uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.5) },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* Subtle soft star-clusters — slow-pulsing glow sprites */
function StarClusters({ palette, count }) {
  const group = useRef()
  const mats = useRef([])
  const texture = useMemo(makeGlowTexture, [])
  const data = useMemo(() => {
    const tints = [palette.cyan, palette.violet, palette.fuchsia, '#ffffff']
    const arr = []
    for (let i = 0; i < count; i++) {
      const r = 48 + Math.random() * 34
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr.push({
        position: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) * 0.6,
          r * Math.cos(phi) * 0.8,
        ],
        scale: 6 + Math.random() * 12,
        color: tints[Math.floor(Math.random() * tints.length)],
        base: 0.14 + Math.random() * 0.18,
        speed: 0.25 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [count, palette.cyan, palette.violet, palette.fuchsia])

  const bases = useMemo(() => data.map((d) => d.base), [data])
  const speeds = useMemo(() => data.map((d) => d.speed), [data])
  const phases = useMemo(() => data.map((d) => d.phase), [data])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    for (let i = 0; i < mats.current.length; i++) {
      const m = mats.current[i]
      if (m) m.opacity = bases[i] * (0.55 + 0.45 * Math.sin(t * speeds[i] + phases[i]))
    }
    group.current.rotation.y += delta * 0.004
  })

  return (
    <group ref={group}>
      {data.map((d, i) => (
        <sprite key={i} position={d.position} scale={d.scale}>
          <spriteMaterial
            ref={(el) => (mats.current[i] = el)}
            map={texture}
            color={d.color}
            opacity={d.base}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  )
}

function BgScene({ palette, pointer, mode, darkMode, starCount, clusterCount }) {
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

      <TwinklingStars palette={palette} count={starCount} />
      <StarClusters palette={palette} count={clusterCount} />

      {mode === 'full' && (
        <Sparkles count={60} scale={[9, 5, 5]} size={2} speed={0.35} color={palette.fuchsia} opacity={0.45} />
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

  const starCount = mode === 'lite' ? 650 : 1400
  const clusterCount = mode === 'lite' ? 4 : 10

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        camera={{ position: [0, 0, 5.4], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
      >
        <AdaptiveDpr pixelated />
        <BgScene
          palette={palette}
          pointer={pointer}
          mode={mode}
          darkMode={darkMode}
          starCount={starCount}
          clusterCount={clusterCount}
        />
      </Canvas>
    </div>
  )
}