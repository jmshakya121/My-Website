import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Send, MessageCircle, CheckCircle2, Zap, ShieldCheck, Code2,
  Mail, MapPin, Linkedin, AlertCircle, ChevronDown, Copy, Check,
} from 'lucide-react'
import { PROFILE, HIRE, WHATSAPP_LINK } from '../data/profile'
import { copyText } from '../utils/copy'
import { showToast } from '../utils/toast'

const trustIcons = [Zap, ShieldCheck, Code2]

function IntakeForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    budget: '',
    projectType: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | success | error | mailto

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const fallbackMailto = () => {
    const subject = encodeURIComponent(
      `${HIRE.subjectPrefix}: ${form.projectType || 'Project'} (${form.budget || 'budget TBD'})`
    )
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${PROFILE.contact.email}?subject=${subject}&body=${body}`
    setStatus('mailto')
    setTimeout(() => setStatus('idle'), 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!HIRE.accessKey) {
      fallbackMailto()
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(HIRE.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: HIRE.accessKey,
          subject: `${HIRE.subjectPrefix}: ${form.projectType || 'Project Request'}`,
          name: form.name,
          email: form.email,
          budget_range: form.budget,
          project_type: form.projectType,
          message: form.message,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setForm({ name: '', email: '', budget: '', projectType: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          required
          type="text"
          value={form.name}
          onChange={update('name')}
          placeholder="Your name"
          className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:border-neon-cyan/60 focus:outline-none focus:shadow-[0_0_25px_rgba(0,240,255,0.08)] transition-all duration-300"
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={update('email')}
          placeholder="Your email"
          className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:border-neon-violet/60 focus:outline-none focus:shadow-[0_0_25px_rgba(168,85,247,0.08)] transition-all duration-300"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative">
          <select
            required
            value={form.budget}
            onChange={update('budget')}
            className="w-full appearance-none px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-neon-cyan/60 focus:outline-none focus:shadow-[0_0_25px_rgba(0,240,255,0.08)] transition-all duration-300 cursor-pointer"
          >
            <option value="" disabled className="bg-base-900">Budget range</option>
            {HIRE.budgetOptions.map((b) => (
              <option key={b} value={b} className="bg-base-900">{b}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        </div>
        <div className="relative">
          <select
            required
            value={form.projectType}
            onChange={update('projectType')}
            className="w-full appearance-none px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-neon-violet/60 focus:outline-none focus:shadow-[0_0_25px_rgba(168,85,247,0.08)] transition-all duration-300 cursor-pointer"
          >
            <option value="" disabled className="bg-base-900">Project type</option>
            {HIRE.projectTypes.map((t) => (
              <option key={t} value={t} className="bg-base-900">{t}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        </div>
      </div>

      <textarea
        required
        rows="5"
        value={form.message}
        onChange={update('message')}
        placeholder="Describe your project, goals, and timeline..."
        className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:border-neon-cyan/60 focus:outline-none focus:shadow-[0_0_25px_rgba(0,240,255,0.08)] transition-all duration-300 resize-none"
      />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        {status === 'sending' ? 'Sending...' : 'Request a Project'}
      </button>

      {status === 'success' && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-xl px-4 py-3"
        >
          <CheckCircle2 className="w-4 h-4" /> Request sent! I'll get back to you within 2 hours.
        </motion.p>
      )}
      {status === 'mailto' && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl px-4 py-3"
        >
          <Mail className="w-4 h-4" /> Email client opened — your request is ready to send.
        </motion.p>
      )}
      {status === 'error' && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-3"
        >
          <AlertCircle className="w-4 h-4" /> Something went wrong. Use the WhatsApp button below instead.
        </motion.p>
      )}
    </form>
  )
}

export default function ContactSection() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const copyEmail = async () => {
    const ok = await copyText(PROFILE.contact.email)
    if (ok) {
      setCopiedEmail(true)
      showToast('Email copied to clipboard', { kind: 'copy', description: PROFILE.contact.email })
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopiedEmail(false), 2500)
    } else {
      // Clipboard blocked (insecure context, permissions) — fall back to the
      // mail client rather than silently doing nothing.
      showToast('Clipboard unavailable — opening your mail app', { kind: 'info' })
      window.location.href = `mailto:${PROFILE.contact.email}`
    }
  }

  return (
    <section id="hire" className="relative pt-16 pb-20 overflow-hidden">
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
            <Zap className="w-3.5 h-3.5" /> Hire Me
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Let's Build Something <span className="neon-text">Great Together</span>
          </h2>
          <div className="h-1 w-24 mx-auto section-title-line" />
          <p className="text-white/60 max-w-xl mx-auto mt-5 text-sm sm:text-base">
            Tell me about your project — I'll usually reply within 2 hours during working hours.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-400/10 border border-emerald-400/30">
            <Zap className="w-3.5 h-3.5" /> Replies within 2 hours
          </p>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10"
        >
          {HIRE.trust.map((t, i) => {
            const Icon = trustIcons[i] || ShieldCheck
            return (
              <div key={t.label} className="glass rounded-2xl p-5 flex items-start gap-3 hover:border-neon-cyan/40 transition-all duration-300">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neon-cyan/10 border border-neon-cyan/30">
                  <Icon className="w-5 h-5 text-neon-cyan" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white">{t.label}</p>
                  <p className="text-[11px] text-white/50 mt-0.5">{t.detail}</p>
                </div>
              </div>
            )
          })}
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact channels */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true, margin: '-50px' }}
            className="lg:col-span-2 space-y-4"
          >
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block glass rounded-2xl p-5 hover:border-emerald-400/50 hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 group"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl mb-4 border border-emerald-400/30 bg-emerald-500/10">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </span>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">WhatsApp</p>
              <p className="text-sm text-white/80 group-hover:text-emerald-400 transition-colors">{PROFILE.contact.phone}</p>
              <p className="text-[10px] font-mono text-emerald-400/70 mt-2">Replies fastest here →</p>
            </a>

            {PROFILE.social.telegram && (
              <a
                href={PROFILE.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="block glass rounded-2xl p-5 hover:border-sky-400/50 hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 group"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl mb-4 border border-sky-400/30 bg-sky-500/10">
                  <Send className="w-5 h-5 text-sky-400" />
                </span>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Telegram</p>
                <p className="text-sm text-white/80 group-hover:text-sky-400 transition-colors">Chat directly on Telegram</p>
                <p className="text-[10px] text-white/40 mt-2">Fast, encrypted, no spam →</p>
              </a>
            )}

            <a
              href={`mailto:${PROFILE.contact.email}`}
              className="block glass rounded-2xl p-5 hover:border-neon-violet/50 hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 group"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl mb-4 border border-neon-violet/30 bg-neon-violet/10">
                <Mail className="w-5 h-5 text-neon-violet" />
              </span>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Email</p>
              <p className="text-sm text-white/80 group-hover:text-neon-violet transition-colors break-all">{PROFILE.contact.email}</p>
            </a>

            <button
              type="button"
              onClick={copyEmail}
              className="w-full flex items-center justify-between gap-3 glass rounded-2xl p-5 hover:border-neon-cyan/50 hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 group text-left"
            >
              <span className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neon-cyan/30 bg-neon-cyan/10">
                  <Copy className="w-5 h-5 text-neon-cyan" />
                </span>
                <span>
                  <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Copy Email</span>
                  <span className="block text-sm text-white/80 group-hover:text-neon-cyan transition-colors">
                    {copiedEmail ? 'Copied to clipboard!' : 'Click to copy address'}
                  </span>
                </span>
              </span>
              {copiedEmail ? (
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Send className="w-4 h-4 text-white/30 group-hover:text-neon-cyan transition-colors shrink-0" />
              )}
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-4 text-center hover:border-neon-cyan/40 transition-colors duration-300">
                <p className="text-lg font-bold neon-text">2h</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wide mt-1">avg. reply time</p>
              </div>
              <div className="glass rounded-2xl p-4 text-center hover:border-neon-violet/40 transition-colors duration-300">
                <MapPin className="w-4 h-4 text-neon-fuchsia mx-auto mb-1" />
                <p className="text-sm font-bold text-white">{PROFILE.location}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wide mt-0.5">{PROFILE.postalCode} · NP</p>
              </div>
            </div>

            {PROFILE.social.linkedin && (
              <a
                href={PROFILE.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block glass rounded-2xl p-5 hover:border-sky-400/50 hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 group"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl mb-4 border border-sky-400/30 bg-sky-500/10">
                  <Linkedin className="w-5 h-5 text-sky-400" />
                </span>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">LinkedIn</p>
                <p className="text-sm text-white/80 group-hover:text-sky-400 transition-colors">Connect professionally</p>
              </a>
            )}
          </motion.div>

          {/* Intake form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, margin: '-50px' }}
            className="lg:col-span-3 glass rounded-3xl p-6 sm:p-8 lg:p-10 border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Request a Project</h3>
            <p className="text-sm text-white/40 mb-8">
              Budget + project type helps me scope the right offer for you.
            </p>
            <IntakeForm />
          </motion.div>
        </div>
      </div>
    </section>
  )
}