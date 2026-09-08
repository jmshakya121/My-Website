import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Gauge, LineChart, UserCheck, Zap, ArrowUpRight,
  Ticket, Activity, Clock, ShieldCheck, FolderKanban, CheckCircle2,
} from 'lucide-react'
import { PROJECTS } from '../data/profile'

const featureIcons = {
  'Live Dashboard': Gauge,
  'Analytics': LineChart,
  'Role-based Access': UserCheck,
  'Ticket Automation': Zap,
}

const mockTickets = [
  { id: 'TKT-1024', title: 'Network outage in Building A', tag: 'High', status: 'open' },
  { id: 'TKT-1025', title: 'Printer driver update required', tag: 'Medium', status: 'progress' },
  { id: 'TKT-1026', title: 'VPN access for new hire', tag: 'Low', status: 'open' },
]

function TiltCard() {
  const ref = useRef(null)
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)')

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = ((py - 0.5) * -10).toFixed(2)
    const ry = ((px - 0.5) * 12).toFixed(2)
    setTransform(`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`)
  }, [])

  const onLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)')
  }, [])

  const [glow, setGlow] = useState({ x: 50, y: 50 })

  const onGlowMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  return (
    <div
      ref={ref}
      className="tilt-card relative w-full max-w-4xl mx-auto group"
      style={{ transform, transition: 'transform 0.15s ease-out' }}
      onMouseMove={(e) => { onMove(e); onGlowMove(e) }}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute -inset-8 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl"
        style={{
          background: `radial-gradient(600px circle at ${glow.x}% ${glow.y}%, rgba(0,240,255,0.18), rgba(168,85,247,0.12), transparent 50%)`,
        }}
      />

      <div className="relative glass rounded-[2rem] overflow-hidden border-white/10">
        <div className="grid lg:grid-cols-5">
          {/* Visual side */}
          <div className="lg:col-span-2 relative p-8 lg:p-10 flex flex-col justify-between min-h-[280px] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,240,255,0.12),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(168,85,247,0.12),transparent_60%)]" />
            <div className="absolute inset-0 grid-animated opacity-40" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="chip">
                <Activity className="w-3.5 h-3.5" /> Spotlight Project
              </span>
              <span className="font-mono text-[10px] text-white/40">v2.0 LIVE</span>
            </div>

            {/* Mini ticket dashboard mock */}
            <div className="relative z-10 my-6 space-y-3 preserve-3d" style={{ transform: 'translateZ(40px)' }}>
              <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.9)] animate-pulse" />
                  LIVE TICKET FEED
                </span>
                <span className="text-neon-cyan">● ● ●</span>
              </div>
              {mockTickets.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 backdrop-blur-md"
                >
                  <div>
                    <p className="text-[11px] font-mono text-neon-cyan">{t.id}</p>
                    <p className="text-xs text-white/80 truncate max-w-[160px]">{t.title}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${
                      t.status === 'progress'
                        ? 'text-neon-violet border-neon-violet/40 bg-neon-violet/10'
                        : t.tag === 'High'
                          ? 'text-red-400 border-red-400/40 bg-red-400/10'
                          : 'text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10'
                    }`}
                  >
                    {t.status === 'progress' ? 'ASSIGNED' : t.tag.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
              <span className="text-neon-violet flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> SLA 98.2%
              </span>
              <span className="text-white/50 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Low-latency
              </span>
            </div>
          </div>

          {/* Content side */}
          <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col justify-center relative">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {PROJECTS.spotlight.name}
              </h3>
              <p className="text-neon-cyan text-sm font-mono mb-4 flex items-center gap-2">
                <FolderKanban className="w-4 h-4" /> {PROJECTS.spotlight.tagline}
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                {PROJECTS.spotlight.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {PROJECTS.spotlight.features.map((feature) => {
                const Icon = featureIcons[feature] || CheckCircle2
                return (
                  <div
                    key={feature}
                    className="flex flex-col items-start gap-2 px-3 py-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-neon-cyan/40 hover:bg-neon-cyan/5 transition-all duration-300"
                    style={{ transform: 'translateZ(30px)' }}
                  >
                    <Icon className="w-4 h-4 text-neon-cyan" />
                    <span className="text-[10px] font-medium text-white/70 leading-tight">{feature}</span>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {PROJECTS.spotlight.stats.map((s) => (
                <div key={s.label} className="text-center px-2 py-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <p className="text-xl font-bold font-mono neon-text">{s.value}</p>
                  <p className="text-[10px] text-white/50 uppercase tracking-wide mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="btn-primary text-sm px-5 py-2.5" style={{ transform: 'translateZ(50px)' }}>
                <Ticket className="w-4 h-4" /> View Case Study
              </button>
              <a
                href={PROJECTS.spotlight.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm px-5 py-2.5"
                style={{ transform: 'translateZ(50px)' }}
              >
                Live Demo <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,240,255,0.06),transparent_50%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <p className="chip mx-auto mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" /> Featured Work
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Project<span className="neon-text"> Showcase</span>
          </h2>
          <div className="h-1 w-24 mx-auto section-title-line" />
          <p className="text-white/60 max-w-xl mx-auto mt-5 text-sm sm:text-base">
            A deep dive into{' '}
            <span className="text-neon-cyan font-medium">Service Desk Pro</span> — the
            flagship ticketing platform powering modern IT support teams.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <TiltCard />
        </motion.div>
      </div>
    </section>
  )
}