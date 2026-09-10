import { motion } from 'framer-motion'
import {
  Mail, ShieldCheck,
  Rocket, FolderKanban, Eye, Zap, Download, Package,
} from 'lucide-react'
import { PROFILE, SITE_METRICS } from '../data/profile'

const METRICS = [
  { icon: Download, label: 'Downloads', value: SITE_METRICS.downloads },
  { icon: Package, label: 'Active Tools', value: SITE_METRICS.tools },
  { icon: FolderKanban, label: 'Categories', value: SITE_METRICS.categories },
  { icon: ShieldCheck, label: 'Verified', value: SITE_METRICS.verified },
]

const HIGHLIGHTS = [
  { icon: Zap, text: '100% Free' },
  { icon: Eye, text: 'Zero Ads Interstitials' },
  { icon: Rocket, text: 'Automated Drivers' },
  { icon: ShieldCheck, text: 'Source Visible' },
]

export default function Hero() {
  return (
    <section id="dashboard" className="relative overflow-hidden">
      {/* Gradient overlays — use CSS var bg colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-body/40 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-14 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 animate-[glowPulse_3s_ease-in-out_infinite]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan" />
              </span>
              <span className="text-xs font-mono text-neon-cyan">// IT HUB Utility Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] mb-5">
              IT HUB <span className="neon-text">Utility Engine</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-4 max-w-xl">
              Curated system scripts, driver packs, and power-user utilities{' '}
              <span className="text-neon-cyan">maintained by IT HUB</span>.
            </p>

            {/* Feature highlights */}
            <div className="flex flex-wrap items-center gap-2 text-sm font-mono mb-8">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <span key={text} className="chip">
                  <Icon className="w-3.5 h-3.5" /> {text}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-10">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-view', { detail: 'software' }))}
                className="btn-primary"
              >
                <Download className="w-5 h-5" /> Explore Free Tools
              </button>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-view', { detail: 'contact' }))}
                className="btn-secondary"
              >
                <Mail className="w-5 h-5" /> Hire Me / Request a Project
              </button>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-view', { detail: 'projects' }))}
                className="btn-secondary"
              >
                <FolderKanban className="w-5 h-5" /> View Projects
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <Mail className="w-4 h-4 text-neon-violet" />
              <span className="text-white/50">{PROFILE.contact.email}</span>
            </div>
          </motion.div>

          {/* Right column - 3D profile frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative" style={{ perspective: '1000px' }}>
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 animate-[float_6s_ease-in-out_infinite] preserve-3d">
                <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-neon-cyan/30 via-neon-violet/30 to-neon-fuchsia/30 blur-3xl animate-[glowPulse_3s_ease-in-out_infinite]" />
                <div className="absolute -inset-4 rounded-full border border-dashed border-neon-cyan/40 animate-[spin_16s_linear_infinite]" />
                <div className="absolute -inset-10 rounded-full border border-dashed border-neon-violet/30 animate-[spin_24s_linear_infinite_reverse]" />

                <div className="relative w-full h-full rounded-[2rem] neon-border glass overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.15)]">
                  <div className="absolute inset-0 grid-animated opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-violet/10" />

                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-neon-cyan rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-neon-violet rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-neon-violet rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-neon-cyan rounded-br-lg" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-neon-cyan to-neon-violet p-1 animate-[glowPulse_4s_ease-in-out_infinite] shadow-[0_0_60px_rgba(0,240,255,0.25)]">
                      <div className="w-full h-full rounded-full bg-base-900 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 opacity-20 grid-animated" />
                        <img
                          src={PROFILE.photo}
                          alt={`${PROFILE.name} profile picture`}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling.style.display = 'flex'
                          }}
                          className="relative w-full h-full object-cover object-center rounded-full"
                          loading="eager"
                        />
                        <span
                          className="absolute inset-0 hidden items-center justify-center text-5xl sm:text-6xl font-extrabold neon-text"
                          aria-hidden="true"
                        >
                          JM
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-[marquee_6s_linear_infinite]" style={{ top: '30%' }} />
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-neon-violet to-transparent" style={{ top: '70%' }} />
                </div>
              </div>

              <div className="absolute -top-4 -right-4 glass-strong rounded-xl px-4 py-2.5 flex items-center gap-2 animate-[float_5s_ease-in-out_infinite] z-10">
                <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                <span className="text-xs font-mono text-white/80">Free &amp; Open</span>
              </div>
              <div className="absolute -bottom-4 -left-4 glass-strong rounded-xl px-4 py-2.5 flex items-center gap-2 animate-[float_7s_ease-in-out_infinite] z-10" style={{ animationDelay: '1.5s' }}>
                <ShieldCheck className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="text-xs font-mono text-white/80">Source Visible</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Metrics Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto"
        >
          {METRICS.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
              className="glass rounded-2xl p-5 text-center hover:border-neon-cyan/40 hover:shadow-[0_0_30px_rgba(0,240,255,0.08)] transition-all duration-300 group"
            >
              <Icon className="w-5 h-5 text-neon-cyan mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-2xl font-bold neon-text font-mono">{value}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}