import { useEffect, useState } from 'react'

/**
 * Subscribes to a CSS media query and re-renders on change.
 * Falls back to `false` during SSR / very old browsers without matchMedia.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false
    }
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }
    const mql = window.matchMedia(query)
    const onChange = (event) => setMatches(event.matches)

    setMatches(mql.matches)

    // Safari < 14 only has the deprecated addListener/removeListener pair.
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    }
    mql.addListener(onChange)
    return () => mql.removeListener(onChange)
  }, [query])

  return matches
}

/** True only on devices with a real, non-sticky hovering pointer. */
export function useHoverCapable() {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}

/** True when the primary input is a finger (phone / tablet). */
export function useCoarsePointer() {
  return useMediaQuery('(hover: none), (pointer: coarse)')
}

/** True when the user asked the OS to minimise animation. */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
