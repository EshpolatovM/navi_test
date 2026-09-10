// Light mobile haptics — one short, gentle tap per answer (15 ms).
// Best-effort: unsupported browsers and desktop are silently ignored.

const HAPTICS_KEY = 'quizlab.haptics.enabled'

function readFlag(fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(HAPTICS_KEY)
    return v === null ? fallback : v === '1'
  } catch {
    return fallback
  }
}

function writeFlag(on: boolean) {
  try {
    localStorage.setItem(HAPTICS_KEY, on ? '1' : '0')
  } catch {
    /* private mode */
  }
}

let hapticsEnabled = readFlag(true)

const subscribers = new Set<() => void>()
let snapshot = { hapticsEnabled }

function emit() {
  snapshot = { hapticsEnabled }
  subscribers.forEach((fn) => fn())
}

export function subscribeHaptics(fn: () => void) {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}

export function getHapticsSnapshot() {
  return snapshot
}

export function isHapticsEnabled() {
  return hapticsEnabled
}

/** Restore the default haptics state (used after an account delete). */
export function resetHaptics() {
  hapticsEnabled = true
  emit()
}

export function setHapticsEnabled(on: boolean) {
  hapticsEnabled = on
  writeFlag(on)
  emit()
}

function isTouchDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  return navigator.maxTouchPoints > 0 || 'ontouchstart' in window || window.matchMedia?.('(pointer: coarse)').matches === true
}

// Triggers a single soft vibration. Only on touch-capable devices, only when
// the Vibratsiya setting is ON, and never throws.
export function triggerHaptic() {
  if (!hapticsEnabled) return
  if (!isTouchDevice()) return
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(15)
    }
  } catch {
    /* browser blocked the API — ignore */
  }
}