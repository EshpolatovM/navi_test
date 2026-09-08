import { useEffect, useRef, useState } from 'react'

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function getReduced(): boolean {
  if (typeof window === 'undefined') return false
  if (!window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function gyroCapable(): boolean {
  if (typeof window === 'undefined') return false
  if (!('DeviceOrientationEvent' in window)) return false
  const mq = (q: string) => (window.matchMedia ? window.matchMedia(q).matches : false)
  return mq('(pointer: coarse)') && mq('(max-width: 1023px)') && !mq('(prefers-reduced-motion: reduce)')
}

// Force needed for a "fast shake" (~1.4g sustained over a couple of readings).
const SHAKE_THRESHOLD = 14
const SHAKE_STREAK = 2
const SHAKE_COOLDOWN = 1500

function accelMag(e: DeviceMotionEvent): number {
  const a = e.acceleration
  if (a && a.x !== null && a.y !== null && a.z !== null) {
    return Math.hypot(a.x, a.y, a.z)
  }
  const g = e.accelerationIncludingGravity
  if (g && g.x !== null && g.y !== null && g.z !== null) {
    return Math.abs(Math.hypot(g.x, g.y, g.z) - 9.81)
  }
  return 0
}

/**
 * ONE global motion controller for the whole QuizLab scene.
 *
 * Pointer (desktop) and gyro (mobile) feed the SAME smoothed state, which is
 * published to root CSS variables every frame:
 *   --mx / --my     normalized parallel input (-1..1)      → horizontal pan
 *   --rotx / --roty degrees (±3) from the same input       → subtle depth tilt
 *   --gy-x / --gy-y legacy aliases consumed by QuestionScene
 *
 * Every visual element reads these variables with its own depth factor via
 * the .motion-* classes, so the whole scene reacts as one physical surface.
 * Values are lerped (damped), clamped and written on translate3d-friendly
 * custom properties only — top/left/width/height are never touched.
 */
export function useGyroParallax() {
  const [active, setActive] = useState(false)
  const st = useRef({
    raf: 0,
    last: 0,
    enabled: false,
    gyroEnabled: false,
    reduced: false,
    streak: 0,
    lastShake: 0,
    target: { x: 0, y: 0 },
    smooth: { x: 0, y: 0 },
  })

  const write = (x: number, y: number) => {
    const r = document.documentElement
    r.style.setProperty('--mx', String(x))
    r.style.setProperty('--my', String(y))
    r.style.setProperty('--rotx', String(x * 3))
    r.style.setProperty('--roty', String(y * 3))
    r.style.setProperty('--gy-x', String(x))
    r.style.setProperty('--gy-y', String(y))
  }

  const tick = (now: number) => {
    const s = st.current
    const dt = now - s.last > 0 ? now - s.last : 16.7
    s.last = now
    // Exponential damping — soft, smooth, never snaps to the raw sensor.
    const k = 1 - Math.exp(-dt / 110)
    const x = s.smooth.x + (s.target.x - s.smooth.x) * k
    const y = s.smooth.y + (s.target.y - s.smooth.y) * k
    s.smooth.x = x
    s.smooth.y = y
    write(x, y)
    const settled = Math.abs(s.target.x - x) < 0.002 && Math.abs(s.target.y - y) < 0.002
    s.raf = settled ? 0 : requestAnimationFrame(tick)
  }

  const ensureLoop = () => {
    const s = st.current
    if (s.raf) return
    s.last = performance.now()
    s.raf = requestAnimationFrame(tick)
  }

  const onPointer = (e: PointerEvent) => {
    const s = st.current
    if (s.reduced || s.gyroEnabled) return
    if (e.pointerType === 'touch' && s.gyroEnabled) return
    const w = window.innerWidth || 1
    const h = window.innerHeight || 1
    // Relative to viewport center, clamped to ±1 → cursor on an edge = max depth.
    s.target.x = clamp((e.clientX / w) * 2 - 1, -1, 1)
    s.target.y = clamp((e.clientY / h) * 2 - 1, -1, 1)
    ensureLoop()
  }

  const onLeave = () => {
    const s = st.current
    if (s.reduced) return
    s.target.x = 0
    s.target.y = 0
    ensureLoop()
  }

  const onOrient = (e: DeviceOrientationEvent) => {
    if (e.gamma === null || e.beta === null) return
    const x = clamp(e.gamma / 28, -1, 1)
    const y = clamp((e.beta - 90) / 24, -1, 1)
    st.current.target.x = Math.abs(x) < 0.02 ? 0 : x
    st.current.target.y = Math.abs(y) < 0.02 ? 0 : y
    ensureLoop()
  }

  // "To'kilib ketish": fast shake fires quiz:shake; options scatter and settle back.
  const onMotion = (e: DeviceMotionEvent) => {
    const s = st.current
    if (accelMag(e) < SHAKE_THRESHOLD) {
      s.streak = 0
      return
    }
    s.streak++
    if (s.streak >= SHAKE_STREAK && performance.now() - s.lastShake > SHAKE_COOLDOWN) {
      s.streak = 0
      s.lastShake = performance.now()
      window.dispatchEvent(new CustomEvent('quiz:shake'))
    }
  }

  const start = () => {
    const s = st.current
    if (s.enabled) return
    s.enabled = true
    s.gyroEnabled = true
    write(0, 0)
    window.addEventListener('deviceorientation', onOrient)
    window.addEventListener('devicemotion', onMotion)
    ensureLoop()
    setActive(true)
  }

  const stop = () => {
    const s = st.current
    s.enabled = false
    s.gyroEnabled = false
    window.removeEventListener('deviceorientation', onOrient)
    window.removeEventListener('devicemotion', onMotion)
    if (s.raf) cancelAnimationFrame(s.raf)
    s.raf = 0
    s.smooth = { x: 0, y: 0 }
    s.target = { x: 0, y: 0 }
    write(0, 0)
    setActive(false)
  }

  useEffect(() => {
    const s = st.current
    s.reduced = getReduced()
    if (s.reduced) return () => {}
    // Desktop / fallback: subtle pointer parallax drives the same state.
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointercancel', onLeave)
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onLeave)

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onPref = () => {
      s.reduced = mql.matches
      if (s.reduced) {
        s.smooth = { x: 0, y: 0 }
        s.target = { x: 0, y: 0 }
        write(0, 0)
        if (s.raf) cancelAnimationFrame(s.raf)
        s.raf = 0
        if (s.enabled) stop()
      }
    }
    mql.addEventListener('change', onPref)

    const onRe = () => {
      if (!gyroCapable() && s.enabled) stop()
    }
    window.addEventListener('resize', onRe)
    return () => {
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointercancel', onLeave)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onLeave)
      mql.removeEventListener('change', onPref)
      window.removeEventListener('resize', onRe)
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const enable = async (): Promise<boolean> => {
    if (st.current.enabled) return true
    if (!gyroCapable()) return false
    const DOE = window.DeviceOrientationEvent as typeof window.DeviceOrientationEvent & {
      requestPermission?: () => Promise<string>
    }
    const DME = window.DeviceMotionEvent as typeof window.DeviceMotionEvent & {
      requestPermission?: () => Promise<string>
    }
    for (const api of [DOE, DME]) {
      if (typeof api?.requestPermission !== 'function') continue
      let perm: string
      try {
        perm = await api.requestPermission()
      } catch {
        return false
      }
      if (perm !== 'granted') return false
    }
    start()
    return true
  }

  return { active, enable }
}