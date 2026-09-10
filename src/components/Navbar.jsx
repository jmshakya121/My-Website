import { useEffect, useState } from 'react'
import { Menu, X, Sparkles, Terminal, Sun, Moon, Search } from 'lucide-react'
import { PROFILE } from '../data/profile'

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'software', label: 'Software Utilities' },
  { key: 'projects', label: 'Projects' },
  { key: 'connect', label: 'Connect' },
  { key: 'contact', label: 'Contact' },
]

export default function Navbar({ view = 'dashboard', onNavigate, theme = 'dark', toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleTab = (key) => {
    setOpen(false)
    if (onNavigate) onNavigate(key)
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-body/80 backdrop-blur-2xl border-b border-white/10 py-2.5'
          : 'bg-transparent py-3'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => handleTab('dashboard')}
          className="flex items-center gap-2.5 group shrink-0 text-left"
          aria-label="Go to Dashboard"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 overflow-hidden p-1.5 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-neon-cyan" />
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="font-mono font-bold text-white text-lg tracking-tight">
              JM<span className="text-neon-cyan">_</span>Shakya
            </span>
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
              dev · systems · scripts
            </span>
          </div>
        </button>

        {/* Desktop: six view tabs */}
        <nav className="hidden lg:flex items-center gap-1 min-w-0 overflow-x-auto no-scrollbar justify-center flex-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTab(tab.key)}
              aria-current={view === tab.key ? 'page' : undefined}
              className={`px-3 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap border transition-all duration-300 ${
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
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            className="p-2.5 rounded-xl text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.10] border border-white/[0.06] hover:border-neon-cyan/40 transition-all duration-300"
            aria-label="Open command palette (Ctrl+K)"
            title="Search (Ctrl+K)"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleTab('contact')}
            className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 hover:shadow-[0_0_26px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            Hire Me
          </button>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.10] border border-white/[0.06] hover:border-neon-violet/40 transition-all duration-300"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[64px] bottom-0 bg-body/95 backdrop-blur-2xl transition-all duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-2 p-6 pt-6 max-w-7xl mx-auto w-full h-full overflow-y-auto">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1 px-2">
            Navigation
          </p>
          {TABS.map((tab, i) => (
            <button
              key={tab.key}
              onClick={() => handleTab(tab.key)}
              aria-current={view === tab.key ? 'page' : undefined}
              className={`group flex items-center justify-between py-3.5 px-5 rounded-xl text-base font-medium transition-all duration-300 ${
                view === tab.key
                  ? 'text-white glass border border-neon-cyan/50 bg-neon-cyan/5'
                  : 'text-white/80 hover:text-white glass border border-white/10 hover:border-neon-cyan/40'
              }`}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {tab.label}
              <span className="font-mono text-neon-cyan text-sm">
                {view === tab.key ? '●' : '0' + (i + 1) + '.'}
              </span>
            </button>
          ))}
          <p className="mt-8 text-center font-mono text-xs text-white/40">
            {PROFILE.location} &middot; {PROFILE.domain}
          </p>
        </div>
      </div>
    </header>
  )
}