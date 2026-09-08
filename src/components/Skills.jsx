import { motion } from 'framer-motion'
import { Code2, Cpu, BrainCircuit } from 'lucide-react'
import { SKILLS } from '../data/profile'

const itemIcons = [Code2, Cpu, BrainCircuit]

export default function Skills() {
  const doubled = [...SKILLS, ...SKILLS]

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <span className="chip">
            <Cpu className="w-3.5 h-3.5" /> Tech Stack
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-neon-cyan/40 via-white/10 to-transparent" />
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#05050a] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#05050a] to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex overflow-hidden"
        >
          <div className="flex shrink-0 animate-marquee gap-4 pr-4">
            {doubled.map((skill, i) => {
              const Icon = itemIcons[i % itemIcons.length]
              return (
                <div
                  key={`${skill}-${i}`}
                  className="glass rounded-xl px-6 py-3 flex items-center gap-2.5 whitespace-nowrap hover:border-neon-cyan/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.1)] transition-all duration-300 cursor-default"
                >
                  <Icon className="w-4 h-4 text-neon-cyan" />
                  <span className="text-sm font-medium text-white/80">{skill}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}