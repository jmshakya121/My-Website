import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Gauge, RefreshCw } from 'lucide-react'
import UtilityModal from './UtilityModal.jsx'
import { showToast } from '../../utils/toast'
import { copyText } from '../../utils/copy'

function useRefreshRate() {
  const [hz, setHz] = useState(null)
  const [phase, setPhase] = useState('measuring')
  const hzRef = useRef([])

  useEffect(() => {
    let raf
    let start = performance.now()
    let frames = 0
    const timer = setTimeout(() => setPhase('done'), 2600)

    const loop = () => {
      frames += 1
      const elapsed = performance.now() - start
      if (elapsed >= 1000) {
        const fps = (frames * 1000) / elapsed
        hzRef.current.push(Math.round(fps))
        if (hzRef.current.length > 4) hzRef.current.shift()
        const avg = Math.round(hzRef.current.reduce((a, b) => a + b, 0) / hzRef.current.length)
        setHz(avg)
        frames = 0
        start = performance.now()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [])

  return { hz, phase }
}

export default function ScreenHzModal({ onClose }) {
  const { hz, phase } = useRefreshRate()
  const percent = hz ? Math.min(100, Math.round(((hz - 20) / 180) * 100)) : 0

  return (
    <UtilityModal title="Screen Refresh Rate Check" subtitle="requestAnimationFrame · vsync sampler" onClose={onClose}>
      <div className="text-center py-4">
        <div className="relative mx-auto mb-6 h-36 w-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke="url(#hzGrad)"
              strokeWidth="7" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - percent / 100)}
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <defs>
              <linearGradient id="hzGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#e879f9" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {phase === 'measuring' ? (
              <div className="text-center">
                <RefreshCw className="w-5 h-5 text-neon-cyan animate-spin mx-auto mb-1" />
                <p className="text-[10px] font-mono text-white/50">SAMPLING</p>
              </div>
            ) : (
              <>
                <span className="text-4xl font-extrabold font-mono text-white">{hz}</span>
                <span className="text-[11px] font-mono text-white/50">Hz</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Gauge className="w-4 h-4 text-neon-cyan" />
          <p className="text-sm text-white/70">
            {phase === 'measuring'
              ? 'Measuring frames for ~2.5s… keep this window steady.'
              : hz >= 120
                ? 'High refresh rate panel detected — butter smooth.'
                : hz >= 60
                  ? 'Standard refresh rate — 60Hz class display.'
                  : 'Low-sampling environment — try a dedicated browser window.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="glass rounded-xl px-4 py-3">
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-wide mb-1">Sampled</p>
            <p className="text-lg font-bold font-mono text-white">{hz ? `${hz} Hz` : '—'}</p>
          </div>
          <div className="glass rounded-xl px-4 py-3">
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-wide mb-1">Screen size</p>
            <p className="text-lg font-bold font-mono text-white">
              {window.screen.width} × {window.screen.height}
            </p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={async () => {
            const ok = await copyText(`${hz || '?'} Hz (${window.screen.width} × ${window.screen.height})`)
            showToast(
              ok ? 'Refresh rate result copied' : 'Copy failed — long-press and copy manually.',
              { kind: ok ? 'copy' : 'error', description: `${hz || '?'} Hz` }
            )
          }}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] transition-all duration-300"
        >
          Copy Result
        </motion.button>
      </div>
    </UtilityModal>
  )
}