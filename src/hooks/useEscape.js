import { useEffect } from 'react'

/**
 * Calls `onEscape` when Escape is pressed.
 *
 * Escape always dismisses, even when a field inside the overlay has focus —
 * that is what people expect from a dialog, and silently doing nothing looked
 * like a broken modal. Pass `ignoreFormFields` for surfaces where the key
 * should be swallowed by the input instead.
 */
export default function useEscape(active, onEscape, { ignoreFormFields = false } = {}) {
  useEffect(() => {
    if (!active || typeof onEscape !== 'function') return undefined

    const onKeyDown = (event) => {
      if (event.key !== 'Escape' && event.key !== 'Esc') return

      if (ignoreFormFields) {
        const el = event.target
        if (
          el &&
          (el.tagName === 'INPUT' ||
            el.tagName === 'TEXTAREA' ||
            el.tagName === 'SELECT' ||
            el.isContentEditable)
        ) {
          return
        }
      }

      event.preventDefault()
      onEscape()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, onEscape, ignoreFormFields])
}
