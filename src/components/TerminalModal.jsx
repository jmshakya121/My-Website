import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, X } from 'lucide-react'
import { PROFILE, SOFTWARE_ITEMS } from '../data/profile'

const HELP = [
  ['help', 'Show this help screen'],
  ['ls | tools', 'List all downloadable scripts'],
  ['download <id>', 'Trigger the download gate for a script'],
  ['whoami', 'Developer bio & portfolio summary'],
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
  const [lines, setLines] = useState([
    { type: 'accent', text: 'JM SHAKYA - Developer Terminal v1.0' },
    { type: 'info', text: "Type 'help' to see available commands." },
  ])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines, open])

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
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
            text: `  ${it.id.padEnd(30)} ${it.name} (${it.type})`,
          })),
        ])
        break
      case 'whoami':
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
      case 'download': {
        if (!arg) {
          push([...base, { type: 'err', text: "Usage: download <id>. Try: download windows-activator" }])
          break
        }
        const item = SOFTWARE_ITEMS.find(
          (i) => i.id.toLowerCase() === arg.toLowerCase() ||
            i.name.toLowerCase().includes(arg.toLowerCase())
        )
        if (!item) {
          push([...base, { type: 'err', text: `Asset '${arg}' not found. Run 'ls' to list ids.` }])
          break
        }
        window.dispatchEvent(new CustomEvent('open-download-gate', { detail: { id: item.id } }))
        push([...base, { type: 'ok', text: `Opening gate for '${item.name}'...` }])
        break
      }
      case 'clear':
        setLines([])
        break
      default:
        push([...base, { type: 'err', text: `command not found: ${cmd} -- try 'help'` }])
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter') {
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

  const close = () => setOpen(false)

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 left-6 z-[90] flex items-center gap-2 px-4 py-3 rounded-xl glass-strong border border-neon-cyan/40 text-sm font-semibold text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.35)] transition-shadow duration-300"
        aria-label="Open terminal (Ctrl+K)"
      >
        <Terminal className="w-4 h-4 text-neon-cyan" />
        <span className="hidden sm:inline">Terminal</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="fixed bottom-24 left-4 sm:left-6 z-[90] w-[min(92vw,540px)] rounded-2xl overflow-hidden glass-strong border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                <span className="ml-3 font-mono text-xs text-white/60">jm@shakya: ~</span>
              </div>
              <button
                onClick={close}
                className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close terminal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="max-h-[300px] overflow-y-auto p-4 space-y-1 font-mono text-[13px]"
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

            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10 bg-black/40">
              <span className="font-mono text-sm text-neon-cyan">\u203A</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKey}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="type 'help'..."
                className="flex-1 bg-transparent font-mono text-sm text-white placeholder:text-white/25 focus:outline-none"
              />
              <span className="h-3.5 w-2 bg-neon-cyan animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}