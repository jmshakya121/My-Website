import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import CssSeascape from './CssSeascape.jsx'
import OceanScene from './OceanScene.jsx'

/* Quality tiers. 'mobile' is a real WebGL scene, not the CSS fallback: phones
   get a much smaller mesh and particle count with a capped DPR, which is
   affordable. Flip MOBILE_WEBGL to false to hand phones back the CSS
   starfield and keep three.js out of their bundle entirely. */
const MOBILE_WEBGL = true
const MOBILE_BREAKPOINT = 768

function detectMode() {
  if (typeof window === 'undefined') return 'off'
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off'

  const isMobileUA =
    /Android|iPhone|iPad|iPod|Mobi|Mobile|Silk|Kindle|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.userAgentData && navigator.userAgentData.mobile)

  const narrow = window.innerWidth < MOBILE_BREAKPOINT
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches

  if ((narrow || isMobileUA || coarse) && !MOBILE_WEBGL) return 'off'
  if (narrow || isMobileUA) return 'mobile'

  const cores = navigator.hardwareConcurrency || 8
  const memory = navigator.deviceMemory || 8
  if (cores <= 4 || memory <= 4) return 'lite'
  return 'full'
}

/* Can we actually get a WebGL context? A driver that refuses (old iOS, blocklisted
   GPU) would otherwise throw inside the Canvas constructor and take the whole
   React tree down with it. Probed ONCE and memoised — each probe burns a real
   GPU context, and browsers cap concurrent contexts at around 16, so probing on
   every render would itself exhaust the limit. */
let webglSupport = null
function webglAvailable() {
  if (webglSupport !== null) return webglSupport
  if (typeof document === 'undefined') return false
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl')
    webglSupport = !!gl
    // Free the probe context immediately.
    const lose = gl && gl.getExtension('WEBGL_lose_context')
    if (lose) lose.loseContext()
  } catch {
    webglSupport = false
  }
  return webglSupport
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

export default function DynamicBackground({ theme = 'dark' }) {
  const mode = useMemo(detectMode, [])
  // Probed once, and only when the scene is actually going to be used.
  const hasWebGL = useMemo(() => (mode === 'off' ? false : webglAvailable()), [mode])
  const pointer = usePointer()
  const [pageVisible, setPageVisible] = useState(true)

  // Stop burning GPU while the tab is in the background — otherwise a phone
  // with this site pinned in a background tab keeps rendering at full rate.
  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  /* WebGL context loss / recovery.
     iOS Safari reclaims GPU contexts aggressively — most often when returning
     from an external ad tab. The canvas then renders nothing and the page reads
     as a solid black screen, even though the DOM is intact. Handling the events
     directly is the only reliable fix:
       - on `lost`, preventDefault() (this is what marks the event as handled and
         is REQUIRED for `restored` to ever fire) and freeze the render loop;
       - on `restored`, let three.js rebuild its resources and resume.
     If the context cannot be recovered, fall back to the CSS starfield so the
     page is never left black. */
  const [contextLost, setContextLost] = useState(false)
  const [glFailed, setGlFailed] = useState(false)
  const [generation, setGeneration] = useState(0)
  // Detach function for the currently bound canvas. Held in a ref because
  // `onCreated` fires when the Canvas mounts, which is NOT a point at which an
  // effect can observe it — a `useEffect` reading a canvas ref runs first and
  // sees null, so the listeners would never attach.
  const detachRef = useRef(null)

  const onCreated = useCallback((state) => {
    const canvas = state.gl.domElement
    if (!canvas) return

    // Drop any previous binding (generation bump creates a new canvas).
    if (detachRef.current) detachRef.current()

    const onLost = (event) => {
      // Without preventDefault the browser will not attempt restoration.
      event.preventDefault()
      setContextLost(true)
    }
    const onRestored = () => {
      setContextLost(false)
      // Bumping the key forces a clean remount of the whole scene, so stale
      // GPU resources from the lost context are not reused.
      setGeneration((g) => g + 1)
    }

    canvas.addEventListener('webglcontextlost', onLost, false)
    canvas.addEventListener('webglcontextrestored', onRestored, false)
    detachRef.current = () => {
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      detachRef.current = null
    }
  }, [])

  useEffect(() => () => {
    if (detachRef.current) detachRef.current()
  }, [])

  if (mode === 'off') return null

  // No WebGL at all: CSS-only sky, and no canvas is ever created.
  if (glFailed || !hasWebGL) {
    return <CssSeascape theme={theme} />
  }

  // Geometry budget per tier (see TIER_SETTINGS in OceanScene.jsx):
  //   full  128 seg / 340 motes   lite  96 / 190   mobile 56 / 90
  const tier = mode === 'mobile' ? 'mobile' : mode === 'lite' ? 'lite' : 'full'
  // A phone GPU pays a lot for antialias and for DPR above 1, so both are cut.
  const dprCap = mode === 'mobile' ? 1.25 : mode === 'lite' ? 1.25 : 1.5

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {/* Rendered BEHIND the canvas at all times, and the canvas is transparent
          (`alpha: true`). When the GPU context dies mid-frame the canvas stops
          painting and this shows through — which is what turns a black screen
          into a static sea. The canvas is deliberately NOT unmounted on loss:
          `webglcontextrestored` only ever fires on a live canvas element, so
          removing it would make recovery impossible by construction. */}
      <CssSeascape theme={theme} />
      <Canvas
        key={generation}
        dpr={[1, dprCap]}
        frameloop={contextLost || !pageVisible ? 'never' : 'always'}
        camera={{ position: [0, 2.6, 12], fov: 48 }}
        onCreated={onCreated}
        fallback={null}
        onError={() => setGlFailed(true)}
        gl={{
          antialias: mode === 'full',
          alpha: true,
          powerPreference: mode === 'mobile' ? 'low-power' : 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        <AdaptiveDpr pixelated />
        <OceanScene
          pointer={pointer}
          theme={theme}
          tier={tier}
          pixelRatio={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, dprCap)}
        />
      </Canvas>
      {/* Grain, vignette and the text scrim are applied one level up, in
          BackgroundFX, so that the WebGL path and the CSS fallback get an
          identical grade. */}
    </div>
  )
}
