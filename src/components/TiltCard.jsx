import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import { useHoverCapable, useReducedMotion } from '../hooks/useMediaQuery'

/* Shared 3D tilt + mouse-following neon border.
 *
 * The important detail is that pointer position lives in Framer MotionValues,
 * NOT React state. A `useState` version re-renders the whole card subtree on
 * every pointermove — at 60-120Hz that is a React commit per frame and the tilt
 * visibly lags behind the cursor. MotionValues write straight to the style
 * transform off the render loop, so moving the mouse never triggers React.
 *
 * The neon border is a separate absolutely-positioned layer using the
 * padding-box/border-box background trick: a transparent `padding-box` sits on
 * top of an opaque `border-box` gradient, so only the 1px border ring shows the
 * gradient. That gives a true border that follows the cursor, which a
 * `box-shadow` cannot do (box-shadow cannot be masked to the edge).
 */
export default function TiltCard({
  children,
  className = '',
  intensity = 9,
  glow = true,
  glowColor = '0, 240, 255',
  glowColor2 = '168, 85, 247',
  as: Tag = motion.div,
  ...props
}) {
  const ref = useRef(null)
  const canHover = useHoverCapable()
  const reduceMotion = useReducedMotion()
  // Tilt is a decorative depth cue. It is pointless (and a jank source) when
  // either the pointer is a finger or the user asked for less motion.
  const tiltActive = canHover && !reduceMotion

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const rotateX = useSpring(
    useTransform(py, [0, 1], [intensity, -intensity]),
    { stiffness: 170, damping: 22, mass: 0.6 }
  )
  const rotateY = useSpring(
    useTransform(px, [0, 1], [-intensity, intensity]),
    { stiffness: 170, damping: 22, mass: 0.6 }
  )

  // A wider, softer pool of light inside the card.
  const glowX = useTransform(px, (v) => `${Math.round(v * 100)}%`)
  const glowY = useTransform(py, (v) => `${Math.round(v * 100)}%`)
  const glowBg = useMotionTemplate`radial-gradient(380px circle at ${glowX} ${glowY}, rgba(${glowColor}, 0.10), rgba(${glowColor2}, 0.06), transparent 65%)`

  // The border ring itself. `border-box` carries the gradient; `padding-box`
  // is painted over it, leaving only the border width visible.
  //
  // The leading `linear-gradient(transparent, transparent)` MUST be part of the
  // same useMotionTemplate. Composing it in a plain JS template literal
  // (`${borderGrad}`) stringifies the MotionValue into "[object Object]" and the
  // border silently renders with no gradient at all.
  const borderGrad = useMotionTemplate`linear-gradient(transparent, transparent), radial-gradient(220px circle at ${glowX} ${glowY}, rgba(${glowColor}, 0.95), rgba(${glowColor2}, 0.55) 45%, rgba(${glowColor2}, 0.08) 75%, transparent 100%)`

  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  /* Pointer events (not mouse events) with an explicit mouse-only guard.
     `onMouseMove` also fires for the synthetic mouse events iOS/Android emit
     on tap, and those never produce a matching mouseleave — the card used to
     stay frozen at a tilt until you tapped somewhere else. */
  const onPointerMove = (e) => {
    if (!canHover || e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }

  return (
    <Tag
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onPointerUp={reset}
      onTouchEnd={reset}
      style={{
        transformPerspective: 1000,
        // rotateX/rotateY resolve to 0 when tilt is off, so the transform is
        // inert on touch rather than being conditionally applied (which would
        // cause a style recalculation on every pointer type change).
        rotateX: tiltActive ? rotateX : 0,
        rotateY: tiltActive ? rotateY : 0,
        // Only promote while a real pointer is over the card. A permanent
        // will-change keeps a GPU texture alive per card, which is a real
        // memory cost on budget phones — and this page renders a lot of cards.
        willChange: canHover ? 'transform' : 'auto',
      }}
      className={`relative group ${className}`}
      {...props}
    >
      {glow && canHover && (
        <>
          {/* Neon border ring that tracks the cursor.
              Layer order is load-bearing: the opaque fill is listed FIRST so it
              paints on top, clipped to the padding-box, and therefore hides the
              gradient everywhere except the 1px padding ring. Reversing the two
              makes the glow cover the whole card face. No mask needed. */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              padding: '1px',
              // Assigned directly, never interpolated into a string.
              backgroundImage: borderGrad,
              backgroundOrigin: 'padding-box, border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          />
          {/* Interior light pool, so the card lights up as well as outlining. */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glowBg }}
          />
        </>
      )}
      {children}
    </Tag>
  )
}
