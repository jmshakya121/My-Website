import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { MapPin, MousePointer2, Rocket, Code2, Laptop, Mail, ChevronDown, Loader2 } from 'lucide-react'
import { PROFILE } from '../data/profile'

const HeroScene = lazy(() => import('./three/HeroScene.jsx'))

function SceneFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full border border-neon-cyan/30 animate-[spin_3s_linear_infinite]" />
        <div className="absolute w-36 h-36 rounded-full border border-dashed border-neon-violet/30 animate-[spin_5s_linear_infinite_reverse]" />
        <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Suspense fallback={<SceneFallback />}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05050a]/60 via-transparent to-[#05050a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
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
              <span className="text-xs font-mono text-neon-cyan">// Available for opportunities</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] mb-5">
              {"Hi, I'm "}
              <span className="neon-text">JM Shakya</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-4 max-w-xl">
              Crafting modern web software &amp; interactive{' '}
              <span className="text-neon-cyan">3D web experiences</span>.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-sm font-mono text-white/60 mb-8">
              <span className="chip">
                <Code2 className="w-3.5 h-3.5" /> Full-Stack Developer
              </span>
              <span className="chip">
                <Laptop className="w-3.5 h-3.5" /> CS Student
              </span>
              <span className="chip">
                <MapPin className="w-3.5 h-3.5" /> {PROFILE.location}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 mb-10">
              <a href="#projects" className="btn-primary">
                <Rocket className="w-5 h-5" /> Explore Software
              </a>
              <a href="#projects" className="btn-secondary">
                View Projects
              </a>
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
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-br from-neon-cyan to-neon-violet p-[3px] animate-[glowPulse_4s_ease-in-out_infinite]">
                      <div className="w-full h-full rounded-full bg-base-900 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 opacity-20 grid-animated" />
                        <img
                          src={PROFILE.photo}
                          alt={`${PROFILE.name} profile picture`}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling.style.display = 'flex'
                          }}
                          className="relative w-full h-full object-cover rounded-full"
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
                <span className="text-xs font-mono text-white/80">3D · WebGL</span>
              </div>
              <div className="absolute -bottom-4 -left-4 glass-strong rounded-xl px-4 py-2.5 flex items-center gap-2 animate-[float_7s_ease-in-out_infinite] z-10" style={{ animationDelay: '1.5s' }}>
                <MousePointer2 className="w-3.5 h-3.5 text-neon-violet" />
                <span className="text-xs font-mono text-white/80">Interactive</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Scroll</span>
          <a href="#projects" className="text-neon-cyan animate-bounce">
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  )
}