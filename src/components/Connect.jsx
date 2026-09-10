import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import {
  Youtube, Instagram, Facebook, Play, ThumbsUp, Users,
  Video, X, ExternalLink, Image, ScanLine, Sparkles,
} from 'lucide-react'
import { MEDIA, PROFILE } from '../data/profile'

function StatBadge({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10">
        <Icon className="w-4 h-4 text-neon-cyan" />
      </span>
      <div className="leading-tight">
        <p className="text-sm font-bold text-white">{value}</p>
        <p className="text-[10px] text-white/40 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  )
}

function InstagramModal({ open, onClose }) {
  if (!open) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="relative glass-strong rounded-3xl p-8 max-w-sm w-full text-center overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-neon-violet/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-neon-cyan/20 blur-3xl" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10">
          <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-gradient-to-tr from-amber-400 via-fuchsia-500 to-violet-600 p-[2px] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-base-900 flex items-center justify-center">
              <Instagram className="w-7 h-7 text-white" />
            </div>
          </div>

          <ScanLine className="mx-auto mb-1 w-6 h-6 text-neon-cyan" />
          <h3 className="text-xl font-bold text-white mb-1">Scan to connect</h3>
          <p className="text-xs text-white/50 mb-6 font-mono">@{MEDIA.instagram.handle}</p>

          <div className="relative mx-auto w-fit p-3 rounded-2xl bg-[#fff] shadow-[0_0_40px_rgba(168,85,247,0.2)]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-cyan/30 to-neon-violet/30 blur-lg -z-10" />
            <div className="relative h-[200px] w-[200px] rounded-xl overflow-hidden bg-[#fff]">
              <img
                src={MEDIA.instagram.qr}
                alt={`Instagram QR code for ${MEDIA.instagram.handle}`}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling.style.display = 'flex'
                }}
                className="w-full h-full object-contain"
                loading="lazy"
              />
              <div
                className="hidden absolute inset-0 items-center justify-center"
                aria-hidden="true"
              >
                <QRCodeSVG
                  value={`https://www.instagram.com/${MEDIA.instagram.handle}`}
                  size={190}
                  level="H"
                  fgColor="#0a0a14"
                  bgColor="transparent"
                />
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-white/40 leading-relaxed">
            Open Instagram → tap the camera →
            <span className="text-neon-cyan"> scan this code</span> to follow me instantly.
          </p>

          <a
            href={PROFILE.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-fuchsia-500/30 to-violet-500/30 border border-fuchsia-400/40 hover:shadow-[0_0_30px_rgba(232,121,249,0.3)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4" /> Open Instagram
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Connect() {
  const [igOpen, setIgOpen] = useState(false)

  return (
    <section id="connect" className="relative pt-16 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,121,249,0.05),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <p className="chip mx-auto mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Follow the Journey
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Media &amp; <span className="neon-text">Social Connect</span>
          </h2>
          <div className="h-1 w-24 mx-auto section-title-line" />
          <p className="text-white/60 max-w-xl mx-auto mt-5 text-sm sm:text-base">
            Tutorials, behind-the-scenes, and day-in-the-life content across my channels.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* YouTube */}
          <motion.a
            href={PROFILE.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="group relative glass rounded-3xl p-8 overflow-hidden hover:-translate-y-2 transition-transform duration-500"
          >
            <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-red-500/15 blur-3xl group-hover:bg-red-500/25 transition-colors duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-shadow duration-300">
                  <Youtube className="w-7 h-7 text-red-400" />
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-red-500/10 border border-red-500/30 text-red-300">
                  Channel
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{MEDIA.youtube.handle}</h3>
              <p className="text-xs text-white/40 font-mono mb-6">Tech tutorials & 3D dev logs</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <StatBadge icon={Users} value={MEDIA.youtube.subscribers} label="Subscribers" />
                <StatBadge icon={Video} value={MEDIA.youtube.videos} label="Videos" />
              </div>

              <div className="flex -space-x-2 mb-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500/40 to-violet-500/40 border-2 border-base-900 flex items-center justify-center">
                    <Play className="w-3 h-3 text-white" />
                  </div>
                ))}
                <span className="w-8 h-8 rounded-full bg-white/[0.06] border-2 border-base-900 flex items-center justify-center text-[9px] text-white/50 font-bold">
                  +{MEDIA.youtube.videos.replace('+', '')}
                </span>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-white/50 flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5 text-red-400" /> Daily uploads
                </span>
                <span className="text-neon-cyan group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1 text-xs font-semibold">
                  Watch <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </motion.a>

          {/* Instagram */}
          <motion.button
            onClick={() => setIgOpen(true)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative glass rounded-3xl p-8 overflow-hidden hover:-translate-y-2 transition-transform duration-500 text-left"
          >
            <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-fuchsia-500/20 blur-3xl group-hover:bg-fuchsia-500/35 transition-colors duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400/20 via-fuchsia-500/20 to-violet-600/20 border border-fuchsia-400/40 group-hover:shadow-[0_0_30px_rgba(232,121,249,0.3)] transition-shadow duration-300">
                  <Instagram className="w-7 h-7 text-fuchsia-300" />
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-fuchsia-500/10 border border-fuchsia-400/30 text-fuchsia-300">
                  QR Code
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">@{MEDIA.instagram.handle}</h3>
              <p className="text-xs text-white/40 font-mono mb-6">Behind the scenes & reels</p>

              <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gradient-to-tr from-amber-400/10 via-fuchsia-500/10 to-violet-600/10 border border-fuchsia-400/20 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#fff] p-1.5">
                  <img
                    src={`data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="#0a0a14"><rect width="40" height="40" rx="8" fill="white"/><rect x="6" y="6" width="28" height="28" rx="6" fill="none" stroke="#0a0a14" stroke-width="3"/><circle cx="20" cy="20" r="7" fill="none" stroke="#0a0a14" stroke-width="3"/><circle cx="29" cy="11" r="2.5" fill="#0a0a14"/></svg>`)}`}
                    alt="Instagram icon"
                    className="w-full h-full"
                  />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-white">{MEDIA.instagram.followers} followers</p>
                  <p className="text-[10px] text-white/40 flex items-center gap-1">
                    <ScanLine className="w-3 h-3" /> Tap to open QR code
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-white/50 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-fuchsia-400" /> 200+ posts
                </span>
                <span className="text-neon-cyan group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1 text-xs font-semibold">
                  Scan <ScanLine className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </motion.button>

          {/* Facebook */}
          <motion.a
            href={PROFILE.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative glass rounded-3xl p-8 overflow-hidden hover:-translate-y-2 transition-transform duration-500"
          >
            <div className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full bg-blue-600/20 blur-3xl group-hover:bg-blue-600/35 transition-colors duration-500" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-400/30 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-shadow duration-300">
                  <Facebook className="w-7 h-7 text-blue-400" />
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-blue-600/10 border border-blue-400/30 text-blue-300">
                  Page
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{MEDIA.facebook.handle}</h3>
              <p className="text-xs text-white/40 font-mono mb-6">Community & updates</p>

              <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-blue-600/10 border border-blue-400/20 mb-6">
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-violet p-[2px]">
                  <div className="w-full h-full rounded-full bg-base-900 flex items-center justify-center text-[10px] font-bold text-white">
                    JM
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-base-900" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-white">JM Shakya</p>
                  <p className="text-[10px] text-white/40">Online now</p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-white/50 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" /> 5.2K friends
                </span>
                <span className="text-neon-cyan group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1 text-xs font-semibold">
                  Visit <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </motion.a>
        </div>
      </div>

      <AnimatePresence>
        {igOpen && <InstagramModal open={igOpen} onClose={() => setIgOpen(false)} />}
      </AnimatePresence>
    </section>
  )
}