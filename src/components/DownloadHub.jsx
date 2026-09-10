import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Download, Copy, Check, ShieldAlert, FileCode2,
  AlertTriangle, Package, HardDrive, Calendar, X, Lock,
  Rocket, ExternalLink, KeyRound, UserCheck, Unlock, ShieldCheck,
} from 'lucide-react'
import { SOFTWARE_ITEMS } from '../data/profile'

const SCRIPT_TYPES = ['.cmd', '.bat', '.sh', '.ps1']

function placeholderScript(item) {
  return `@echo off
title ${item.name} v${item.version}
echo.
echo ==============================================
echo   ${item.name}
echo   Author : JM Shakya
echo   Domain : jmshakya.com.np
echo ==============================================
echo.
echo [*] ${item.name} - view source before running.
echo [*] Placeholder script body.
pause`
}

const categoryColors = {
  Utilities: { text: 'text-neon-cyan', bg: 'bg-neon-cyan/10', border: 'border-neon-cyan/30' },
  'System Tools': { text: 'text-neon-violet', bg: 'bg-neon-violet/10', border: 'border-neon-violet/30' },
  Networking: { text: 'text-neon-fuchsia', bg: 'bg-neon-fuchsia/10', border: 'border-neon-fuchsia/30' },
  Automation: { text: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30' },
  '3D Templates': { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  Resources: { text: 'text-amber-300', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
}

function triggerDownload(item) {
  const content = placeholderScript(item)
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${item.id}${item.type || '.bat'}`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const isDirectFile = (url, type) =>
  Boolean(url) && SCRIPT_TYPES.includes(type) && !url.includes('github.com')

function directDownload(item) {
  const a = document.createElement('a')
  a.href = item.downloadUrl
  a.download = item.downloadName || `${item.id}${item.type}`
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/* ---------------- 2-STEP GATE MODAL ---------------- */

function GateModal({ item, onClose }) {
  const [unlocked, setUnlocked] = useState(false)
  const [bot, setBot] = useState(false)
  const [count, setCount] = useState(10)
  const [copiedPw, setCopiedPw] = useState(false)

  const hasFunnel = Boolean(item.funnelUrl)
  const hasRelease = Boolean(item.releaseUrl)
  const hasDirect = Boolean(item.downloadUrl)

  const primaryUrl = item.funnelUrl || item.releaseUrl

  useEffect(() => {
    const iv = setInterval(() => {
      setCount((c) => (c > 0 ? c - 1 : 0))
    }, 1000)
    return () => clearInterval(iv)
  }, [])

  const ready = count === 0 && bot

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(item.password)
      setCopiedPw(true)
      setTimeout(() => setCopiedPw(false), 2000)
    } catch {
      setCopiedPw(false)
    }
  }

  const handleUnlock = () => {
    if (item.funnelUrl && item.funnelUrl.startsWith('http')) {
      window.open(item.funnelUrl, '_blank', 'noopener,noreferrer')
    } else if (item.releaseUrl) {
      window.open(item.releaseUrl, '_blank', 'noopener,noreferrer')
    }
    if (isDirectFile(item.downloadUrl, item.type)) {
      setTimeout(() => directDownload(item), 500)
    }
    setUnlocked(true)
  }

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
        className="relative glass-strong rounded-3xl p-8 w-full max-w-md text-center overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-neon-violet/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 rounded-full bg-neon-cyan/20 blur-3xl" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10">
          <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-white/[0.05] border border-white/15 flex items-center justify-center">
            <FileCode2 className="w-7 h-7 text-neon-cyan" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
          <p className="text-xs text-white/50 mb-6 font-mono">
            {item.type} · {item.size} · Secure unlock
          </p>

          {/* STEP 1: countdown + bot check */}
          {!unlocked ? (
            <div className="space-y-5">
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="url(#gateGrad)"
                    strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - count / 10)}
                  />
                  <defs>
                    <linearGradient id="gateGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00f0ff" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute text-2xl font-bold font-mono text-white">{count}</span>
              </div>

              <button
                type="button"
                onClick={() => setBot((b) => !b)}
                className={`w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border text-sm font-medium transition-all duration-300 ${
                  bot
                    ? 'bg-neon-cyan/15 border-neon-cyan/60 text-white shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                    : 'bg-white/[0.04] border-white/15 text-white/60 hover:border-white/35'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded border transition-all duration-300 ${
                    bot ? 'bg-neon-cyan border-neon-cyan' : 'border-white/40'
                  }`}
                >
                  {bot && <Check className="w-3.5 h-3.5 text-[#05050a]" />}
                </span>
                I'm not a bot
                <UserCheck className="w-4 h-4 ml-1 text-neon-violet" />
              </button>

              <button
                type="button"
                onClick={handleUnlock}
                disabled={!ready}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-neon-cyan/25 to-neon-violet/25 border border-neon-cyan/50 transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed enabled:hover:shadow-[0_0_30px_rgba(0,240,255,0.35)] enabled:hover:-translate-y-0.5"
              >
                {primaryUrl ? <Rocket className="w-4 h-4 text-neon-cyan" /> : <Unlock className="w-4 h-4 text-neon-cyan" />}
                {count > 0 ? `Unlocks in ${count}s` : bot ? 'Unlock Download' : 'Verify below to unlock'}
              </button>
            </div>
          ) : (
            /* STEP 2: download reveal */
            <div className="space-y-4">
              {primaryUrl && (
                <a
                  href={primaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500/20 to-neon-violet/20 border border-emerald-400/40 hover:shadow-[0_0_25px_rgba(52,211,153,0.3)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Rocket className="w-4 h-4 text-emerald-400" />
                  {hasFunnel ? 'Open Secure Download Link' : 'Download via GitHub Releases'}
                  <ExternalLink className="w-4 h-4 text-white/60" />
                </a>
              )}

              {hasDirect && (
                <a
                  href={item.downloadUrl}
                  download={item.downloadName}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-white/[0.05] border border-white/15 hover:border-neon-cyan/50 transition-all duration-300"
                >
                  <Download className="w-4 h-4 text-neon-cyan" />
                  Direct download {item.downloadName ? `(${item.downloadName})` : item.type}
                </a>
              )}

              {!hasFunnel && !hasRelease && !hasDirect && (
                <button
                  onClick={() => triggerDownload(item)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-white/[0.05] border border-white/15 hover:border-neon-cyan/50 transition-all duration-300"
                >
                  <Download className="w-4 h-4 text-neon-cyan" /> Download {item.type}
                </button>
              )}

              {item.password && (
                <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-amber-400/30">
                  <div className="flex items-center gap-2 text-left">
                    <KeyRound className="w-4 h-4 text-amber-300" />
                    <div className="leading-tight">
                      <p className="text-[10px] text-white/40 uppercase tracking-wide">Archive password</p>
                      <p className="text-sm font-mono font-bold text-amber-300">{item.password}</p>
                    </div>
                  </div>
                  <button
                    onClick={copyPassword}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white/80 bg-white/[0.06] border border-white/15 hover:border-amber-400/50 transition-colors"
                  >
                    {copiedPw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPw ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}

              <p className="flex items-center justify-center gap-1.5 text-[11px] text-white/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Unlocked · {item.size} · {item.downloads} downloads
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ---------------- CARD ---------------- */

function AssetCard({ item, index }) {
  const color = categoryColors[item.category] || categoryColors.Utilities
  const [expanded, setExpanded] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyScript = async () => {
    try {
      const content = item.downloadUrl
        ? await (await fetch(item.downloadUrl)).text()
        : placeholderScript(item)
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true, margin: '-50px' }}
      className="group relative glass rounded-2xl p-6 hover:border-neon-cyan/40 hover:shadow-[0_0_40px_rgba(0,240,255,0.08)] transition-all duration-500"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl border ${color.border} ${color.bg} flex items-center justify-center relative overflow-hidden`}>
          <FileCode2 className={`w-6 h-6 ${color.text}`} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-fuchsia blur-sm opacity-60" />
        </div>
        <div className="flex items-center gap-2">
          {item.badge && (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold ${color.text} ${color.bg} border ${color.border}`}>
              {item.badge}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-white/60 bg-white/[0.04] border border-white/10">
            {item.type}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors duration-300">
        {item.name}
      </h3>
      <p className="text-sm text-white/60 leading-relaxed mb-4">
        {item.description}
      </p>

      <div className="flex flex-wrap gap-2 text-xs font-mono mb-5">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${color.bg} ${color.text} border ${color.border}`}>
          <Package className="w-3 h-3" /> {item.category}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] text-white/50 border border-white/10">
          <HardDrive className="w-3 h-3" /> {item.size}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] text-white/50 border border-white/10">
          <Calendar className="w-3 h-3" /> {item.date}
        </span>
        {item.password && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/30">
            <KeyRound className="w-3 h-3" /> pw: {item.password}
          </span>
        )}
        {item.funnelUrl && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-400/10 text-emerald-300 border border-emerald-400/30">
            <Rocket className="w-3 h-3" /> monetized
          </span>
        )}
      </div>

      <div className={`text-xs text-amber-300/90 bg-amber-400/[0.06] border border-amber-400/20 rounded-lg px-3 py-2 flex items-start gap-2 mb-4 ${expanded ? '' : 'relative max-h-11 overflow-hidden'}`}>
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{item.securityNote}</p>
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="absolute bottom-1 right-2 pl-2 pb-0.5 text-amber-300/90 text-[10px] font-semibold hover:underline"
            style={{ background: 'linear-gradient(to top, #3f3a12, rgba(63,58,18,0.9))' }}
          >
            more
          </button>
        )}
      </div>

      {expanded && (
        <button onClick={() => setExpanded(false)} className="text-[10px] font-mono text-white/40 hover:text-white/70 mb-3 transition-colors">
          hide note ▲
        </button>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3 mt-auto">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => setGateOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <Lock className="w-4 h-4 text-neon-cyan group-hover:animate-pulse" />
            Unlock File
          </button>
          {item.downloadUrl && SCRIPT_TYPES.includes(item.type) && !item.downloadUrl.includes('github.com') && (
            <button
              onClick={copyScript}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white/80 bg-white/[0.04] border border-white/15 hover:border-neon-violet/50 hover:text-white transition-all duration-300"
            >
              {copied ? (
                <><Check className="w-4 h-4 text-emerald-400" /> Copied!</>
              ) : (
                <><Copy className="w-4 h-4 text-neon-violet" /> Copy Script</>
              )}
            </button>
          )}
        </div>
        <span className="text-[11px] font-mono text-white/40 flex items-center gap-1.5">
          <Download className="w-3 h-3" /> {item.downloads} downloads
        </span>
      </div>

      <AnimatePresence>
        {gateOpen && (
          <GateModal item={item} onClose={() => setGateOpen(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ---------------- SECTION ---------------- */

export default function DownloadHub() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const allCategories = useMemo(
    () => ['All', ...new Set(SOFTWARE_ITEMS.map((i) => i.category))],
    []
  )

  const filtered = useMemo(() => {
    return SOFTWARE_ITEMS.filter((item) => {
      const matchCategory = category === 'All' || item.category === category
      const q = query.trim().toLowerCase()
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.lang.toLowerCase().includes(q)
      return matchCategory && matchQuery
    })
  }, [query, category])

  return (
    <section id="software" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.06),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <p className="chip mx-auto mb-4">
            <Package className="w-3.5 h-3.5" /> Download Hub
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Scripts, 3D Templates &amp; <span className="neon-text">Tech Resources</span>
          </h2>
          <div className="h-1 w-24 mx-auto section-title-line" />
          <p className="text-white/60 max-w-xl mx-auto mt-5 text-sm sm:text-base">
            Search, discover, and unlock scripts and resources — each asset goes through a
            quick anti-bot check before the link releases.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-neon-cyan transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search scripts, templates, categories..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl text-white placeholder:text-white/30 focus:border-neon-cyan/60 focus:outline-none focus:shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all duration-300"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  ×
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {allCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
                  category === c
                    ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border-neon-cyan/50 text-white shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                    : 'bg-white/[0.03] border-white/10 text-white/50 hover:text-white hover:border-white/30'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <AssetCard key={item.id} item={item} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-5xl mb-4 opacity-40">🔍</p>
            <p className="text-white/60 mb-2">No assets found for "{query}"</p>
            <button
              onClick={() => { setQuery(''); setCategory('All') }}
              className="text-neon-cyan hover:underline text-sm font-medium"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4 justify-center glass rounded-2xl px-6 py-5 border-amber-400/20"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/10 border border-amber-400/30">
            <AlertTriangle className="w-5 h-5 text-amber-300" />
          </span>
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-white mb-1">Security first — always</p>
            <p className="text-xs text-white/50 leading-relaxed max-w-lg">
              Every script ships with source visible for review. Inspect the code and run
              tools only on machines you own or are authorized to manage. Use at your own risk.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}