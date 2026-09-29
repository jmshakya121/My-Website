import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, LayoutDashboard, Download, Wrench, Rss, FolderKanban, Send,
  Sun, Command, CornerDownLeft, Package, X,
} from 'lucide-react'
import { SOFTWARE_ITEMS } from '../data/profile'
import useScrollLock from '../hooks/useScrollLock'

const NAV_ITEMS = [
  { type: 'nav', key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { type: 'nav', key: 'software', label: 'Software Utilities', icon: Download },
  { type: 'nav', key: 'utilities', label: 'Web Utilities', icon: Wrench },
  { type: 'nav', key: 'projects', label: 'Projects', icon: FolderKanban },
  { type: 'nav', key: 'connect', label: 'Connect', icon: Rss },
  { type: 'nav', key: 'contact', label: 'Contact', icon: Send },
]

const ACTION_ITEMS = [
  {
    type: 'action',
    key: 'theme',
    label: 'Toggle Dark / Light mode',
    keywords: 'dark light theme mode appearance',
    icon: Sun,
  },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const items = useMemo(() => {
    const downloads = SOFTWARE_ITEMS.map((it) => ({
      type: 'download',
      key: `dl-${it.id}`,
      label: it.title || it.id,
      sub: `${it.category} · ${it.id}`,
      keywords: `${it.id} ${it.title} ${it.category} download script activator`,
      icon: Package,
      id: it.id,
    }))
    return [
      ...NAV_ITEMS.map((i) => ({ ...i, group: 'Go to', keywords: `${i.label} go jump open navigate tab` })),
      ...downloads.map((i) => ({ ...i, group: 'Downloads' })),
      ...ACTION_ITEMS.map((i) => ({ ...i, group: 'Actions' })),
    ]
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) =>
      `${it.label} ${it.sub || ''} ${it.keywords || ''}`.toLowerCase().includes(q)
    )
  }, [items, query])

  useScrollLock(open)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-command-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('open-command-palette', onOpen)
    }
  }, [open])

  useEffect(() => {
    setQuery('')
    setActive(0)
    if (!open) return undefined
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  const run = (item) => {
    if (item.type === 'nav') {
      window.dispatchEvent(new CustomEvent('navigate-view', { detail: item.key }))
    } else if (item.type === 'download') {
      window.dispatchEvent(
        new CustomEvent('open-software-download', { detail: { id: item.id } })
      )
    } else if (item.type === 'action' && item.key === 'theme') {
      window.dispatchEvent(new CustomEvent('toggle-theme'))
    }
    setOpen(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[active]) run(filtered[active])
    }
  }

  let lastGroup = null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          /* `dvh` rather than `vh`: classic vh does not shrink when the mobile
             keyboard opens, so the panel was pushed off screen. Centred with
             flex + max-height instead of a 15vh offset. */
          className="fixed inset-0 z-[110] flex items-start sm:items-center justify-center px-3 sm:px-4 pt-[calc(var(--sat)+0.75rem)] sm:pt-[10vh] pb-[calc(var(--sab)+0.75rem)] bg-black/70 backdrop-blur-md"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-2xl overflow-hidden glass-strong border border-white/15 shadow-2xl flex flex-col min-h-0 max-h-[calc(var(--app-vh)-1.5rem)]"
          >
            <div className="flex shrink-0 items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-white/10 bg-white/[0.04]">
              <Search className="w-5 h-5 text-neon-cyan shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search pages, scripts, actions…"
                enterKeyHint="search"
                className="flex-1 min-w-0 bg-transparent text-base text-white placeholder:text-white/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="sm:hidden p-1.5 -mr-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-white/40">
                <span className="px-1.5 py-0.5 rounded border border-white/20">ESC</span>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
              {filtered.length === 0 && (
                <p className="px-4 py-10 text-center text-sm text-white/40">
                  No results for "{query}"
                </p>
              )}

              {filtered.map((item, i) => {
                const groupHeader = item.group !== lastGroup
                lastGroup = item.group
                const Icon = item.icon || Package
                const isActive = i === active
                return (
                  <div key={item.key}>
                    {groupHeader && (
                      <p className="px-3 pt-3 pb-1 text-[10px] font-mono uppercase tracking-widest text-white/35">
                        {item.group}
                      </p>
                    )}
                    <button
                      onClick={() => run(item)}
                      onMouseEnter={() => setActive(i)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-150 ${
                        isActive
                          ? 'bg-gradient-to-r from-neon-cyan/15 to-neon-violet/15 border border-neon-cyan/30 text-white'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                          isActive ? 'border-neon-cyan/40 text-neon-cyan' : 'border-white/10 text-white/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{item.label}</span>
                        {item.sub && <span className="block truncate text-[10px] font-mono text-white/35">{item.sub}</span>}
                      </span>
                      <span className="ml-auto flex items-center gap-2 shrink-0">
                        {item.type === 'action' && (
                          <span className="text-[10px] font-mono text-white/35">{item.key === 'theme' ? `Dark / Light` : ''}</span>
                        )}
                        {isActive && (
                          <span className="flex items-center gap-0.5 text-[10px] font-mono text-neon-cyan">
                            <CornerDownLeft className="w-3 h-3" />
                          </span>
                        )}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="hidden sm:flex shrink-0 items-center justify-between px-5 py-3 border-t border-white/10 bg-white/[0.03] text-[10px] font-mono text-white/40">
              <span className="flex items-center gap-1.5">
                <Command className="w-3.5 h-3.5" /> K to open anytime
              </span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Sun className="w-3 h-3" /> ↑↓ navigate</span>
                <span className="flex items-center gap-1"><CornerDownLeft className="w-3 h-3" /> select</span>
                <span className="px-1.5 py-0.5 rounded border border-white/20">esc</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}