import { motion } from 'framer-motion'
import {
  Globe, Zap, PenTool, Box, Code2, GitBranch, Cloud, Wind,
  ExternalLink, Wrench, Info,
} from 'lucide-react'
import { TOOLS } from '../data/profile'
import TiltCard from './TiltCard.jsx'

const iconMap = {
  Globe,
  Zap,
  PenTool,
  Box,
  Code2,
  GitBranch,
  Cloud,
  Wind,
}

export default function ToolsSection() {
  return (
    <section id="tools" className="relative pt-20 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,240,255,0.05),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-14"
        >
          <p className="chip mx-auto mb-4">
            <Wrench className="w-3.5 h-3.5" /> Tools I Use
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            My <span className="neon-text">Dev Toolkit</span>
          </h2>
          <div className="h-1 w-24 mx-auto section-title-line" />
          <p className="text-white/60 max-w-xl mx-auto mt-5 text-sm sm:text-base">
            The hosting, design, and dev tools powering everything I build — including
            this site.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOOLS.map((tool, i) => {
            const Icon = iconMap[tool.icon] || Code2
            return (
              <motion.a
                key={tool.title}
                href={tool.affiliateUrl}
                target={tool.affiliateUrl && tool.affiliateUrl !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative glass rounded-2xl p-6 flex flex-col hover:border-neon-violet/40 hover:shadow-[0_0_35px_rgba(168,85,247,0.12)] hover:-translate-y-1.5 transition-all duration-500"
              >
                <TiltCard className="flex flex-col flex-1">
                  <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-neon-violet/10 blur-2xl group-hover:bg-neon-violet/20 transition-colors duration-500" />
                  <div className="relative z-10 flex items-start justify-between mb-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan/15 to-neon-violet/15 border border-neon-cyan/30 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-shadow duration-300">
                      <Icon className="w-6 h-6 text-neon-cyan" />
                    </span>
                    <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-neon-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>
                  <div className="relative z-10 mb-2 flex items-center gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-neon-cyan transition-colors duration-300">
                      {tool.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wide bg-neon-violet/10 border border-neon-violet/30 text-neon-violet">
                      {tool.tag}
                    </span>
                  </div>
                  <p className="relative z-10 text-xs text-white/50 leading-relaxed flex-1">
                    {tool.description}
                  </p>
                </TiltCard>
              </motion.a>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex items-start gap-2 text-[11px] text-white/35 max-w-2xl mx-auto text-center justify-center"
        >
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-neon-cyan" />
          Disclosure: some links above are affiliate links — if you buy through them I may earn a small commission at no extra cost to you.
        </motion.p>
      </div>
    </section>
  )
}