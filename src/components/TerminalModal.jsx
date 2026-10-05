import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, X } from 'lucide-react'
import { PROFILE, SOFTWARE_ITEMS } from '../data/profile'
import useScrollLock from '../hooks/useScrollLock'
import useEscape from '../hooks/useEscape'

const HELP = [
  ['help', 'Show this help screen'],
  ['ls | tools', 'List all downloadable scripts'],
  ['download <id>', 'Download a script straight from this site'],
  ['utilities', 'Jump to the web utilities'],
  ['contact', 'Jump to the contact form'],
  ['whoami | about', 'Developer bio & portfolio summary'],
  ['theme', 'Toggle dark / light mode'],
  ['clear', 'Clear the terminal'],
]

const lineClass = {
  cmd: 'text-white font-semibold',
  out: 'text-white/85',
  ok: 'text-emerald-400',
  err: 'text-rose-400',
  info: 'text-white/40',
  accent: 'text-neon-cyan',
}

export default function TerminalModal() {
  const [open, setOpen] = useState(false)
  /* Stable identity, otherwise the Escape effect re-subscribes on every
     keystroke typed into the prompt. */
  const close = useCallback(() => setOpen(false), [])
  const [lines, setLines] = useState([
    { type: 'accent', text: 'JM SHAKYA - Developer Terminal v1.0' },
    { type: 'info', text: "Type 'help' to see available commands." },
  ])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const panelRef = useRef(null)

  useScrollLock(open)
  useEscape(open, close)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines, open])

  useEffect(() => {
    if (!open) return undefined
    // The on-screen keyboard steals vertical space, so keep the panel top-anchored.
    if (panelRef.current) panelRef.current.scrollTop = 0
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [open])

  const push = (pts) => setLines((prev) => [...prev, ...pts])

  const run = (raw) => {
    const input = raw.trim()
    const base = [{ type: 'cmd', text: `\u203A ${input}` }]
    setValue('')
    if (!input) {
      push(base)
      return
    }
    setHistory((h) => [...h, input])
    setHistIdx(-1)

    const [cmd, ...rest] = input.split(/\s+/)
    const arg = rest.join(' ')

    switch (cmd.toLowerCase()) {
      case 'help':
        push([
          ...base,
          { type: 'out', text: 'Available commands:' },
          ...HELP.map(([c, d]) => ({ type: 'ok', text: `  ${c.padEnd(20)} ${d}` })),
        ])
        break
      case 'ls':
      case 'tools':
        push([
          ...base,
          { type: 'out', text: `Found ${SOFTWARE_ITEMS.length} assets in the download hub:` },
          ...SOFTWARE_ITEMS.map((it) => ({
            type: 'ok',
            text: `  ${it.id.padEnd(30)} ${it.title || it.name}`,
          })),
        ])
        break
      case 'whoami':
      case 'about':
        push([
          ...base,
          { type: 'accent', text: PROFILE.name },
          { type: 'out', text: PROFILE.title },
          { type: 'out', text: `Location: ${PROFILE.location} (${PROFILE.postalCode})` },
          { type: 'out', text: `Email: ${PROFILE.contact.email}` },
          { type: 'out', text: `Site: ${PROFILE.domain}  GitHub: ${PROFILE.github}` },
          { type: 'info', text: 'Full-stack dev building web apps, 3D interactive experiences, and utility scripts.' },
        ])
        break
      case 'theme':
      case 'mode':
        window.dispatchEvent(new CustomEvent('toggle-theme'))
        push([...base, { type: 'ok', text: 'Theme toggled — look around, it reapplies everywhere.' }])
        break
      case 'download': {
        if (!arg) {
          push([...base, { type: 'err', text: "Usage: download <id>. Try: download windows-activator" }])
          break
        }
        const item = SOFTWARE_ITEMS.find(
          (i) => i.id.toLowerCase() === arg.toLowerCase() ||
            (i.name || '').toLowerCase().includes(arg.toLowerCase())
        )
        if (!item) {
          push([...base, { type: 'err', text: `Asset '${arg}' not found. Run 'ls' to list ids.` }])
          break
        }
        window.dispatchEvent(
          new CustomEvent('open-software-download', { detail: { id: item.id } })
        )
        push([...base, { type: 'ok', text: `Switching to Software Utilities and opening '${item.title || item.id}'...` }])
        break
      }
      case 'clear':
        setLines([])
        break
      case 'utilities':
        window.dispatchEvent(new CustomEvent('navigate-view', { detail: 'utilities' }))
        push([...base, { type: 'ok', text: 'Switching to Web Utilities...' }])
        break
      case 'contact': {
        window.dispatchEvent(new CustomEvent('navigate-view', { detail: 'contact' }))
        push([
          ...base,
          { type: 'ok', text: 'Switching to Contact...' },
          { type: 'out', text: `Email: ${PROFILE.contact.email}` },
          { type: 'out', text: `Phone: ${PROFILE.contact.phone}` },
        ])
        break
      }
      default:
        push([...base, { type: 'err', text: `command not found: ${cmd} -- try 'help'` }])
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      run(value)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length) {
        const idx = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1)
        setHistIdx(idx)
        setValue(history[idx])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx >= 0) {
        const idx = histIdx + 1
        if (idx >= history.length) {
          setHistIdx(-1)
          setValue('')
        } else {
          setHistIdx(idx)
          setValue(history[idx])
        }
      }
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        /* Clears the iPhone home indicator, and sits below the scroll-to-top
           button so the two never overlap. */
        className="fixed left-4 sm:left-6 z-[90] flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-xl glass-strong border border-neon-cyan/40 text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.35)] active:scale-95 transition-shadow duration-300"
        style={{ bottom: 'calc(var(--sab) + 1rem)' }}
        aria-label="Open terminal"
        aria-expanded={open}
      >
        <Terminal className="w-4 h-4 text-neon-cyan" />
        <span className="hidden sm:inline text-sm font-semibold">Terminal</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Developer terminal"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            /* Full-width sheet on phones so 92vw + a left offset can't spill
               past the right edge; `dvh` keeps it on screen when the mobile
               keyboard opens. */
            className="fixed left-0 right-0 sm:left-6 sm:right-auto sm:w-[min(92vw,540px)] z-[90] max-h-[min(60dvh,420px)] flex flex-col overflow-hidden glass-strong border-y sm:border border-white/10 shadow-2xl"
            style={{ bottom: 'calc(var(--sab) + 4.75rem)' }}
          >
            <div className="flex shrink-0 items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.04]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-3 w-3 shrink-0 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 shrink-0 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 shrink-0 rounded-full bg-emerald-400/80" />
                <span className="ml-2 sm:ml-3 font-mono text-xs text-white/60 truncate">jm@shakya: ~</span>
              </div>
              <button
                type="button"
                onClick={close}
                className="p-1.5 -mr-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors shrink-0"
                aria-label="Close terminal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-1 font-mono text-[13px]"
            >
              {lines.map((l, i) => (
                <p
                  key={i}
                  className={`whitespace-pre-wrap break-words leading-relaxed ${lineClass[l.type] || lineClass.out}`}
                >
                  {l.text}
                </p>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2 px-4 py-3 border-t border-white/10 bg-white/[0.04]">
              <span className="font-mono text-sm text-neon-cyan">{'\u203A'}</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKey}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="send"
                placeholder="type 'help'..."
                className="flex-1 min-w-0 bg-transparent font-mono text-sm text-white placeholder:text-white/25 focus:outline-none"
              />
              <span className="h-3.5 w-2 shrink-0 bg-neon-cyan animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
