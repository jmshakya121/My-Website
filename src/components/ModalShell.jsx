import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import useScrollLock from '../hooks/useScrollLock'
import useEscape from '../hooks/useEscape'

const PANEL_SPRING = { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 }

/**
 * Dimmed, tap-to-dismiss backdrop.
 *
 * - Locks body scroll (reference counted, so stacked overlays are safe).
 * - Closes on Escape.
 * - Bottom-sheet alignment below `sm` so the top of the dialog is reachable
 *   on short landscape phones, centred dialog on larger screens.
 */
export function ModalBackdrop({ onClose, z = 120, children, align = 'end' }) {
  useScrollLock(true)
  useEscape(true, onClose)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className={`fixed inset-0 flex justify-center overflow-hidden bg-black/70 backdrop-blur-md ${
        align === 'end' ? 'items-end sm:items-center p-0 sm:p-4' : 'items-center p-0 sm:p-4'
      }`}
      /* Inline rather than `z-[${z}]`: Tailwind's JIT scanner only sees
         literal class names, so a template-interpolated arbitrary value is
         never generated and the backdrop silently fell back to z-index 0. */
      style={{ zIndex: z, paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {children}
    </motion.div>
  )
}

/**
 * The dialog card itself.
 *
 * `max-h` is expressed against `--app-vh` (dvh where supported) so the panel
 * can never grow taller than the real visual viewport, which is what made
 * modals get cut off when the mobile keyboard opened.
 */
export function ModalPanel({
  onClick,
  className = '',
  maxWidth = 'max-w-xl',
  children,
}) {
  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0, y: 24 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.94, opacity: 0, y: 16 }}
      transition={PANEL_SPRING}
      onClick={onClick}
      className={`relative glass-strong border border-white/10 shadow-2xl w-full ${maxWidth} max-h-[calc(var(--app-vh)-1.5rem)] sm:max-h-[min(90dvh,48rem)] rounded-t-3xl sm:rounded-3xl flex flex-col min-h-0 ${className}`}
    >
      {children}
    </motion.div>
  )
}

/** Sticky header row used by the header-style dialogs. */
export function ModalHeader({ icon: Icon, iconClass = 'text-neon-cyan', iconWrap = 'bg-neon-cyan/10 border-neon-cyan/30', title, subtitle, onClose, closeLabel = 'Close' }) {
  return (
    <div className="relative shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-white/[0.04]">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${iconWrap}`}>
            <Icon className={`w-4 h-4 ${iconClass}`} />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{title}</h3>
          {subtitle && <p className="text-[11px] font-mono text-white/45 truncate">{subtitle}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="shrink-0 p-2 -mr-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white transition-colors active:bg-white/[0.16]"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

/** Scrollable dialog body. */
export function ModalBody({ className = '', children }) {
  return (
    <div
      className={`relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-5 sm:py-6 ${className}`}
    >
      {children}
    </div>
  )
}

/** Convenience: backdrop + panel + close handler in one. */
export default function ModalShell({
  onClose,
  z = 120,
  maxWidth = 'max-w-xl',
  panelClassName = '',
  bodyClassName = '',
  header,
  children,
  align = 'end',
  onPanelClick,
}) {
  const stop = useCallback((e) => e.stopPropagation(), [onPanelClick])

  return (
    <ModalBackdrop onClose={onClose} z={z} align={align}>
      <ModalPanel
        onClick={onPanelClick ? stop : undefined}
        maxWidth={maxWidth}
        className={panelClassName}
      >
        {header}
        <ModalBody className={bodyClassName}>{children}</ModalBody>
      </ModalPanel>
    </ModalBackdrop>
  )
}
