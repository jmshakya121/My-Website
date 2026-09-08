import { useEffect, useState } from 'react'
import { Menu, X, Sparkles, Terminal } from 'lucide-react'
import { PROFILE } from '../data/profile'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Software', href: '#software' },
  { label: 'Connect', href: '#connect' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
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

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#05050a]/80 backdrop-blur-2xl border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 overflow-hidden p-1.5 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-neon-cyan" />
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="font-mono font-bold text-white text-lg tracking-tight">
              JM<span className="text-neon-cyan">_</span>
            </span>
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
              dev portfolio
            </span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 relative group"
            >
              {link.label}
              <span className="absolute left-4 right-4 bottom-0.5 h-px bg-gradient-to-r from-neon-cyan to-neon-violet scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <Sparkles className="w-4 h-4 text-neon-cyan" />
          Hire Me
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 top-[64px] bg-[#05050a]/95 backdrop-blur-2xl transition-all duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-2 p-6 pt-10 max-w-7xl mx-auto w-full">
          {LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between py-4 px-5 rounded-xl text-lg font-medium text-white/80 hover:text-white glass border border-transparent hover:border-neon-cyan/40 transition-all duration-300"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {link.label}
              <span className="font-mono text-neon-cyan text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                0{i + 1}.
              </span>
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan" /> Hire Me
          </a>
          <p className="mt-8 text-center font-mono text-xs text-white/40">
            {PROFILE.location} &middot; {PROFILE.domain}
          </p>
        </div>
      </div>
    </header>
  )
}