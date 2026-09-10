import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import FeatureOverview from './components/FeatureOverview.jsx'
import DownloadHub from './components/DownloadHub.jsx'
import ToolsSection from './components/ToolsSection.jsx'
import Footer from './components/Footer.jsx'
import TerminalModal from './components/TerminalModal.jsx'
import DynamicBackground from './components/three/DynamicBackground.jsx'
import useTheme from './hooks/useTheme'

function BackgroundFX({ theme }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <DynamicBackground theme={theme} />
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
    const onScroll = () => setVisible(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 backdrop-blur-xl flex items-center justify-center text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:-translate-y-1 transition-all duration-300"
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

  const goToAnchor = useCallback((href) => {
    skipTopReset.current = true
    setView('dashboard')
    requestAnimationFrame(() => {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    })
  }, [])

  useEffect(() => {
    const onNavigate = (e) => {
      if (e.detail) setView(e.detail)
    }
    const onAnchor = (e) => {
      if (e.detail) goToAnchor(e.detail)
    }
    const onOpenSoftwareDownload = (e) => {
      setView('software')
      setPendingGate(e.detail?.id || null)
    }
    window.addEventListener('navigate-view', onNavigate)
    window.addEventListener('navigate-anchor', onAnchor)
    window.addEventListener('open-software-download', onOpenSoftwareDownload)
    return () => {
      window.removeEventListener('navigate-view', onNavigate)
      window.removeEventListener('navigate-anchor', onAnchor)
      window.removeEventListener('open-software-download', onOpenSoftwareDownload)
    }
  }, [goToAnchor])

  useEffect(() => {
    if (skipTopReset.current) {
      skipTopReset.current = false
      return
    }
    window.scrollTo(0, 0)
  }, [view])

  return (
    <div className="relative font-sans text-white antialiased selection:bg-neon-cyan/30 themed">
      <BackgroundFX theme={theme} />
      <div className="relative z-10">
        <Navbar view={view} onNavigate={setView} onAnchor={goToAnchor} theme={theme} toggleTheme={toggleTheme} />
        <main>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 26, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -22, scale: 0.995 }}
              transition={TAB_TRANSITION}
            >
              {view === 'dashboard' && (
                <>
                  <Hero />
                  <FeatureOverview />
                </>
              )}
              {view === 'software' && (
                <DownloadHub
                  pendingGate={pendingGate}
                  onGateConsumed={() => setPendingGate(null)}
                />
              )}
              {view === 'tools' && <ToolsSection />}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <ScrollTopBtn />
        <TerminalModal />
      </div>
    </div>
  )
}