import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* A real-looking sea, rather than the neon lattice this replaced.
 *
 * Realism here comes almost entirely from four cheap cues, none of which need a
 * real light, shadow map, or reflection probe:
 *   1. Fresnel. Water is a near-perfect mirror at grazing angles and nearly
 *      transparent looking straight down. Without a Fresnel term, any surface
 *      shading looks like painted plastic — this is the single biggest
 *      realism-per-millisecond win available.
 *   2. A reflected sky. Reflecting the same analytic sky function the sky dome
 *      uses keeps the two consistent for free (no second render target).
 *   3. A tight specular sun glint. Real water is defined by that elongated
 *      highlight; a broad Blinn lobe plus a very tight one approximates it.
 *   4. Distance haze. Real cameras and real eyes lose contrast with distance.
 *      This is also what hides the water plane's far edge — without it the
 *      scene reads as a rectangle floating in space, which instantly looks fake.
 *
 * Everything is analytic and single-pass: 3 draw calls, no post-processing.
 * A bloom pass would be the obvious "make it look nicer" move and is exactly
 * wrong here — it costs a fullscreen blur and is the main reason glowing WebGL
 * backgrounds tank on mid-range phones.
 */

/* Geometry budget per tier. The fragment shader does the lighting, so this
   mostly controls how smoothly the silhouette of distant waves resolves. */
export const TIER_SETTINGS = {
  full: { segments: 128, plane: 900, motes: 340 },
  lite: { segments: 96, plane: 900, motes: 190 },
  mobile: { segments: 56, plane: 700, motes: 90 },
}

/* Low and off to the right: a high sun flattens the specular streak into an
   unrecognisable blob, and putting it on the left puts the brightest region of
   the frame underneath the hero copy. */
const SUN_DIR = new THREE.Vector3(0.62, 0.115, -1).normalize()

/* Module-level scratch vector for the per-frame pointer raycast. Allocated once
   on purpose: building it inside useFrame would put a fresh Vector3 on the
   garbage heap 60 times a second for the life of the page. */
const scratch = new THREE.Vector3()

/* Shared uniforms object. One instance is created per scene and passed to all
   three materials, so a single per-frame write keeps sky, water and haze in
   agreement. Deliberately NOT recreated per frame — that would re-upload every
   uniform to the GPU 60 times a second. */
function useSceneUniforms(theme, motes) {
  return useMemo(() => {
    const c = (hex) => new THREE.Color(hex).convertSRGBToLinear()
    const p = theme === 'light' ? LIGHT : DARK
    return {
      uTime: { value: 0 },
      uPointerMix: { value: 0 },
      uPointer: { value: new THREE.Vector2(999, 999) },
      uSunDir: { value: SUN_DIR.clone() },
      uSkyTop: { value: c(p.skyTop) },
      uSkyHorizon: { value: c(p.skyHorizon) },
      uSunColor: { value: c(p.sun) },
      uWaterDeep: { value: c(p.waterDeep) },
      uWaterShallow: { value: c(p.waterShallow) },
      uMoteColor: { value: c(p.mote) },
      uMoteSize: { value: motes > 150 ? 46 : 34 },
      uSunIntensity: { value: theme === 'light' ? 1.0 : 1.25 },
      /* Declared here, not created on first frame: three.js snapshots the
         uniform map when the program links, so a uniform that appears a frame
         late is silently ignored by the motes shader. */
      uPixelRatio: { value: 1 },
    }
  }, [theme, motes])
}

/* Palette values are sRGB hex and converted to linear on upload; the shader
   works in linear and lets three's colorspace chunk do the encode on output.
   Dark is a dusk sea: deep navy water against a slightly warmer horizon, so the
   hero's white text keeps a large, dark, low-contrast region to sit on. */
const DARK = {
  skyTop: '#050a14',
  skyHorizon: '#1b2f47',
  sun: '#ff9d5c',
  waterDeep: '#03070e',
  waterShallow: '#123246',
  mote: '#bcd6ff',
}

const LIGHT = {
  skyTop: '#6f9dc4',
  skyHorizon: '#dbe6ee',
  sun: '#fff6dd',
  waterDeep: '#0f3348',
  waterShallow: '#3a8ba3',
  mote: '#ffffff',
}

/* ---------------- shared GLSL ---------------- */

/* Analytic sky. Used by the dome AND by the water's reflection term, which is
   why the two can never disagree. */
const SKY_GLSL = `
  uniform vec3 uSkyTop;
  uniform vec3 uSkyHorizon;
  uniform vec3 uSunColor;
  uniform vec3 uSunDir;
  uniform float uSunIntensity;

  vec3 skyColor(vec3 dir) {
    float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
    /* pow < 1 pushes the gradient toward the horizon, which is where a real
       sky carries most of its colour. A linear mix puts the bright band too
       high and reads as a flat studio backdrop. */
    vec3 c = mix(uSkyHorizon, uSkyTop, pow(h, 0.42));
    float sd = max(dot(dir, uSunDir), 0.0);
    /* Very tight disc for the sun itself, plus a wide, weak halo. The halo is
       what sells "atmospheric scattering" at a distance. */
    c += uSunColor * pow(sd, 1400.0) * 6.0 * uSunIntensity;
    c += uSunColor * pow(sd, 9.0) * 0.16 * uSunIntensity;
    return c;
  }
`

/* One height function, shared by the vertex displacement and the fragment
   normals. If these ever diverged, lighting would stop matching the geometry —
   the classic tell of a fake-looking water shader. */
const WAVE_GLSL = `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPointerMix;

  float waveHeight(vec2 p, float t) {
    float h = 0.0;
    h += sin(p.x * 0.21 + t * 0.52) * 0.62;
    h += sin(p.y * 0.16 - t * 0.41) * 0.47;
    h += sin((p.x * 0.48 + p.y * 0.33) * 0.62 + t * 0.88) * 0.19;
    /* Cursor disturbance: concentric rings decaying with distance, so moving
       the mouse leaves a wake instead of dragging a dent along with it. */
    float d = distance(p, uPointer);
    h += sin(d * 1.9 - t * 2.6) * exp(-d * 0.30) * 0.30 * uPointerMix;
    return h;
  }
`

/* ---------------- sky dome ---------------- */

const SKY_VERT = `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    /* Translation stripped: the dome must ride with the camera, or the horizon
       slides as soon as the camera dollies. */
    mat4 v = viewMatrix;
    v[3].xyz = vec3(0.0);
    gl_Position = projectionMatrix * v * modelMatrix * vec4(position, 1.0);
  }
`

const SKY_FRAG = `
  ${SKY_GLSL}
  varying vec3 vDir;
  void main() {
    gl_FragColor = vec4(skyColor(normalize(vDir)), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

function SkyDome({ uniforms }) {
  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <sphereGeometry args={[400, 32, 20]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={SKY_VERT}
        fragmentShader={SKY_FRAG}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ---------------- water ---------------- */

const WATER_VERT = `
  ${WAVE_GLSL}
  varying vec3 vWorld;
  varying float vHeight;
  void main() {
    vec3 p = position;
    float h = waveHeight(p.xz, uTime);
    p.y += h;
    vHeight = h;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const WATER_FRAG = `
  ${SKY_GLSL}
  ${WAVE_GLSL}
  /* uSunIntensity already arrives via SKY_GLSL — declaring it again here is a
     redefinition and GLSL fails the whole program to compile. */
  uniform vec3 uWaterDeep;
  uniform vec3 uWaterShallow;

  varying vec3 vWorld;
  varying float vHeight;

  void main() {
    /* Normal from forward differences against the interpolated vertex height.
       Two extra height evaluations instead of a central difference's four —
       halves the transcendental cost, and the half-texel bias is invisible at
       these wavelengths. */
    const float e = 0.6;
    float hx = waveHeight(vWorld.xz + vec2(e, 0.0), uTime);
    float hz = waveHeight(vWorld.xz + vec2(0.0, e), uTime);
    vec3 N = normalize(vec3(-(hx - vHeight) / e, 1.0, -(hz - vHeight) / e));

    vec3 V = normalize(cameraPosition - vWorld);
    vec3 L = uSunDir;

    /* Fresnel via Schlick. Water's F0 is ~0.02, so looking straight down it is
       nearly transparent (you see the body colour) and at grazing angles it
       approaches a mirror. */
    float fres = 0.02 + 0.98 * pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 5.0);

    /* Reflect the same sky function, so the reflection always matches the sky
       it is reflecting. No render target, no second scene pass. */
    vec3 refl = skyColor(normalize(reflect(-V, N)));

    /* Body colour by height: troughs read deeper, crests catch more light. */
    float depthT = clamp(vHeight * 0.62 + 0.5, 0.0, 1.0);
    vec3 body = mix(uWaterDeep, uWaterShallow, depthT);

    /* Two specular lobes: a broad sheen for the general glitter path, and a
       very tight one for the sun's own reflection. One lobe alone either
       misses the glint or blows out the whole surface. */
    vec3 H = normalize(L + V);
    float ndh = max(dot(N, H), 0.0);
    float sheen = pow(ndh, 22.0) * 0.10;
    float glint = pow(ndh, 320.0) * 1.9;

    /* Whitecaps on the steep faces of the tallest crests. Keyed off the surface
       slope rather than absolute height so the foam moves with the waves
       instead of forming a fixed band. */
    float slope = 1.0 - N.y;
    float foam = smoothstep(0.055, 0.16, slope) * smoothstep(0.15, 0.62, depthT);

    vec3 col = mix(body, refl, clamp(fres, 0.0, 1.0));
    col += uSunColor * (sheen + glint) * uSunIntensity;
    col = mix(col, vec3(0.82, 0.87, 0.93), foam * 0.45);

    /* Aerial perspective. Also the thing that hides the plane's far edge —
       without this the sea reads as a rectangle floating in the void. */
    float dist = length(cameraPosition - vWorld);
    float haze = 1.0 - exp(-dist * 0.0125);
    vec3 air = skyColor(normalize(vWorld - cameraPosition));
    col = mix(col, air, clamp(haze, 0.0, 1.0));

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

function Water({ uniforms, segments, plane }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} frustumCulled={false}>
      <planeGeometry args={[plane, plane, segments, segments]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={WATER_VERT}
        fragmentShader={WATER_FRAG}
      />
    </mesh>
  )
}

/* ---------------- airborne dust ---------------- */

const MOTE_VERT = `
  uniform float uTime;
  uniform float uMoteSize;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vFade;

  void main() {
    vec3 p = position;
    /* Slow lateral drift plus a gentle rise, each mote offset by its seed so
       they do not move in lockstep. Wrapping on a modulo keeps them inside the
       volume forever with no respawn logic. */
    float t = uTime;
    p.x += sin(t * 0.09 + aSeed * 6.2831) * 3.2;
    p.z += cos(t * 0.07 + aSeed * 4.1) * 3.2;
    p.y = mod(p.y + t * (0.25 + aSeed * 0.35), 26.0) - 2.0;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    /* Fade motes that are very near or very far. Near ones would otherwise
       smear across the whole screen as huge out-of-focus blobs. */
    float d = -mv.z;
    vFade = smoothstep(1.5, 6.0, d) * (1.0 - smoothstep(45.0, 110.0, d));
    gl_PointSize = uMoteSize * (0.4 + aSeed * 0.9) * uPixelRatio * (12.0 / d);
    gl_Position = projectionMatrix * mv;
  }
`

const MOTE_FRAG = `
  uniform vec3 uMoteColor;
  varying float vFade;
  void main() {
    float r = length(gl_PointCoord - vec2(0.5));
    if (r > 0.5) discard;
    /* Soft radial falloff plus a small bright core = defocused bokeh without
       needing a depth-of-field pass. */
    float soft = smoothstep(0.5, 0.0, r);
    float core = smoothstep(0.16, 0.0, r);
    float a = (soft * 0.35 + core * 0.65) * vFade;
    gl_FragColor = vec4(uMoteColor, a * 0.5);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

function DustMotes({ uniforms, count, seed = 7 }) {
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    /* Deterministic PRNG so the layout is stable across reloads and does not
       reshuffle on every React remount. */
    let s = seed
    const rnd = () => {
      s = (s * 16807) % 2147483647
      return (s - 1) / 2147483646
    }
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rnd() - 0.5) * 130
      pos[i * 3 + 1] = rnd() * 26 - 2
      pos[i * 3 + 2] = (rnd() - 0.5) * 130 - 30
      seeds[i] = rnd()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    return g
  }, [count, seed])

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={MOTE_VERT}
        fragmentShader={MOTE_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ---------------- camera ---------------- */

/* Just above the waterline looking out to sea. Kept low deliberately: a high
   camera turns the Fresnel term flat and the water stops reading as water. */
function CameraRig({ pointer }) {
  const base = useRef(new THREE.Vector3(0, 2.6, 12))
  const look = useRef(new THREE.Vector3(0, 1.2, -30))
  useFrame((state, delta) => {
    const k = 1 - Math.exp(-Math.min(delta, 0.05) * 1.5)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, base.current.x + pointer.current.x * 1.6, k)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, base.current.y + pointer.current.y * 0.35, k)
    state.camera.lookAt(look.current)
  })
  return null
}

export default function OceanScene({ pointer, theme, tier = 'full', pixelRatio = 1 }) {
  const cfg = TIER_SETTINGS[tier] || TIER_SETTINGS.full
  const uniforms = useSceneUniforms(theme, cfg.motes)
  const pointerXZ = useRef(new THREE.Vector2(999, 999))

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uPixelRatio.value = state.viewport.dpr || pixelRatio

    /* Raycast the pointer onto the water plane so the cursor wake stays under
       the cursor regardless of where the camera has dollied to. Skipped when
       the ray points at or above the horizon, where the plane has no
       intersection, so the previous wake position is kept. */
    scratch.set(pointer.current.x, pointer.current.y, 0.5).unproject(state.camera)
    scratch.sub(state.camera.position).normalize()
    if (scratch.y < -1e-4) {
      const t = -state.camera.position.y / scratch.y
      if (t > 0) {
        pointerXZ.current.set(
          state.camera.position.x + scratch.x * t,
          state.camera.position.z + scratch.z * t
        )
      }
    }

    const k = 1 - Math.exp(-dt * 3.0)
    uniforms.uPointerMix.value += (1 - uniforms.uPointerMix.value) * k
    uniforms.uPointer.value.x += (pointerXZ.current.x - uniforms.uPointer.value.x) * k
    uniforms.uPointer.value.y += (pointerXZ.current.y - uniforms.uPointer.value.y) * k
  })

  return (
    <>
      <CameraRig pointer={pointer} />
      <SkyDome uniforms={uniforms} />
      <Water uniforms={uniforms} segments={cfg.segments} plane={cfg.plane} />
      <DustMotes uniforms={uniforms} count={cfg.motes} />
    </>
  )
}
