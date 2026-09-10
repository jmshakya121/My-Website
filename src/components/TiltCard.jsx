import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

export default function TiltCard({
  children,
  className = '',
  intensity = 9,
  glow = true,
  ...props
}) {
  const ref = useRef(null)
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

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }

  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformPerspective: 1000, rotateX, rotateY }}
      className={`relative group ${className}`}
      {...props}
    >
      {glow && (
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