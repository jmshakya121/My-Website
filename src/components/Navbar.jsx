import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Menu, X, Sparkles, Terminal, Sun, Moon, Search } from 'lucide-react'
import { PROFILE } from '../data/profile'
import useScrollLock from '../hooks/useScrollLock'

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'software', label: 'Software Utilities' },
  { key: 'utilities', label: 'Web Utilities' },
  { key: 'projects', label: 'Projects' },
  { key: 'connect', label: 'Connect' },
  { key: 'contact', label: 'Contact' },
]

export default function Navbar({ view = 'dashboard', onNavigate, theme = 'dark', toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(68)
  const toggleRef = useRef(null)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 30)
        frame = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  /* The header is 64px when scrolled and 68px when not, because the padding
     changes. A hard-coded `top-[64px]` therefore left a 4px strip of scrolling
     content poking out from behind the open mobile menu. Measure it instead. */
  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return undefined
    const measure = () => setHeaderHeight(el.offsetHeight)
    measure()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* Reference-counted so the command palette can open on top of this menu
     without either one releasing the page scroll lock early. */
  useScrollLock(open)

  /* Rotating a tablet or resizing a desktop window past `lg` leaves the
     mobile menu "open" but off-screen, trapping the scroll lock. */
  useEffect(() => {
    if (!open) return undefined
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => {
      if (e.matches) setOpen(false)
    }
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    }
    mq.addListener(onChange)
    return () => mq.removeListener(onChange)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        setOpen(false)
        if (toggleRef.current) toggleRef.current.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const handleTab = (key) => {
    setOpen(false)
    if (onNavigate) onNavigate(key)
  }

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled || open
          ? 'bg-body/80 backdrop-blur-2xl border-b border-white/10 py-2.5'
          : 'bg-transparent py-3'
      }`}
      style={{ paddingTop: 'calc(var(--sat) + 0.75rem)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand */}
        <button
          type="button"
          onClick={() => handleTab('dashboard')}
          className="flex items-center gap-2 sm:gap-2.5 group shrink-0 text-left"
          aria-label="Go to Dashboard"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 overflow-hidden p-1.5 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-neon-cyan" />
          </div>
          <div className="flex flex-col items-start leading-tight min-w-0">
            <span className="font-mono font-bold text-white text-base sm:text-lg tracking-tight truncate">
              JM<span className="text-neon-cyan">_</span>Shakya
            </span>
            <span className="hidden sm:block text-[10px] font-mono text-white/50 uppercase tracking-widest">
              dev · systems · scripts
            </span>
          </div>
        </button>

        {/* Desktop: view tabs */}
        <nav className="hidden lg:flex items-center gap-1 min-w-0 overflow-x-auto no-scrollbar justify-center flex-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTab(tab.key)}
              aria-current={view === tab.key ? 'page' : undefined}
              className={`px-3 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap border transition-colors duration-300 ${
                view === tab.key
                  ? 'text-white bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border-neon-cyan/50 shadow-[0_0_18px_rgba(0,240,255,0.15)]'
                  : 'text-white/70 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border-transparent hover:border-neon-cyan/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              window.dispatchEvent(new CustomEvent('open-command-palette'))
            }}
            className="p-2.5 rounded-xl text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.10] border border-white/[0.06] hover:border-neon-cyan/40 transition-colors duration-300"
            aria-label="Open command palette (Ctrl+K)"
            title="Search (Ctrl+K)"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => handleTab('contact')}
            className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 hover:shadow-[0_0_26px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            Hire Me
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.10] border border-white/[0.06] hover:border-neon-violet/40 transition-colors duration-300"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-colors active:bg-white/15"
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — top tracks the measured header height so there is never
          a gap between the two, whatever the safe-area inset works out to. */}
      <div
        id="mobile-nav"
        className={`lg:hidden fixed inset-x-0 bottom-0 bg-body/95 backdrop-blur-2xl transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: `${headerHeight}px`, paddingBottom: 'var(--sab)' }}
      >
        <nav className="flex flex-col gap-2 p-5 pt-4 max-w-7xl mx-auto w-full h-full overflow-y-auto overscroll-contain">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1 px-2">
            Navigation
          </p>
          {TABS.map((tab, i) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTab(tab.key)}
              aria-current={view === tab.key ? 'page' : undefined}
              className={`group flex items-center justify-between py-3.5 px-5 rounded-xl text-base font-medium transition-colors duration-300 ${
                view === tab.key
                  ? 'text-white glass border border-neon-cyan/50 bg-neon-cyan/5'
                  : 'text-white/80 hover:text-white glass border border-white/10 hover:border-neon-cyan/40'
              }`}
            >
              {tab.label}
              <span className="font-mono text-neon-cyan text-sm">
                {view === tab.key ? '●' : `0${i + 1}.`}
              </span>
            </button>
          ))}
          <p className="mt-8 mb-2 text-center font-mono text-xs text-white/40 break-anywhere">
            {PROFILE.location} &middot; {PROFILE.domain}
          </p>
        </nav>
      </div>
    </header>
  )
}
