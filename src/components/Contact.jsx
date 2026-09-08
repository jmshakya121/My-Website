import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Phone, Mail, MapPin, Send, MessageCircle, CheckCircle2,
} from 'lucide-react'
import { PROFILE, WHATSAPP_LINK } from '../data/profile'

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio contact from ${form.name || 'visitor'}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${PROFILE.contact.email}?subject=${subject}&body=${body}`
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative group">
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:border-neon-cyan/60 focus:outline-none focus:shadow-[0_0_25px_rgba(0,240,255,0.08)] transition-all duration-300"
          />
        </div>
        <div className="relative">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Your email"
            className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:border-neon-violet/60 focus:outline-none focus:shadow-[0_0_25px_rgba(168,85,247,0.08)] transition-all duration-300"
          />
        </div>
      </div>
      <textarea
        required
        rows="5"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Tell me about your project or idea..."
        className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:border-neon-cyan/60 focus:outline-none focus:shadow-[0_0_25px_rgba(0,240,255,0.08)] transition-all duration-300 resize-none"
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          className="btn-primary flex-1 justify-center"
        >
          <Send className="w-4 h-4" /> Send via Email
        </button>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex-1 justify-center"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" /> Chat on WhatsApp
        </a>
      </div>
      {sent && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-xl px-4 py-3"
        >
          <CheckCircle2 className="w-4 h-4" /> Email client opened — your message is ready to send!
        </motion.p>
      )}
    </form>
  )
}

function InfoCard({ icon: Icon, label, value, link, accent }) {
  const inner = (
    <div className="glass rounded-2xl p-5 hover:border-neon-cyan/40 hover:-translate-y-1 transition-all duration-300 h-full group">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 border ${accent.border} ${accent.bg}`}>
        <Icon className={`w-5 h-5 ${accent.text}`} />
      </span>
      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">{label}</p>
      <p className="text-sm text-white/80 group-hover:text-neon-cyan transition-colors break-all">{value}</p>
      {link && <p className="text-[10px] font-mono text-neon-violet mt-2 opacity-0 group-hover:opacity-100 transition-opacity">click to open</p>}
    </div>
  )
  if (!link) return inner
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
      {inner}
    </a>
  )
}

export default function Contact() {
  const year = new Date().getFullYear()

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
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
            <MessageCircle className="w-3.5 h-3.5" /> Let's talk
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Get In <span className="neon-text">Touch</span>
          </h2>
          <div className="h-1 w-24 mx-auto section-title-line" />
          <p className="text-white/60 max-w-xl mx-auto mt-5 text-sm sm:text-base">
            Have a project in mind or just want to say hi? Reach out — I usually reply
            within a few hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true, margin: '-50px' }}
            className="lg:col-span-2 space-y-4"
          >
            <InfoCard
              icon={Phone}
              label="Phone"
              value={PROFILE.contact.phone}
              link={`tel:${PROFILE.contact.phone.replace(/\s/g, '')}`}
              accent={{ text: 'text-neon-cyan', border: 'border-neon-cyan/30', bg: 'bg-neon-cyan/10' }}
            />
            <InfoCard
              icon={Mail}
              label="Email"
              value={PROFILE.contact.email}
              link={`mailto:${PROFILE.contact.email}`}
              accent={{ text: 'text-neon-violet', border: 'border-neon-violet/30', bg: 'bg-neon-violet/10' }}
            />
            <div className="glass rounded-2xl p-5 hover:border-neon-violet/40 hover:-translate-y-1 transition-all duration-300">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl mb-4 border border-neon-fuchsia/30 bg-neon-fuchsia/10">
                <MapPin className="w-5 h-5 text-neon-fuchsia" />
              </span>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Location</p>
              <p className="text-sm text-white/80">{PROFILE.location}</p>
              <p className="text-xs font-mono text-white/40 mt-2">Postal Code: {PROFILE.postalCode} · NP</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <div className="glass rounded-2xl p-4 text-center hover:border-neon-cyan/40 transition-colors duration-300">
                <p className="text-lg font-bold neon-text">{year}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wide mt-1">on the keyboard</p>
              </div>
              <div className="glass rounded-2xl p-4 text-center hover:border-neon-violet/40 transition-colors duration-300">
                <p className="text-lg font-bold text-white">44600</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wide mt-1">KTM · Nepal</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, margin: '-50px' }}
            className="lg:col-span-3 glass rounded-3xl p-6 sm:p-8 lg:p-10 border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Send a message</h3>
            <p className="text-sm text-white/40 mb-8">
              Direct email launcher & WhatsApp click-to-chat — no backend required.
            </p>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  )
}