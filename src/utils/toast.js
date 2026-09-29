let seq = 0

export function showToast(message, opts = {}) {
  window.dispatchEvent(
    new CustomEvent('jm-toast', {
      detail: {
        id: ++seq,
        message,
        kind: opts.kind || 'success',
        description: opts.description || '',
        duration: opts.duration || 2800,
      },
    })
  )
}