// Color engine for difficulty-driven visual intensity.
//
// Every accent starts from the stage's base color. As a question gets
// harder (difficulty 0 → 1), the accent is smoothly deepened and its glow
// strengthened — light/subtle for easy, rich for hard — instead of snapping
// to unrelated colors.

const EASY_LIFT = 0.3 // easy → blend toward white (soft, airy but still readable)
const HARD_SINK = 0.34 // hard → blend toward deep slate (rich, defined)

export interface Tone {
  main: string // difficulty-tuned accent (hex)
  deep: string // darkest tuned variant
  ring: string // border / outline (rgba)
  tint: string // soft tinted fill (rgba)
  tintStrong: string // stronger tinted fill / seeds (rgba)
  glow: string // ambient glow (rgba)
  shadow: string // drop shadow for picked/hover states (rgba)
  soft: string // soft text / decorative stroke (rgba)
}

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

function parse(hex: string): [number, number, number] {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = parse(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Linear mix between two hex colors, t = 0 → a, t = 1 → b.
export function mix(a: string, b: string, t: number): string {
  const A = parse(a)
  const B = parse(b)
  const k = clamp(t)
  const ch = (i: number) =>
    Math.round(A[i] + (B[i] - A[i]) * k)
      .toString(16)
      .padStart(2, '0')
  return `#${ch(0)}${ch(1)}${ch(2)}`
}

export function toneFor(accent: string, difficulty: number): Tone {
  const d = clamp(difficulty)
  const light = mix(accent, '#ffffff', EASY_LIFT)
  const dark = mix(accent, '#0f172a', HARD_SINK)
  const main = mix(light, dark, d)
  const deep = mix(accent, '#0f172a', HARD_SINK + 0.14)
  return {
    main,
    deep,
    ring: rgba(main, 0.2 + 0.1 * d),
    tint: rgba(main, 0.08 + 0.05 * d),
    tintStrong: rgba(main, 0.13 + 0.06 * d),
    glow: rgba(main, 0.13 + 0.12 * d),
    shadow: rgba(main, 0.32 + 0.32 * d),
    soft: rgba(main, 0.55 + 0.1 * d),
  }
}