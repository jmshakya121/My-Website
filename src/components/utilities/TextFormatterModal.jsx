import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Type, Hash, Sparkles, Copy, Eraser } from 'lucide-react'
import UtilityModal from './UtilityModal.jsx'
import { showToast } from '../../utils/toast'
import { copyText } from '../../utils/copy'

const cleanText = (raw) =>
  raw
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim()

const toHashtags = (raw, { removeNumbers, startWithHash }) =>
  Array.from(
    new Set(
      cleanText(raw)
        .split(/[^A-Za-z0-9]+/)
        .map((w) => w.trim())
        .filter(Boolean)
        .filter((w) => !(removeNumbers && /^\d+$/.test(w)))
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    )
  )
    .map((w) => (startWithHash ? '#' : '') + w)
    .join(' ')

export default function TextFormatterModal({ onClose }) {
  const [mode, setMode] = useState('text')
  const [input, setInput] = useState('')
  const [removeNumbers, setRemoveNumbers] = useState(true)

  const demoText = 'Hello   World!  3d   web   development   with  three.js\n\n#tag   styling   &   typography'

  const cleaned = useMemo(() => cleanText(input), [input])
  const hashtags = useMemo(() => toHashtags(input, { removeNumbers }), [input, removeNumbers])

  const wordCount = cleaned ? cleaned.split(/\s+/).filter(Boolean).length : 0
  const tagCount = hashtags ? hashtags.split(' ').filter(Boolean).length : 0

  const copy = async (text, label) => {
    const ok = await copyText(text)
    showToast(
      ok ? `${label} copied to clipboard` : 'Copy failed — long-press and copy manually.',
      { kind: ok ? 'copy' : 'error', description: `${text.length} chars` }
    )
  }

  return (
    <UtilityModal title="Clean Text & Hashtag Formatter" subtitle="de-duplicate, tidy, and hashify any caption" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('text')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
              mode === 'text'
                ? 'bg-neon-cyan/15 border-neon-cyan/60 text-white'
                : 'bg-white/[0.03] border-white/10 text-white/50 hover:text-white hover:border-white/30'
            }`}
          >
            <Type className="w-4 h-4" /> Clean Text
          </button>
          <button
            onClick={() => setMode('tags')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
              mode === 'tags'
                ? 'bg-neon-violet/15 border-neon-violet/60 text-white'
                : 'bg-white/[0.03] border-white/10 text-white/50 hover:text-white hover:border-white/30'
            }`}
          >
            <Hash className="w-4 h-4" /> Hashtag Engine
          </button>
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block">
            paste messy text <button onClick={() => setInput(demoText)} className="text-neon-cyan hover:underline normal-case tracking-normal ml-2">try demo</button>
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            placeholder="Paste captions, bios, hashtag spam, or notes…"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:border-neon-cyan/60 focus:outline-none focus:shadow-[0_0_25px_rgba(0,240,255,0.1)] transition-all duration-300 text-sm leading-relaxed resize-y"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px] font-mono text-white/50">
            <span>{wordCount} words</span>
            <span className="text-white/20">·</span>
            <span>{cleaned.length} chars</span>
          </div>
          {mode === 'tags' && (
            <label className="flex items-center gap-2 text-[11px] font-mono text-white/50 cursor-pointer">
              <input
                type="checkbox"
                checked={removeNumbers}
                onChange={(e) => setRemoveNumbers(e.target.checked)}
                className="accent-cyan-400"
              />
              skip digits
            </label>
          )}
        </div>

        {(cleaned || hashtags) && (
          <div className="glass rounded-xl p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neon-violet" /> {mode === 'text' ? 'cleaned output' : `${tagCount} unique hashtags`}
            </p>
            <p className={`${mode === 'tags' ? 'text-sm text-neon-cyan' : 'text-sm text-white/85'} leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto select-text`}>
              {mode === 'text' ? cleaned : hashtags}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => { setInput(''); setMode('text') }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white/70 bg-white/[0.04] border border-white/15 hover:border-white/35 hover:text-white transition-all duration-300"
          >
            <Eraser className="w-3.5 h-3.5" /> Reset
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={!(cleaned || hashtags)}
            onClick={() => copy(mode === 'text' ? cleaned : hashtags, mode === 'text' ? 'Cleaned text' : 'Hashtags')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-neon-cyan/20 to-neon-violet/20 border border-neon-cyan/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] transition-all duration-300 disabled:opacity-40"
          >
            <Copy className="w-4 h-4 text-neon-cyan" /> Copy {mode === 'text' ? 'Clean Text' : `All ${tagCount} Hashtags`}
          </motion.button>
        </div>
      </div>
    </UtilityModal>
  )
}