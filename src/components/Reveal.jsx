import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useMediaQuery'

/* Shared scroll-reveal for section content.
 *
 * Centralised so the timing stays consistent across the page and so there is a
 * single place to honour reduced motion. Framer Motion's `whileInView` is
 * viewport-driven rather than scroll-driven, so it fires once as the element
 * crosses the threshold and never fights a scroll-linked animation.
 *
 * `once: true` is deliberate. Re-animating every time an element re-enters the
 * viewport is distracting, and on a long page it means constant layout work
 * while scrolling.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 20,
  className = '',
  as: Tag = motion.div,
  ...props
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    // No offset, no fade — content is simply present. Rendering it hidden and
    // relying on IntersectionObserver would risk it staying invisible if the
    // observer never fires.
    const Plain = typeof Tag === 'string' ? Tag : 'div'
    return <Plain className={className} {...props}>{children}</Plain>
  }

  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  )
}
