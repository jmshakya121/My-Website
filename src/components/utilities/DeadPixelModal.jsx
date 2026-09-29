import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Grid3x3, Maximize, Play, Pause, Smartphone } from 'lucide-react'
import UtilityModal from './UtilityModal.jsx'
import { useCoarsePointer } from '../../hooks/useMediaQuery'

const COLORS = [
  { name: 'Black', hex: '#000000', text: 'text-white/70' },
  { name: 'White', hex: '#ffffff', text: 'text-black/60' },
  { name: 'Red', hex: '#ff0000', text: 'text-white/80' },
  { name: 'Green', hex: '#00ff00', text: 'text-black/60' },
  { name: 'Blue', hex: '#0000ff', text: 'text-white/80' },
  { name: 'Cyan', hex: '#00f0ff', text: 'text-black/60' },
  { name: 'Magenta', hex: '#ff00ff', text: 'text-white/80' },
  { name: 'Yellow', hex: '#ffff00', text: 'text-black/60' },
  { name: 'Gray', hex: '#808080', text: 'text-white/80' },
]

const CYCLE_MS = 1200

export default function DeadPixelModal({ onClose }) {
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(false)
  const isTouch = useCoarsePointer()

  /* iOS Safari has no Element Fullscreen API, so `requestFullscreen` is
     simply absent there. Feature-detect instead of assuming it exists. */
  const canFullscreen =
    typeof document !== 'undefined' &&
    typeof document.documentElement.requestFullscreen === 'function'

  const color = COLORS[index % COLORS.length]

  const next = () => setIndex((i) => (i + 1) % COLORS.length)
  const prev = () => setIndex((i) => (i - 1 + COLORS.length) % COLORS.length)

  /* The Auto Cycle button previously set a flag that nothing ever read, so the
     "feature" silently did nothing on every device. */
  useEffect(() => {
    if (!auto) return undefined
    const id = setInterval(next, CYCLE_MS)
    return () => clearInterval(id)
  }, [auto])

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement && typeof document.exitFullscreen === 'function') {
        await document.exitFullscreen()
      }
    } catch {
      /* user or browser dismissed it first */
    }
  }, [])

  const toggleAuto = useCallback(async () => {
    if (auto) {
      setAuto(false)
      await exitFullscreen()
      return
    }
    setAuto(true)
    if (canFullscreen) {
      try {
        await document.documentElement.requestFullscreen()
      } catch {
        /* denied or unsupported — auto cycling still runs */
      }
    }
  }, [auto, canFullscreen, exitFullscreen])

  const exit = useCallback(() => {
    setAuto(false)
    exitFullscreen()
    onClose()
  }, [exitFullscreen, onClose])

  return (
    <UtilityModal title="Dead Pixel Tester" subtitle="cycle solid colors to spot stuck / dead pixels" onClose={exit}>
      <div className="space-y-4">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10" style={{ backgroundColor: color.hex }}>
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md">
            <Grid3x3 className="w-3.5 h-3.5 text-white/80 shrink-0" />
            <span className={`text-xs font-mono font-semibold ${color.text}`}>{color.name}</span>
            <span className="text-[10px] font-mono text-white/50">{color.hex}</span>
          </div>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-mono text-white/60 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full max-w-[92%] text-center">
            Look closely for dots that don't change color
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={c.name}
                aria-pressed={i === index}
                className={`h-8 w-8 rounded-lg border transition-all duration-200 ${
                  i === index ? 'ring-2 ring-neon-cyan' : 'border-white/20 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={toggleAuto}
            aria-pressed={auto}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors duration-300 shrink-0 ${
              auto ? 'bg-neon-cyan/15 border-neon-cyan/60 text-white' : 'bg-white/[0.04] border-white/15 text-white/70 hover:border-white/35'
            }`}
          >
            {auto ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {auto ? 'Stop Auto' : 'Auto Cycle'}
          </button>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={prev}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/80 bg-white/[0.04] border border-white/15 hover:border-neon-cyan/50 transition-colors duration-300"
          >
            ← Prev
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={next}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 transition-colors duration-300"
          >
            Next Color →
          </motion.button>
        </div>

        <p className="text-[11px] font-mono text-white/40 text-center flex items-center justify-center gap-1.5 text-center">
          {isTouch ? (
            <>
              <Smartphone className="w-3 h-3 text-neon-violet shrink-0" />
              On phones the test covers the browser viewport, not the whole panel —
              rotate to landscape and keep the screen close to your eye.
            </>
          ) : canFullscreen ? (
            <>
              <Maximize className="w-3 h-3 text-neon-violet shrink-0" /> Tip: enable Auto Cycle + fullscreen
              for the most accurate panel scan
            </>
          ) : (
            <>
              <Maximize className="w-3 h-3 text-neon-violet shrink-0" /> Fullscreen is unavailable in this
              browser — Auto Cycle still works.
            </>
          )}
        </p>
      </div>
    </UtilityModal>
  )
}
