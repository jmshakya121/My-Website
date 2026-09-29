/**
 * Clipboard write with a legacy fallback.
 *
 * `navigator.clipboard` is unavailable on insecure origins and older mobile
 * browsers, and it rejects when the document is not focused — both common on
 * phones, so the `execCommand` path has to be solid.
 */
import { showToast } from './toast'

export async function copyText(text) {
  if (typeof text !== 'string') return false

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      /* fall through to the legacy path */
    }
  }

  if (typeof document === 'undefined' || !document.body) return false

  let ta = null
  try {
    ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    /* Park it off-screen *without* letting it influence layout. `position:
       fixed` with no offsets falls back to its static position on some
       mobile browsers, which shifts the page and can scroll it. */
    ta.style.position = 'fixed'
    ta.style.top = '0'
    ta.style.left = '0'
    ta.style.width = '1px'
    ta.style.height = '1px'
    ta.style.padding = '0'
    ta.style.border = 'none'
    ta.style.outline = 'none'
    ta.style.boxShadow = 'none'
    ta.style.background = 'transparent'
    ta.style.opacity = '0'
    ta.style.zIndex = '-1'
    ta.style.fontSize = '16px' // stops iOS Safari zooming on focus

    document.body.appendChild(ta)
    ta.focus({ preventScroll: true })
    ta.select()
    ta.setSelectionRange(0, text.length)

    const ok = typeof document.execCommand === 'function' && document.execCommand('copy')
    return Boolean(ok)
  } catch {
    return false
  } finally {
    if (ta && ta.parentNode) ta.parentNode.removeChild(ta)
  }
}

/**
 * Copy + report the real outcome.
 *
 * Every call site used to fire an unconditional "copied!" toast, so a rejected
 * clipboard write (insecure origin, unfocused document, denied permission) told
 * the user something that never happened.
 */
export async function copyWithToast(text, { message = 'Copied to clipboard', description = '', kind = 'copy' } = {}) {
  const ok = await copyText(text)
  if (ok) {
    showToast(message, { kind, description })
  } else {
    showToast('Copy failed — long-press and copy manually.', {
      kind: 'error',
      description: text.length > 80 ? `${text.slice(0, 80)}…` : text,
    })
  }
  return ok
}
