import { useEffect, useState } from 'react'
import { ScrollText, Keyboard, Info } from 'lucide-react'
import UtilityModal from './UtilityModal.jsx'

const ROWS = [
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
  ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ControlRight'],
]

const LABELS = {
  Backquote: '`', Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4', Digit5: '5',
  Digit6: '6', Digit7: '7', Digit8: '8', Digit9: '9', Digit0: '0', Minus: '-', Equal: '=',
  Backslash: '\\', BracketLeft: '[', BracketRight: ']', Semicolon: ';', Quote: "'",
  Comma: ',', Period: '.', Slash: '/',
}

/* Abbreviated labels so the widest keys stay legible once the layout has to
   shrink to fit a 320px phone. The full name is still exposed as a tooltip
   and to assistive tech. */
const SHORT_LABELS = {
  Backspace: 'Bksp', CapsLock: 'Caps', ShiftLeft: 'Shift', ShiftRight: 'Shift',
  ControlLeft: 'Ctrl', ControlRight: 'Ctrl', MetaLeft: 'Cmd', MetaRight: 'Cmd',
  AltLeft: 'Alt', AltRight: 'Alt', Space: 'Space', Enter: 'Enter', Tab: 'Tab',
}

const WIDE = new Set(['Backspace', 'Tab', 'CapsLock', 'Enter', 'ShiftLeft', 'ShiftRight', 'Space', 'ControlLeft', 'ControlRight', 'MetaLeft', 'MetaRight', 'AltLeft', 'AltRight'])

/* Only swallow keys the browser would otherwise use to scroll the page. We
   must not block modifier combinations (Cmd+C, Ctrl+R …) or anything typed
   into a real input. */
const SWALLOW = new Set([
  ' ', 'Spacebar', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'PageUp', 'PageDown', 'Home', 'End', 'Tab',
])

function fullLabel(code) {
  if (code === 'Space') return 'Space'
  return LABELS[code] || code.replace(/^Key/, '').replace(/^Digit(\d)$/, '$1')
}

function shortLabel(code) {
  return SHORT_LABELS[code] || fullLabel(code)
}

export default function KeyboardTestModal({ onClose }) {
  const [pressed, setPressed] = useState(new Set())
  const [log, setLog] = useState([])
  const [touchOnly, setTouchOnly] = useState(false)

  useEffect(() => {
    // Phones/tablets have no physical keys to test — say so instead of
    // showing a dead layout and a log that can never fill.
    const isTouchOnly =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(hover: none), (pointer: coarse)').matches &&
      !('KeyboardEvent' in window)
    setTouchOnly(isTouchOnly)
  }, [])

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return
      }
      if (SWALLOW.has(e.key)) e.preventDefault()
      setPressed((s) => {
        const next = new Set(s)
        next.add(e.code)
        return next
      })
      setLog((l) => [{ key: e.key === ' ' ? '?' : e.key, code: e.code, type: 'keydown' }, ...l].slice(0, 8))
    }
    const up = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (SWALLOW.has(e.key)) e.preventDefault()
      setPressed((s) => {
        const next = new Set(s)
        next.delete(e.code)
        return next
      })
    }
    const blur = () => setPressed(new Set())

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
    }
  }, [])

  return (
    <UtilityModal title="Keyboard Input Test" subtitle="press any key to verify switch response" onClose={onClose} wide>
      <div className="select-none">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="flex items-center gap-1.5 text-xs font-mono text-white/60 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2">
            <Keyboard className="w-4 h-4 text-neon-cyan shrink-0" /> {pressed.size} keys active
          </span>
          <span className="text-[11px] font-mono text-white/45 flex-1 min-w-[180px]">
            Every key registers both keydown and keyup — a dead switch never lights up.
          </span>
        </div>

        {touchOnly && (
          <p className="flex items-start gap-2 text-[11px] font-mono text-amber-200/90 bg-amber-400/[0.07] border border-amber-400/25 rounded-xl px-3 py-2.5 mb-4">
            <Info className="w-4 h-4 shrink-0 mt-px" />
            This device has no physical keyboard, so use an external keyboard or
            switch to a desktop browser to run the full test.
          </p>
        )}

        {/* `overflow-x-auto` is a backstop: the layout below is sized to fit a
            320px viewport, but an unexpected label can never push the page wide. */}
        <div className="-mx-1 px-1 overflow-x-auto overscroll-contain">
          <div className="space-y-1.5 sm:space-y-2 mb-5 min-w-[260px]">
            {ROWS.map((row, ri) => (
              <div key={ri} className="flex gap-1 sm:gap-1.5">
                {row.map((code) => {
                  const isDown = pressed.has(code)
                  return (
                    <span
                      key={code}
                      title={fullLabel(code)}
                      aria-label={fullLabel(code)}
                      className={`min-w-0 flex items-center justify-center rounded-lg border font-mono leading-none transition-all duration-75 ${
                        WIDE.has(code) ? 'flex-[1.4_1_0%]' : 'flex-[1_1_9%]'
                      } h-9 sm:h-12 px-0.5 text-[9px] sm:text-[11px] ${
                        isDown
                          ? 'bg-neon-cyan/25 border-neon-cyan text-white shadow-[0_0_18px_rgba(0,240,255,0.5)]'
                          : 'bg-white/[0.04] border-white/10 text-white/55'
                      }`}
                    >
                      <span className="truncate">{shortLabel(code)}</span>
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-3 flex items-center gap-1.5">
            <ScrollText className="w-3.5 h-3.5 text-neon-violet" /> live event log
          </p>
          {log.length === 0 ? (
            <p className="text-xs font-mono text-white/35">Start typing — events appear here…</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {log.map((evt, i) => (
                <div key={`${evt.code}-${evt.type}-${i}`} className="min-w-0 rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2">
                  <p className="text-sm font-bold font-mono text-white truncate">
                    {evt.key}
                    <span className={`text-[10px] font-normal ${evt.type === 'keydown' ? 'text-emerald-400' : 'text-white/40'}`}>
                      {' '}{evt.type}
                    </span>
                  </p>
                  <p className="text-[10px] font-mono text-white/40 truncate">{evt.code}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UtilityModal>
  )
}
