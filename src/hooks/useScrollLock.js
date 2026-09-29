import { useEffect } from 'react'

/**
 * Reference-counted body scroll lock.
 *
 * Several overlays can be open at once (mobile nav menu + command palette,
 * palette + utility modal). Independent `body.style.overflow = ...` writers
 * used to fight each other: closing one released the lock while another was
 * still open, letting the page scroll behind a visible overlay. A counter
 * means the page only unlocks once every consumer has released it.
 */

/* iOS Safari ignores `overflow: hidden` on <body>, so an overlay opened on a
   phone still let the page scroll behind it. Detect it so we can pin the body
   instead. iPadOS 13+ reports itself as "Mac", hence the touch-point check. */
function isIOS() {
  if (typeof navigator === 'undefined') return false
  const platform = navigator.platform || navigator.userAgent || ''
  return (
    /iP(ad|hone|od)/.test(platform) ||
    (/Mac/.test(platform) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1)
  )
}

let lockCount = 0
let saved = null

function acquire() {
  if (typeof document === 'undefined') return
  lockCount += 1
  if (lockCount > 1) return

  const { body, documentElement } = document
  const scrollY = window.scrollY || documentElement.scrollTop || 0

  saved = {
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight,
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    scrollY,
  }

  // Compensate for the scrollbar that `overflow: hidden` removes, otherwise
  // the whole layout shifts sideways as soon as a modal opens.
  const scrollbarWidth = window.innerWidth - documentElement.clientWidth
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth + (parseInt(saved.paddingRight, 10) || 0)}px`
  }

  if (isIOS()) {
    // Pin the body. Fixed descendants still resolve against the viewport, so
    // the modals, navbar and FABs keep their positions.
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
  } else {
    body.style.overflow = 'hidden'
  }
}

function release() {
  if (typeof document === 'undefined') return
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount > 0 || !saved) return

  const { body } = document
  const wasIOS = isIOS()
  const { scrollY } = saved

  body.style.overflow = saved.overflow
  body.style.paddingRight = saved.paddingRight
  body.style.position = saved.position
  body.style.top = saved.top
  body.style.left = saved.left
  body.style.right = saved.right
  body.style.width = saved.width
  saved = null

  // The pinned body lost the real scroll offset; put it back.
  if (wasIOS) window.scrollTo(0, scrollY)
}

/**
 * @param {boolean} active  Lock the page while `active` is true.
 * @param {object}  [options]
 * @param {boolean} [options.enabled] Set false to skip locking entirely.
 */
export default function useScrollLock(active, { enabled = true } = {}) {
  useEffect(() => {
    if (!active || !enabled) return undefined
    acquire()
    return release
  }, [active, enabled])
}
