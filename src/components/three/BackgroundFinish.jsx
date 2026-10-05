/* Photographic finish laid over whichever renderer produced the background —
   WebGL or the CSS fallback. Lives here, above the renderer split, so both
   paths get an identical treatment and swapping between them (a context loss, a
   resize past a breakpoint) is not a visible jump in grade or text legibility.

   Scrim and vignette invert with the theme. The hero is white text in dark mode
   and near-black in light mode, so the column it occupies must be darkened in
   one and lightened in the other. Hardcoding either one leaves the heading
   unreadable in the other theme while still looking correct in whichever theme
   you happen to be looking at. */
const OVERLAYS = {
  dark: {
    vignette:
      'radial-gradient(125% 95% at 62% 42%, transparent 38%, rgba(0,0,0,0.28) 78%, rgba(0,0,0,0.62) 100%)',
    scrim:
      'linear-gradient(100deg, rgba(3,6,12,0.72) 0%, rgba(3,6,12,0.44) 38%, rgba(3,6,12,0.08) 66%, transparent 100%)',
  },
  light: {
    vignette:
      'radial-gradient(125% 95% at 62% 42%, transparent 42%, rgba(150,180,206,0.20) 80%, rgba(120,158,190,0.48) 100%)',
    scrim:
      'linear-gradient(100deg, rgba(238,245,251,0.86) 0%, rgba(238,245,251,0.62) 38%, rgba(238,245,251,0.14) 66%, transparent 100%)',
  },
}

export default function BackgroundFinish({ theme = 'dark' }) {
  const o = OVERLAYS[theme] || OVERLAYS.dark
  return (
    <>
      {/* Grain and vignette are what stop a clean procedural scene from reading
          as flat vector art — real camera output always carries both. Pure CSS
          on their own layers, so they survive even if no canvas ever draws. */}
      <div className="absolute inset-0 bg-grain" />
      <div className="absolute inset-0" style={{ background: o.vignette }} />
      {/* Darkens/lightens only the text column, leaving the sun side open. */}
      <div className="absolute inset-0" style={{ background: o.scrim }} />
    </>
  )
}
