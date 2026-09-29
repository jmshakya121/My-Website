import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Info, Terminal, Copy, AlertTriangle } from 'lucide-react'

const kindStyles = {
  success: {
    icon: Check,
    iconColor: 'text-emerald-400',
    border: 'border-emerald-400/40',
  },
  info: {
    icon: Info,
    iconColor: 'text-neon-cyan',
    border: 'border-neon-cyan/40',
  },
  copy: {
    icon: Terminal,
    iconColor: 'text-neon-violet',
    border: 'border-neon-violet/40',
  },
  /* Without this, a failed action fell through to `success` and rendered a
     green checkmark next to the error text. */
  error: {
    icon: AlertTriangle,
    iconColor: 'text-rose-400',
    border: 'border-rose-400/40',
  },
}

export default function ToastHost() {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  useEffect(() => {
    const onToast = (e) => {
      const { id, message, kind, description, duration } = e.detail || {}
      /* Re-dispatching the same id (double-tap) restarts its timer rather
         than stacking a duplicate. */
      const existing = timers.current.get(id)
      if (existing) clearTimeout(existing)

      setToasts((t) => [...t.slice(-2), { id, message, kind, description }])

      const handle = setTimeout(() => {
        timers.current.delete(id)
        setToasts((list) => list.filter((x) => x.id !== id))
      }, duration || 2800)
      timers.current.set(id, handle)
    }

    window.addEventListener('jm-toast', onToast)
    return () => {
      window.removeEventListener('jm-toast', onToast)
      timers.current.forEach(clearTimeout)
      timers.current.clear()
    }
  }, [])

  return (
    /* Sits above the terminal FAB + scroll-to-top button stack so a toast
       never covers the controls underneath it on a narrow phone. */
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[160] flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-4"
      style={{ bottom: 'calc(var(--sab) + 6.25rem)' }}
      aria-live="polite"
      aria-atomic="false"
      role="status"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const style = kindStyles[t.kind] || kindStyles.success
          const Icon = style.icon
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              className={`flex items-center gap-3 w-full glass-strong rounded-2xl px-4 py-3 border ${style.border} shadow-[0_10px_40px_rgba(0,0,0,0.5)]`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] border ${style.border}`}>
                <Icon className={`w-4 h-4 ${style.iconColor}`} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white leading-snug truncate">{t.message}</p>
                {t.description && (
                  <p className="text-[11px] font-mono text-white/50 truncate flex items-center gap-1">
                    <Copy className="w-3 h-3 shrink-0" /> {t.description}
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}