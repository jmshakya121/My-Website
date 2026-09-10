import { motion } from 'framer-motion'
import {
  Github, Linkedin, Youtube, Instagram, Facebook,
  MapPin, Mail, Phone, Heart, Globe, Rocket,
} from 'lucide-react'
import { PROFILE, WHATSAPP_LINK } from '../data/profile'

const socials = [
  { icon: Github, href: 'https://github.com', label: 'GitHub', color: 'hover:text-white' },
  { icon: Linkedin, href: 'https://www.linkedin.com', label: 'LinkedIn', color: 'hover:text-sky-400' },
  { icon: Youtube, href: PROFILE.social.youtube, label: 'YouTube', color: 'hover:text-red-400' },
  { icon: Instagram, href: PROFILE.social.instagram, label: 'Instagram', color: 'hover:text-fuchsia-400' },
  { icon: Facebook, href: PROFILE.social.facebook, label: 'Facebook', color: 'hover:text-blue-400' },
]

const quickLinks = [
  { label: 'Dashboard', type: 'nav', target: 'dashboard' },
  { label: 'Projects', type: 'anchor', href: '#projects' },
  { label: 'Software Utilities', type: 'nav', target: 'software' },
  { label: 'Project Tools', type: 'nav', target: 'tools' },
  { label: 'Social Connect', type: 'anchor', href: '#connect' },
  { label: 'Hire Me', type: 'anchor', href: '#hire' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/10 pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.05),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 p-1.5 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-neon-cyan" />
              </div>
              <div className="leading-tight">
                <h3 className="font-mono font-bold text-white text-lg">JM<span className="text-neon-cyan">_</span></h3>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{PROFILE.domain}</p>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-4 max-w-sm">
              {PROFILE.title} from {PROFILE.location}. Crafting modern web software,
              interactive 3D web experiences, and developer tools.
            </p>
            <div className="flex items-center gap-3 text-xs text-white/40 font-mono flex-wrap">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neon-cyan" /> {PROFILE.location}, {PROFILE.postalCode}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neon-violet" /> {PROFILE.contact.email}
              </span>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-neon-cyan to-neon-violet rounded-full" />
              Navigate
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() =>
                      link.type === 'nav'
                        ? window.dispatchEvent(new CustomEvent('navigate-view', { detail: link.target }))
                        : window.dispatchEvent(new CustomEvent('navigate-anchor', { detail: link.href }))
                    }
                    className="text-sm text-white/50 hover:text-neon-cyan transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="font-mono text-[10px] text-neon-violet/60 group-hover:text-neon-cyan">→</span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-neon-violet to-neon-fuchsia rounded-full" />
              Follow Me
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {socials.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl glass ${color} transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]`}
                >
                  <Icon className="w-4.5 h-4.5 w-5 h-5" />
                </a>
              ))}
            </div>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-500/10 border border-emerald-400/30 hover:bg-emerald-500/20 transition-colors duration-300"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Me
            </a>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40 flex items-center gap-1.5 text-center">
            © {year} <span className="font-semibold text-white/70">JM Shakya</span>&nbsp;·&nbsp;
            <Globe className="w-3 h-3 text-neon-cyan" /> {PROFILE.domain}
            </p>
          <p className="text-xs text-white/30 flex items-center gap-1.5">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> React
            + Three.js · 3D WebGL · Bagbazar, Kathmandu
          </p>
        </div>
      </div>
    </footer>
  )
}