import answerSelectUrl from '../assets/sounds/answer-select.mp3'
import backgroundCalmUrl from '../assets/sounds/background-calm.mp3'
import uiClick from '../assets/sounds/ui-click.mp3'
import uiBack from '../assets/sounds/ui-back.mp3'
import uiNext from '../assets/sounds/ui-next.mp3'
import uiSelect from '../assets/sounds/ui-select.mp3'
import { triggerHaptic } from './haptics'

export type UiSoundName = 'click' | 'back' | 'next' | 'select'

const SOUND_KEY = 'quizlab.sound.enabled'
const MUSIC_KEY = 'quizlab.music.enabled'

const ANSWER_VOLUME = 0.18
const UI_VOLUME = 0.22
const MUSIC_VOLUME = 0.1

function readFlag(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : v === '1'
  } catch {
    return fallback
  }
}

function writeFlag(key: string, on: boolean) {
  try {
    localStorage.setItem(key, on ? '1' : '0')
  } catch {
    /* private mode */
  }
}

// --- persisted toggles (sound + music) -------------------------------------
let soundEnabled = readFlag(SOUND_KEY, true)
let musicEnabled = readFlag(MUSIC_KEY, true)
const subscribers = new Set<() => void>()
let snapshot = { soundEnabled, musicEnabled }

function emit() {
  snapshot = { soundEnabled, musicEnabled }
  subscribers.forEach((fn) => fn())
}

export function subscribeAudio(fn: () => void) {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}

export function getAudioSnapshot() {
  return snapshot
}

export function isSoundEnabled() {
  return soundEnabled
}

/** Restore the default audio state (used after an account delete). */
export function resetAudio() {
  soundEnabled = true
  musicEnabled = true
  stopBackgroundMusic()
  emit()
}

export function isMusicEnabled() {
  return musicEnabled
}

export function setSoundEnabled(on: boolean) {
  soundEnabled = on
  writeFlag(SOUND_KEY, on)
  if (!on && activeSfx && !activeSfx.paused) {
    activeSfx.pause()
    activeSfx.currentTime = 0
  }
  emit()
}

export function setMusicEnabled(on: boolean) {
  musicEnabled = on
  writeFlag(MUSIC_KEY, on)
  if (on) startBackgroundMusic()
  else stopBackgroundMusic()
  emit()
}

// --- short SFX (answer + UI), one active instance, never stacked ----------
const uiCache = new Map<UiSoundName, HTMLAudioElement>()
let activeSfx: HTMLAudioElement | null = null

function playSfx(el: HTMLAudioElement, volume: number) {
  try {
    if (activeSfx && !activeSfx.paused) {
      activeSfx.pause()
      activeSfx.currentTime = 0
    }
    activeSfx = el
    el.volume = volume
    el.currentTime = 0
    void el.play().catch(() => {})
  } catch {
    /* audio is best-effort — never break the quiz flow */
  }
}

let answerEl: HTMLAudioElement | null = null

// Plays the single global answer-select sound and a light vibration. There is
// intentionally one answer sound for the whole quiz (no per-option variants).
export function playAnswerSound() {
  triggerHaptic()
  if (!soundEnabled) return
  try {
    if (!answerEl) {
      answerEl = new Audio(answerSelectUrl)
      answerEl.preload = 'auto'
    }
    playSfx(answerEl, ANSWER_VOLUME)
  } catch {
    /* ignore */
  }
}

function playUiSoundKind(kind: UiSoundName) {
  if (!soundEnabled) return
  try {
    let el = uiCache.get(kind)
    if (!el) {
      el = new Audio(UI_SOUNDS[kind])
      el.preload = 'auto'
      uiCache.set(kind, el)
    }
    playSfx(el, UI_VOLUME)
  } catch {
    /* ignore */
  }
}

export function playUiSound(kind: UiSoundName) {
  playUiSoundKind(kind)
}

const UI_SOUNDS: Record<UiSoundName, string> = {
  click: uiClick,
  back: uiBack,
  next: uiNext,
  select: uiSelect,
}

// --- background music: one instance, seamless loop, soft fades ------------
let bgEl: HTMLAudioElement | null = null
let bgPlaying = false
let fadeRaf = 0

function ensureBg(): HTMLAudioElement | null {
  try {
    if (!bgEl) {
      bgEl = new Audio(backgroundCalmUrl)
      bgEl.loop = true
      bgEl.preload = 'auto'
      bgEl.volume = 0
    }
    return bgEl
  } catch {
    return null
  }
}

function fadeTo(el: HTMLAudioElement, target: number, duration: number) {
  cancelAnimationFrame(fadeRaf)
  const from = el.volume
  const t0 = performance.now()
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / duration)
    el.volume = Math.min(1, Math.max(0, from + (target - from) * p))
    if (p < 1) fadeRaf = requestAnimationFrame(step)
  }
  fadeRaf = requestAnimationFrame(step)
}

// Starts (or resumes) the loop. Idempotent: never reloads or restarts a
// track that is already playing — question/stage/result changes are safe.
export function startBackgroundMusic() {
  unlockable()
  if (!musicEnabled) return
  const el = ensureBg()
  if (!el) return
  if (bgPlaying && !el.paused) {
    fadeTo(el, MUSIC_VOLUME, 350)
    return
  }
  bgPlaying = true
  void el
    .play()
    .then(() => {
      fadeTo(el, MUSIC_VOLUME, 600)
    })
    .catch(() => {
      bgPlaying = false
      // Autoplay policy blocked playback — the first user gesture retries.
    })
}

export function stopBackgroundMusic() {
  const el = bgEl
  if (!el) return
  bgPlaying = false
  cancelAnimationFrame(fadeRaf)
  if (el.paused) return
  const from = el.volume
  const t0 = performance.now()
  const D = 380
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / D)
    el.volume = Math.max(0, from * (1 - p))
    if (p < 1) {
      fadeRaf = requestAnimationFrame(step)
    } else {
      el.pause()
    }
  }
  if (from > 0.001) {
    fadeRaf = requestAnimationFrame(step)
  } else {
    el.pause()
  }
}

// --- autoplay unlock --------------------------------------------------------
let unlockPending = false

// Music needs a user gesture before it is allowed to play. Arm a one-shot
// retry: the very first interaction after a blocked play() resumes the loop.
function unlockable() {
  if (unlockPending || typeof window === 'undefined') return
  unlockPending = true
  const unlock = () => {
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
    window.removeEventListener('touchstart', unlock)
    if (musicEnabled && bgEl && bgEl.paused) {
      bgPlaying = true
      void bgEl
        .play()
        .then(() => {
          fadeTo(bgEl!, MUSIC_VOLUME, 600)
        })
        .catch(() => {
          bgPlaying = false
        })
    }
  }
  window.addEventListener('pointerdown', unlock, { passive: true })
  window.addEventListener('keydown', unlock, { passive: true })
  window.addEventListener('touchstart', unlock, { passive: true })
}