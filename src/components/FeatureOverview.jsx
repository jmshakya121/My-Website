import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download, Wrench, Rocket, ShieldCheck, ShieldAlert,
  Send, Mail, Copy, Check, MessageCircle, ExternalLink,
  Youtube, Instagram, Facebook, Github, Zap, Package, HardDrive, Crown,
} from 'lucide-react'
import TiltCard from './TiltCard.jsx'
import {
  PROFILE, PROJECTS, SITE_METRICS, MEDIA, HIRE,
  SOFTWARE_ITEMS, TOOLS, EMAIL_LINK, WHATSAPP_LINK,
} from '../data/profile'

function navigate(view) {
  window.dispatchEvent(new CustomEvent('navigate-view', { detail: view }))
}

const badgeBase = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold'

function CardShell({ children, className = '', ...props }) {
  return (
    <TiltCard className={`glass rounded-2xl p-6 flex flex-col relative overflow-hidden ${className}`} {...props}>
      {children}
    </TiltCard>
  )
}

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-60px' }}
      className="text-center mb-10"
    >
      <p className="chip mx-auto mb-4">
        <Crown className="w-3.5 h-3.5" /> Core Platform Overview
      </p>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
        Everything you need, <span className="neon-text">one dashboard</span>
      </h2>
      <div className="h-1 w-24 mx-auto section-title-line" />
      <p className="text-white/60 max-w-xl mx-auto mt-4 text-sm sm:text-base">
        Jump straight into the software download hub, the dev toolkit, or my flagship
        project — without endless scrolling.
      </p>
    </motion.div>
  )
}

function SoftwareCard() {
  return (
    <CardShell>
      <div className="flex items-start justify-between mb-4">
        <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/15 to-neon-violet/15 border border-neon-cyan/30 flex items-center justify-center">
          <Download className="w-6 h-6 text-neon-cyan" />
        </span>
        <span className={`${badgeBase} bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30`}>
          <Package className="w-3 h-3" /> {SOFTWARE_ITEMS.length} Tools
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Software Utilities</h3>
      <p className="text-sm text-white/60 leading-relaxed flex-1 mb-5">
        Verified Windows cleaners, optimizers, activators and drivers — every asset ships
        with source preview and a secure gated download.
      </p>
      <div className="flex flex-wrap gap-2 text-[11px] font-mono mb-5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/30">
          <ShieldCheck className="w-3 h-3" /> Verified
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">
          <Zap className="w-3 h-3" /> 100% Free
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] text-white/50 border border-white/10">
          {SITE_METRICS.downloads} downloads
        </span>
      </div>
      <button onClick={() => navigate('software')} className="btn-primary text-sm px-5 py-2.5 w-full justify-center">
        <Download className="w-4 h-4" /> Open Download Hub
      </button>
    </CardShell>
  )
}

function ToolsCard() {
  return (
    <CardShell>
      <div className="flex items-start justify-between mb-4">
        <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-violet/15 to-neon-fuchsia/15 border border-neon-violet/30 flex items-center justify-center">
          <Wrench className="w-6 h-6 text-neon-violet" />
        </span>
        <span className={`${badgeBase} bg-neon-violet/10 text-neon-violet border border-neon-violet/30`}>
          <HardDrive className="w-3 h-3" /> {TOOLS.length} Tools
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Project Tools</h3>
      <p className="text-sm text-white/60 leading-relaxed flex-1 mb-5">
        The hosting, design and dev stack powering every build — from deployment CDNs to
        3D WebGL engines.
      </p>
      <div className="flex flex-wrap gap-2 text-[11px] font-mono mb-5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neon-violet/10 text-neon-violet border border-neon-violet/30">
          <Rocket className="w-3 h-3" /> Live Stack
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] text-white/50 border border-white/10">
          Hosting · Design · Dev
        </span>
      </div>
      <button onClick={() => navigate('tools')} className="btn-secondary text-sm px-5 py-2.5 w-full justify-center">
        <Wrench className="w-4 h-4" /> Browse Toolkit
      </button>
    </CardShell>
  )
}

function ProjectCard() {
  return (
    <CardShell id="projects">
      <div className="flex items-start justify-between mb-4">
        <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 border border-fuchsia-400/40 flex items-center justify-center">
          <Rocket className="w-6 h-6 text-fuchsia-300" />
        </span>
        <span className={`${badgeBase} bg-emerald-400/10 text-emerald-400 border border-emerald-400/30`}>
          <Send className="w-3 h-3" /> v2.0 LIVE
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{PROJECTS.spotlight.name}</h3>
      <p className="text-xs text-neon-violet font-mono mb-2">{PROJECTS.spotlight.tagline}</p>
      <p className="text-sm text-white/60 leading-relaxed flex-1 mb-4">
        {PROJECTS.spotlight.description}
      </p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {PROJECTS.spotlight.stats.map((s) => (
          <div key={s.label} className="text-center px-1 py-2 rounded-lg bg-white/[0.03] border border-white/10">
            <p className="text-sm font-bold font-mono neon-text">{s.value}</p>
            <p className="text-[9px] text-white/45 uppercase tracking-wide mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <a
        href={PROJECTS.spotlight.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary text-sm px-5 py-2.5 w-full justify-center"
      >
        Visit Live Demo <ExternalLink className="w-4 h-4" />
      </a>
    </CardShell>
  )
}

function SecurityCard() {
  return (
    <CardShell>
      <div className="flex items-start justify-between mb-4">
        <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/15 to-emerald-500/15 border border-neon-cyan/30 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-neon-cyan" />
        </span>
        <span className={`${badgeBase} bg-amber-400/10 text-amber-300 border border-amber-400/30`}>
          <ShieldAlert className="w-3 h-3" /> Zero Ads Interstitials
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Secure by Design</h3>
      <p className="text-sm text-white/60 leading-relaxed flex-1 mb-5">
        Every script ships source-visible for review. A lightweight anti-bot gate protects
        the direct files while keeping the flow friction-free.
      </p>
      <div className="flex flex-wrap gap-2 text-[11px] font-mono">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-400/10 text-emerald-400 border border-emerald-400/30">
          <ShieldCheck className="w-3 h-3" /> Source Visible
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neon-violet/10 text-neon-violet border border-neon-violet/30">
          <Package className="w-3 h-3" /> {SITE_METRICS.categories} Categories
        </span>
      </div>
    </CardShell>
  )
}

function ConnectCard() {
  const socials = [
    { icon: Youtube, label: 'YouTube', href: PROFILE.social.youtube, sub: `${MEDIA.youtube.subscribers} subs` },
    { icon: Instagram, label: 'Instagram', href: PROFILE.social.instagram, sub: `${MEDIA.instagram.followers} followers` },
    { icon: Facebook, label: 'Facebook', href: PROFILE.social.facebook, sub: MEDIA.facebook.handle },
    { icon: Github, label: 'GitHub', href: PROFILE.github, sub: 'jmshakya121' },
  ]
  return (
    <CardShell id="connect">
      <div className="flex items-start justify-between mb-4">
        <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/15 to-neon-cyan/15 border border-fuchsia-400/30 flex items-center justify-center">
          <Youtube className="w-6 h-6 text-fuchsia-300" />
        </span>
        <span className={`${badgeBase} bg-white/[0.04] text-white/60 border border-white/10`}>
          Always active
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Connect</h3>
      <p className="text-sm text-white/60 leading-relaxed flex-1 mb-4">
        Tutorials, builds and behind-the-scenes across my channels.
      </p>
      <div className="space-y-2.5">
        {socials
          .filter((s) => s.href)
          .map(({ icon: Icon, label, href, sub }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all duration-300"
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 text-neon-cyan shrink-0" />
                <span className="text-sm font-medium text-white truncate">{label}</span>
              </span>
              <span className="text-[10px] font-mono text-white/40">{sub}</span>
            </a>
          ))}
      </div>
    </CardShell>
  )
}

function HireCard() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [copiedEmail, setCopiedEmail] = useState(false)

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.contact.email)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } catch {
      window.location.href = EMAIL_LINK
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(HIRE.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: HIRE.accessKey,
          subject: `${HIRE.subjectPrefix}: Quick Contact`,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <CardShell id="hire">
      <div className="flex items-start justify-between mb-4">
        <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/15 to-neon-cyan/15 border border-emerald-400/30 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-emerald-400" />
        </span>
        <span className={`${badgeBase} bg-emerald-400/10 text-emerald-300 border border-emerald-400/30`}>
          <Zap className="w-3 h-3" /> Replies in 2h
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-1">Hire Me</h3>
      <p className="text-sm text-white/60 leading-relaxed mb-4">
        Tell me about your project — I'll scope the right offer.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3 flex-1">
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="text"
            value={form.name}
            onChange={update('name')}
            placeholder="Name"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:border-neon-cyan/60 focus:outline-none transition-colors text-sm"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="Email"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:border-neon-violet/60 focus:outline-none transition-colors text-sm"
          />
        </div>
        <textarea
          required
          rows="3"
          value={form.message}
          onChange={update('message')}
          placeholder="Project idea, goals, timeline..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:border-neon-cyan/60 focus:outline-none transition-colors resize-none text-sm"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn-primary w-full justify-center text-sm px-4 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {status === 'sending' ? 'Sending...' : status === 'success' ? 'Request sent!' : 'Request a Project'}
        </button>
        {status === 'error' && (
          <p className="text-[11px] text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-lg px-3 py-2">
            Something went wrong — use WhatsApp or email below instead.
          </p>
        )}
      </form>

      <div className="flex items-center gap-2.5 mt-4">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-400/30 hover:bg-emerald-500/20 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
        <a href={EMAIL_LINK} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-neon-violet bg-neon-violet/10 border border-neon-violet/30 hover:bg-neon-violet/20 transition-colors">
          <Mail className="w-3.5 h-3.5" /> Email
        </a>
        <button
          type="button"
          onClick={copyEmail}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white/70 bg-white/[0.04] border border-white/10 hover:border-neon-cyan/50 transition-colors"
        >
          {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neon-cyan" />}
          {copiedEmail ? 'Copied!' : 'Copy email'}
        </button>
      </div>
    </CardShell>
  )
}

export default function FeatureOverview() {
  return (
    <section id="features" className="relative pt-4 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,240,255,0.045),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <Header />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ staggerChildren: 0.08 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
            <SoftwareCard />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
            <ToolsCard />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
            <ProjectCard />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
            <SecurityCard />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
            <ConnectCard />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
            <HireCard />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}