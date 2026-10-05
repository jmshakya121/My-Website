/* Zero-GPU seascape for devices that must not get WebGL: phones, coarse
   pointers, and anyone who prefers reduced motion.

   Deliberately a static gradient composition rather than a canvas. It exists to
   keep the site looking like a coherent sea on hardware where three.js is
   either too risky (iOS Safari reclaims GPU contexts, which previously left this
   page a black rectangle) or unwanted (reduced motion). It costs no GPU memory,
   cannot lose a context, and adds nothing to the JS bundle.

   The horizon sits at 65% height and the sun is right of centre, matching
   OceanScene so swapping between the two paths is not a visible jump. */
const HORIZON = 65

const SEA = {
  dark: {
    sky: 'linear-gradient(to bottom, #050a14 0%, #0b1725 34%, #16283d 58%, #1b2f47 65%, #1b2f47 65.4%)',
    water: 'linear-gradient(to bottom, #14293d 65.4%, #0b1926 82%, #040a12 100%)',
    sun: 'radial-gradient(circle at 88% 63%, rgba(255,157,92,0.42) 0%, rgba(255,157,92,0.14) 7%, transparent 19%)',
    haze: 'radial-gradient(ellipse 130% 34% at 78% 65%, rgba(120,170,220,0.18) 0%, transparent 70%)',
    line: 'rgba(160,205,240,0.30)',
    motes:
      'radial-gradient(circle at 22% 30%, rgba(188,214,255,0.16) 0 1.5px, transparent 2.5px),' +
      'radial-gradient(circle at 71% 22%, rgba(188,214,255,0.13) 0 1px, transparent 2px),' +
      'radial-gradient(circle at 47% 41%, rgba(188,214,255,0.11) 0 1px, transparent 2px),' +
      'radial-gradient(circle at 84% 44%, rgba(188,214,255,0.10) 0 1.5px, transparent 2.5px)',
  },
  light: {
    sky: 'linear-gradient(to bottom, #6f9dc4 0%, #a3c1d8 34%, #ccdde9 58%, #dbe6ee 65%, #dbe6ee 65.4%)',
    water: 'linear-gradient(to bottom, #c4d9e4 65.4%, #7fb0c4 82%, #2f6b85 100%)',
    sun: 'radial-gradient(circle at 88% 63%, rgba(255,246,221,0.85) 0%, rgba(255,246,221,0.30) 7%, transparent 20%)',
    haze: 'radial-gradient(ellipse 130% 34% at 78% 65%, rgba(255,255,255,0.55) 0%, transparent 70%)',
    line: 'rgba(255,255,255,0.65)',
    motes: 'none',
  },
}

export default function CssSeascape({ theme = 'dark' }) {
  const p = SEA[theme] || SEA.dark
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: p.sky }} />
      <div
        className="absolute inset-x-0"
        style={{ top: `${HORIZON}%`, bottom: 0, background: p.water }}
      />
      {/* Horizon glow, then the one-pixel hairline that sells the distance. */}
      <div className="absolute inset-0" style={{ background: p.haze }} />
      <div className="absolute inset-0" style={{ background: p.sun }} />
      <div
        className="absolute inset-x-0"
        style={{ top: `${HORIZON}%`, height: 1, background: p.line }}
      />
      {/* A handful of dust motes so the empty regions are not perfectly flat. */}
      <div className="absolute inset-0" style={{ background: p.motes }} />
    </div>
  )
}
