import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import { useHoverCapable } from '../hooks/useMediaQuery'

export default function TiltCard({
  children,
  className = '',
  intensity = 9,
  glow = true,
  ...props
}) {
  const ref = useRef(null)
  const canHover = useHoverCapable()

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

  const glowX = useTransform(px, (v) => `${Math.round(v * 100)}%`)
  const glowY = useTransform(py, (v) => `${Math.round(v * 100)}%`)
  const glowBg = useMotionTemplate`radial-gradient(380px circle at ${glowX} ${glowY}, rgba(0, 240, 255, 0.09), rgba(168, 85, 247, 0.06), transparent 65%)`

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
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onPointerUp={reset}
      onTouchEnd={reset}
      style={{
        transformPerspective: 1000,
        rotateX,
        rotateY,
        // Only promote while a real pointer is over the card. A permanent
        // will-change keeps a GPU texture alive per card, which is a real
        // memory cost on budget phones.
        willChange: canHover ? 'transform' : 'auto',
      }}
      className={`relative group ${className}`}
      {...props}
    >
      {glow && canHover && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glowBg }}
        />
      )}
      {children}
    </motion.div>
  )
}
