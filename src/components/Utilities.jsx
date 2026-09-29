import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench, MonitorUp, Grid3x3, Keyboard, Youtube, Hash,
  SquareTerminal, ArrowUpRight, ShieldCheck, Cpu, Sparkles,
} from 'lucide-react'
import ScreenHzModal from './utilities/ScreenHzModal.jsx'
import DeadPixelModal from './utilities/DeadPixelModal.jsx'
import KeyboardTestModal from './utilities/KeyboardTestModal.jsx'
import YoutubeThumbModal from './utilities/YoutubeThumbModal.jsx'
import TextFormatterModal from './utilities/TextFormatterModal.jsx'
import PsBuilderModal from './utilities/PsBuilderModal.jsx'

const HARDWARE_TOOLS = [
  {
    key: 'hz',
    icon: MonitorUp,
    title: 'Screen Hz Check',
    desc: 'Sample actual framerate vsync-bound to verify your real refresh rate.',
    tag: 'real-time test',
  },
  {
    key: 'pixel',
    icon: Grid3x3,
    title: 'Dead Pixel Tester',
    desc: 'Cycle solid colors across the full panel to spot stuck, dead, or hot pixels.',
    tag: 'fullscreen scan',
  },
  {
    key: 'keyboard',
    icon: Keyboard,
    title: 'Keyboard Input Test',
    desc: 'Hit every key and watch both keydown & keyup register live on a virtual layout.',
    tag: 'key log + test',
  },
]

const MEDIA_TOOLS = [
  {
    key: 'youtube',
    icon: Youtube,
    title: 'YouTube Thumbnail Extractor',
    desc: 'Paste any video link and instantly pull the cover at Max, HD, SD, and MQ sizes.',
    tag: '4 sizes',
  },
  {
    key: 'text',
    icon: Hash,
    title: 'Clean Text & Hashtag Engine',
    desc: 'De-duplicate, tidy captions, then hashify words into a unique hashtag string.',
    tag: 'twitter / ig post',
  },
]

function ToolCard({ tool, onLaunch, index }) {
  const Icon = tool.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true, margin: '-60px' }}
      className="group relative glass rounded-2xl p-4 sm:p-6 hover:border-neon-cyan/40 hover:shadow-[0_0_40px_rgba(0,240,255,0.08)] transition-colors duration-500 flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan/15 to-neon-violet/15 border border-neon-cyan/30 relative overflow-hidden">
          <Icon className="w-6 h-6 text-neon-cyan" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-violet blur-sm opacity-60" />
        </span>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-white/55 bg-white/[0.04] border border-white/10">
          {tool.tag}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors duration-300">
        {tool.title}
      </h3>
      <p className="text-sm text-white/60 leading-relaxed mb-5">{tool.desc}</p>
      <button
        onClick={() => onLaunch(tool.key)}
        className="mt-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-neon-cyan/15 to-neon-violet/15 border border-neon-cyan/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 self-start"
      >
        <SquareTerminal className="w-4 h-4 text-neon-cyan" /> Launch
        <ArrowUpRight className="w-3.5 h-3.5 text-white/50" />
      </button>
    </motion.div>
  )
}

export default function Utilities() {
  const [active, setActive] = useState(null)

  const renderModal = () => {
    switch (active) {
      case 'hz': return <ScreenHzModal onClose={() => setActive(null)} />
      case 'pixel': return <DeadPixelModal onClose={() => setActive(null)} />
      case 'keyboard': return <KeyboardTestModal onClose={() => setActive(null)} />
      case 'youtube': return <YoutubeThumbModal onClose={() => setActive(null)} />
      case 'text': return <TextFormatterModal onClose={() => setActive(null)} />
      case 'ps': return <PsBuilderModal onClose={() => setActive(null)} />
      default: return null
    }
  }

  return (
    <section id="utilities" className="relative pt-16 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,240,255,0.05),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <p className="chip mx-auto mb-4">
            <Wrench className="w-3.5 h-3.5" /> Web Utilities · runs 100% in your browser
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Browser <span className="neon-text">Power Tools</span>
          </h2>
          <div className="h-1 w-24 mx-auto section-title-line" />
          <p className="text-white/60 max-w-xl mx-auto mt-5 text-sm sm:text-base">
            Install-free diagnostics, media helpers, and a custom PowerShell
            installer builder — nothing leaves your device.
          </p>
        </motion.div>

        {/* Hardware diagnostics */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-cyan/10 border border-neon-cyan/30">
              <Cpu className="w-4 h-4 text-neon-cyan" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Hardware Diagnostics</h3>
              <p className="text-[11px] font-mono text-white/40">screen · panel · keyboard</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HARDWARE_TOOLS.map((tool, i) => (
              <ToolCard key={tool.key} tool={tool} index={i} onLaunch={setActive} />
            ))}
          </div>
        </div>

        {/* Media tools */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-violet/10 border border-neon-violet/30">
              <Sparkles className="w-4 h-4 text-neon-violet" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Social & Media Tools</h3>
              <p className="text-[11px] font-mono text-white/40">youtube · captions · hashtags</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {MEDIA_TOOLS.map((tool, i) => (
              <ToolCard key={tool.key} tool={tool} index={i} onLaunch={setActive} />
            ))}
          </div>
        </div>

        {/* PowerShell builder */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, margin: '-60px' }}
          className="glass rounded-2xl p-6 sm:p-8 hover:border-neon-cyan/40 hover:shadow-[0_0_40px_rgba(0,240,255,0.08)] transition-all duration-500 relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-neon-violet/10 blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative">
            <div className="flex items-start gap-4 max-w-2xl">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/15 to-neon-violet/15 border border-emerald-400/30">
                <SquareTerminal className="w-7 h-7 text-emerald-400" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                  Quick PowerShell Script Builder
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Tick the software you want, pick winget or chocolatey, throw in a few
                  system tweaks — and generate a ready-to-run multi-install <span className="font-mono text-emerald-400">.ps1</span>.
                </p>
                <p className="mt-2 flex items-center gap-2 text-[11px] font-mono text-white/45 flex-wrap">
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% client-side</span>
                  <span className="text-white/20">·</span>
                  <span>winget / choco packages</span>
                  <span className="text-white/20">·</span>
                  <span>no account needed</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setActive('ps')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500/20 to-neon-violet/20 border border-emerald-400/40 hover:shadow-[0_0_25px_rgba(52,211,153,0.25)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 shrink-0"
            >
              <Wrench className="w-4 h-4 text-emerald-400" /> Open Builder
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>{renderModal()}</AnimatePresence>
    </section>
  )
}