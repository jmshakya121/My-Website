import { useEffect, useRef, useState } from 'react'

/* Typewriter that cycles a list of phrases.
 *
 * The whole effect is driven by a single `setTimeout` chain rather than
 * `setInterval`. An interval cannot vary its delay, so you either type fast and
 * the delete looks instant, or type slow and the caret looks broken. Deleting
 * faster than typing is what makes it read as a loop instead of a hitch.
 *
 * The timer is also paused when the tab is hidden — otherwise a phone left in
 * the background burns a wakeup every character and finishes all rotations
 * before the user ever looks at it. */
export default function useTypewriter(
  words,
  { typeMs = 85, deleteMs = 42, holdMs = 1700, enabled = true } = {}
) {
  const [text, setText] = useState('')
  // Kept in refs so changing `words` at runtime never restarts the loop.
  const index = useRef(0)
  const char = useRef(0)
  const deleting = useRef(false)
  const timer = useRef(null)
  const wordsRef = useRef(words)
  wordsRef.current = words

  useEffect(() => {
    if (!enabled) {
      setText('')
      return undefined
    }
    // Respect reduced motion: show a rotating word, but no per-character typing.
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      let i = 0
      const swap = () => {
        i = (i + 1) % wordsRef.current.length
        setText(wordsRef.current[i])
        timer.current = setTimeout(swap, 3200)
      }
      setText(wordsRef.current[0])
      timer.current = setTimeout(swap, 3200)
      return () => clearTimeout(timer.current)
    }

    const tick = () => {
      const list = wordsRef.current
      if (!list.length) return
      const word = list[index.current % list.length]

      if (!deleting.current) {
        char.current += 1
        if (char.current >= word.length) {
          deleting.current = true
          setText(word)
          timer.current = setTimeout(tick, holdMs)
          return
        }
      } else {
        char.current -= 1
        if (char.current <= 0) {
          deleting.current = false
          index.current += 1
          timer.current = setTimeout(tick, 320)
          return
        }
      }
      setText(word.slice(0, char.current))
      timer.current = setTimeout(tick, deleting.current ? deleteMs : typeMs)
    }

    timer.current = setTimeout(tick, 500)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(timer.current)
        timer.current = setTimeout(tick, 120)
      } else {
        clearTimeout(timer.current)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearTimeout(timer.current)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [typeMs, deleteMs, holdMs, enabled])

  return text
}
