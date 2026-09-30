/**
 * Zero-GPU starfield fallback.
 *
 * Used when the 3D scene is disabled (phones, reduced-motion) or when WebGL is
 * unavailable or its context is lost. Pure CSS transforms and gradients, so it
 * cannot itself crash a GPU or drop a context — which is the whole point: on
 * iOS a lost context leaves a transparent canvas that reads as a black screen.
 *
 * Stars are a fixed, deterministic set rendered once as DOM nodes. Animating
 * `transform` only (never `top`/`left`/`filter`) keeps them on the compositor
 * and off the main thread.
 */

/* Seeded PRNG so the sky is identical between renders (no hydration flicker,
   no reshuffling on theme change). */
function makeRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const LAYERS = [
  { count: 26, size: 2, minDur: 26, maxDur: 42, minOpacity: 0.25, maxOpacity: 0.6 },
  { count: 18, size: 3, minDur: 18, maxDur: 30, minOpacity: 0.3, maxOpacity: 0.75 },
  { count: 8, size: 4, minDur: 12, maxDur: 22, minOpacity: 0.35, maxOpacity: 0.9 },
]

function buildStars() {
  const rand = makeRandom(20240617)
  return LAYERS.map((layer, li) =>
    Array.from({ length: layer.count }, (_, i) => ({
      key: `${li}-${i}`,
      left: rand() * 100,
      top: rand() * 100,
      size: layer.size,
      duration: layer.minDur + rand() * (layer.maxDur - layer.minDur),
      delay: -rand() * layer.maxDur, // negative so they start mid-cycle
      opacity: layer.minOpacity + rand() * (layer.maxOpacity - layer.minOpacity),
    }))
  )
}

const STAR_LAYERS = buildStars()

export default function CssStarfield({ theme = 'dark' }) {
  const dark = theme === 'dark'

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      data-testid="css-starfield"
    >
      {/* Base wash — stands in for the 3D scene's ambient/depth gradient. */}
      <div
        className="absolute inset-0"
        style={{
          background: dark
            ? 'radial-gradient(120% 90% at 50% 15%, #0b1b3a 0%, #060b1c 45%, #03060f 100%)'
            : 'radial-gradient(120% 90% at 50% 15%, #dbeafe 0%, #eef2ff 45%, #f8fafc 100%)',
        }}
      />

      {STAR_LAYERS.map((layer, li) => (
        <div key={li} className="absolute inset-0">
          {layer.map((s) => (
            <span
              key={s.key}
              className="css-star"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                opacity: s.opacity,
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
                background: dark
                  ? (li === 2 ? '#e879f9' : li === 1 ? '#a5f3fc' : '#ffffff')
                  : (li === 2 ? '#a21caf' : li === 1 ? '#0e7490' : '#475569'),
              }}
            />
          ))}
        </div>
      ))}

      {/* Drifting glow blobs, matching the 3D scene's cyan/violet key lights. */}
      <div
        className="css-drift absolute rounded-full"
        style={{
          top: '-18%',
          left: '-14%',
          width: '58%',
          aspectRatio: '1',
          background: 'radial-gradient(circle, rgba(0,240,255,0.16) 0%, rgba(0,240,255,0) 70%)',
          animationDuration: '34s',
        }}
      />
      <div
        className="css-drift absolute rounded-full"
        style={{
          bottom: '-22%',
          right: '-16%',
          width: '62%',
          aspectRatio: '1',
          background: 'radial-gradient(circle, rgba(168,85,247,0.16) 0%, rgba(168,85,247,0) 70%)',
          animationDuration: '46s',
          animationDirection: 'reverse',
        }}
      />
    </div>
  )
}
