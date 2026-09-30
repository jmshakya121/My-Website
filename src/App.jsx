import { Suspense, lazy, useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import DownloadHub from './components/DownloadHub.jsx'
import Utilities from './components/Utilities.jsx'
import Projects from './components/Projects.jsx'
import Connect from './components/Connect.jsx'
import ContactSection from './components/ContactSection.jsx'
import Footer from './components/Footer.jsx'
import TerminalModal from './components/TerminalModal.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import ToastHost from './components/ToastHost.jsx'
import useTheme from './hooks/useTheme'
import useMediaQuery, { useReducedMotion } from './hooks/useMediaQuery'

/* three + @react-three/fiber + @react-three/drei are ~600KB minified. They
   are dead weight on phones (the scene disables itself there) yet were being
   downloaded and parsed on first paint. Lazy loading keeps them in a separate
   chunk that only desktop, non-reduced-motion clients ever request. */
const DynamicBackground = lazy(() => import('./components/three/DynamicBackground.jsx'))

/* Small and dependency-free, so it can be imported eagerly and used as the
   Suspense fallback without pulling in three.js. */
import CssStarfield from './components/three/CssStarfield.jsx'

/* Decided *before* first paint so the `lazy()` above is never triggered on a
   phone — a Suspense-mounted-but-empty child still fetches its chunk. */
const DESKTOP_3D_QUERY =
  '(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

function BackgroundFX({ theme }) {
  const canRender3D = useMediaQuery(DESKTOP_3D_QUERY)

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {canRender3D ? (
        <Suspense fallback={<CssStarfield theme={theme} />}>
          <DynamicBackground theme={theme} />
        </Suspense>
      ) : (
        /* No WebGL on this device (phone, reduced-motion, or no hover) — show the
           CSS starfield rather than a bare gradient. It is transform-only, so it
           costs no GPU memory and cannot lose a context. */
        <CssStarfield theme={theme} />
      )}
      <div className="absolute inset-0 bg-grid-pattern opacity-25" />
      <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-neon-violet/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-neon-fuchsia/5 rounded-full blur-[120px]" />
    </div>
  )
}

function ScrollTopBtn() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        setVisible(window.scrollY > 700)
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

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          /* Sits above the safe-area inset and above the terminal FAB's
             column so the two never overlap on a narrow phone. */
          className="fixed right-4 sm:right-6 z-50 w-11 h-11 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 backdrop-blur-xl flex items-center justify-center text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:-translate-y-1 active:scale-95 transition-all duration-300"
          style={{ bottom: 'calc(var(--sab) + 4.75rem)' }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

const TAB_TRANSITION = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
  mass: 0.9,
}

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [view, setView] = useState('dashboard')
  const [pendingGate, setPendingGate] = useState(null)
  const skipTopReset = useRef(false)
  const prefersReducedMotion = useReducedMotion()

  const handleNavigate = useCallback((next) => {
    setView(next)
    skipTopReset.current = true
    requestAnimationFrame(() => {
      skipTopReset.current = false
    })
  }, [])

  useEffect(() => {
    if (skipTopReset.current) return
    /* `html { scroll-behavior: smooth }` turned this into an animated scroll
       that raced the AnimatePresence view swap, leaving the new tab parked
       mid-scroll. Force `auto` for the jump, then restore. */
    const root = document.documentElement
    const previous = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    root.style.scrollBehavior = previous
  }, [view])

  useEffect(() => {
    const onNavigate = (e) => {
      if (e.detail) handleNavigate(e.detail)
    }
    const onOpenSoftwareDownload = (e) => {
      handleNavigate('software')
      setPendingGate(e.detail?.id || null)
    }
    const onToggleTheme = () => toggleTheme()
    window.addEventListener('navigate-view', onNavigate)
    window.addEventListener('open-software-download', onOpenSoftwareDownload)
    window.addEventListener('toggle-theme', onToggleTheme)
    return () => {
      window.removeEventListener('navigate-view', onNavigate)
      window.removeEventListener('open-software-download', onOpenSoftwareDownload)
      window.removeEventListener('toggle-theme', onToggleTheme)
    }
  }, [handleNavigate, toggleTheme])

  return (
    <div className="relative font-sans text-white antialiased selection:bg-neon-cyan/30 themed">
      <BackgroundFX theme={theme} />
      <div className="relative z-10 flex flex-col min-h-[var(--app-vh)]">
        <Navbar view={view} onNavigate={handleNavigate} theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 26, scale: prefersReducedMotion ? 1 : 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -22, scale: prefersReducedMotion ? 1 : 0.995 }}
              transition={prefersReducedMotion ? { duration: 0.12 } : TAB_TRANSITION}
            >
              {view === 'dashboard' && <Hero />}
              {view === 'software' && (
                <DownloadHub
                  pendingGate={pendingGate}
                  onGateConsumed={() => setPendingGate(null)}
                />
              )}
              {view === 'utilities' && <Utilities />}
              {view === 'projects' && <Projects />}
              {view === 'connect' && <Connect />}
              {view === 'contact' && <ContactSection />}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
      <ScrollTopBtn />
      <TerminalModal />
      <CommandPalette />
      <ToastHost />
    </div>
  )
}
