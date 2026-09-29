import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link2, ExternalLink, Image, AlertCircle, Check } from 'lucide-react'
import UtilityModal from './UtilityModal.jsx'
import { showToast } from '../../utils/toast'
import { copyText } from '../../utils/copy'

const VIDEO_ID_RE =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/

const THUMB_SIZES = [
  { key: 'maxresdefault', label: 'Max Quality', w: 1280, h: 720 },
  { key: 'hqdefault', label: 'HD', w: 480, h: 360 },
  { key: 'sddefault', label: 'SD', w: 640, h: 480 },
  { key: 'mqdefault', label: 'MQ', w: 320, h: 180 },
]

function extractVideoId(input) {
  const m = String(input || '').trim().match(VIDEO_ID_RE)
  if (m) return m[1]
  const bare = input.trim()
  return /^[\w-]{11}$/.test(bare) ? bare : null
}

export default function YoutubeThumbModal({ onClose }) {
  const [url, setUrl] = useState('')
  const videoId = useMemo(() => extractVideoId(url), [url])
  const [failed, setFailed] = useState({})

  const thumbs = useMemo(
    () => (videoId ? THUMB_SIZES.map((t) => ({ ...t, src: `https://i.ytimg.com/vi/${videoId}/${t.key}.jpg` })) : []),
    [videoId]
  )

  const copy = async (src) => {
    const ok = await copyText(src)
    showToast(
      ok ? 'Thumbnail URL copied' : 'Copy failed — long-press and copy manually.',
      { kind: ok ? 'copy' : 'error', description: src }
    )
  }

  return (
    <UtilityModal title="YouTube Thumbnail Extractor" subtitle="grab any video's cover at 4 sizes" onClose={onClose}>
      <div className="space-y-5">
        <div>
          <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-neon-cyan" /> paste a YouTube link
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=…  or  https://youtu.be/…"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:border-neon-cyan/60 focus:outline-none focus:shadow-[0_0_25px_rgba(0,240,255,0.1)] transition-all duration-300 font-mono text-sm"
          />
          {videoId ? (
            <p className="mt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> video detected · id {videoId}
            </p>
          ) : url ? (
            <p className="mt-2 text-[11px] font-mono text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> couldn't read a video id from that link
            </p>
          ) : null}
        </div>

        {thumbs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {thumbs.map((t) => (
              <div key={t.key} className="glass rounded-xl overflow-hidden border-white/10 group">
                <div className="relative aspect-video bg-base-900">
                  <img
                    src={t.src}
                    alt={`${t.label} thumbnail`}
                    loading="lazy"
                    onError={() => setFailed((f) => ({ ...f, [t.key]: true }))}
                    className={`w-full h-full object-cover ${failed[t.key] ? 'opacity-20' : 'opacity-90'}`}
                  />
                  {failed[t.key] && (
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-mono text-white/50">
                      not generated for this video
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Image className="w-3.5 h-3.5 text-neon-cyan" /> {t.label}
                    </p>
                    <p className="text-[10px] font-mono text-white/40">{t.w}×{t.h}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => copy(t.src)}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-colors"
                    >
                      Copy URL
                    </button>
                    <a
                      href={t.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-white/60 bg-white/[0.04] border border-white/10 hover:text-white hover:border-white/30 transition-colors"
                      aria-label={`Open ${t.label} thumbnail`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          {videoId && (
            <button
              onClick={() => copy(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)}
              className="text-[11px] font-mono text-white/50 hover:text-neon-cyan transition-colors"
            >
              Tip: use maxresdefault for crisp 1280×720 covers · copy again then post
            </button>
          )}
        </motion.div>
      </div>
    </UtilityModal>
  )
}