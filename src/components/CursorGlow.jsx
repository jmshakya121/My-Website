import { useEffect, useRef, useState } from 'react'

/* Custom glowing cursor.
 *
 * Design constraints, all of which are functional rather than cosmetic:
 *  1. It is ADDITIVE. The real cursor is never hidden, so text selection, form
 *     fields, and native drag all keep working. Replacing the cursor entirely
 *     breaks every input on the site.
 *  2. It is transform-only and moved from a rAF loop writing to a single
 *     element's `transform`. No layout, no paint, no React state per frame.
 *  3. Pointer type is tracked. Touch and pen never get the ring — there is no
 *     cursor to follow, and a ring stuck under a finger reads as a glitch.
 *  4. Disabled entirely on coarse pointers and under reduced motion.
 */
export default function CursorGlow() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) return undefined

    setEnabled(true)

    // Target = true pointer position, eased = what actually gets drawn.
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const eased = { x: target.x, y: target.y }
    let scale = 1
    let targetScale = 1
    let visible = false
    let raf = 0

    // Exponential decay toward the target, expressed as a time constant in ms.
    // POS ~55ms reads as a smooth magnetic follow; SCALE is slower so the ring
    // swells and relaxes instead of snapping.
    const TAU_POS = 55
    const TAU_SCALE = 90
    // Resting thresholds. Position is sub-pixel; scale needs to be tighter
    // because it is multiplied into the transform and visibly pops otherwise.
    const EPS_POS = 0.15
    const EPS_SCALE = 0.0015

    let last = 0
    const wake = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') {
        visible = false
        wake()
        return
      }
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        visible = true
        // Snap on first entry, otherwise the ring flies in from centre screen.
        eased.x = target.x
        eased.y = target.y
      }
      wake()
    }

    // Grow over anything the user could plausibly be aiming at.
    const INTERACTIVE =
      'a, button, [role="button"], input, textarea, select, label, summary, [tabindex]:not([tabindex="-1"])'

    const onOver = (e) => {
      const next = e.target instanceof Element && e.target.closest(INTERACTIVE) ? 1.9 : 1
      if (next === targetScale) return
      targetScale = next
      wake()
    }

    const onLeave = () => { visible = false; wake() }
    const onEnter = () => { visible = true; wake() }

    /* The loop only runs while the easing is actually converging. Once the ring
       reaches the pointer and the scale settles, the rAF chain is cancelled
       outright, so an idle mouse costs zero frames and the compositor is free
       to go to sleep. Any input that changes a target calls wake(). */
    const isSettled = () =>
      Math.abs(target.x - eased.x) < EPS_POS &&
      Math.abs(target.y - eased.y) < EPS_POS &&
      Math.abs(targetScale - scale) < EPS_SCALE

    const loop = (now) => {
      raf = 0
      /* Real elapsed time, clamped. Without the clamp, returning to a
         backgrounded tab hands back a multi-second delta and the ring
         teleports on the first frame. */
      const dt = Math.min(64, now - last || 16.7)
      last = now
      // 1 - e^(-dt/tau) is the frame-rate independent form of "close the gap by
      // k each frame": it reaches the same point after the same wall-clock time
      // at 60Hz, 120Hz or 144Hz.
      const kp = 1 - Math.exp(-dt / TAU_POS)
      const ks = 1 - Math.exp(-dt / TAU_SCALE)

      eased.x += (target.x - eased.x) * kp
      eased.y += (target.y - eased.y) * kp
      scale += (targetScale - scale) * ks

      if (dot.current) {
        dot.current.style.transform =
          `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%)`
        dot.current.style.opacity = visible ? '1' : '0'
      }
      if (ring.current) {
        ring.current.style.transform =
          `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`
        ring.current.style.opacity = visible ? '1' : '0'
      }
      // Checked AFTER writing, so the frame that reaches the target is still
      // painted. Bailing out before the write would leave the ring one step
      // behind, and would never render at all on the first (snapped) move.
      if (!isSettled()) raf = requestAnimationFrame(loop)
    }
    // Nothing is animating yet, so don't start a frame. The first pointermove
    // will call wake().
    raf = 0

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      {/* `pointer-events-none` + fixed: the cursor can never intercept a click,
          and `will-change: transform` keeps it on its own compositor layer. */}
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] rounded-full opacity-0 transition-opacity duration-200 will-change-transform"
        style={{
          width: 28, height: 28, marginLeft: -14, marginTop: -14,
          border: '1.5px solid rgba(0, 240, 255, 0.75)',
          boxShadow: '0 0 12px rgba(0,240,255,0.55), inset 0 0 8px rgba(0,240,255,0.35)',
        }}
      />
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[201] rounded-full will-change-transform"
        style={{
          width: 5, height: 5, marginLeft: -2.5, marginTop: -2.5,
          background: '#00f0ff',
          boxShadow: '0 0 10px rgba(0,240,255,0.9), 0 0 22px rgba(168,85,247,0.5)',
          opacity: 0,
        }}
      />
    </>
  )
}
