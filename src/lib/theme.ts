// Centralized theme/color engine.
//
// Generates the full accent token family from a single user-chosen hex color
// and applies it as CSS custom properties. Light/dark share the same token
// names so every component uses one accent family — no scattered hardcoded
// accents.

import { mix, rgba } from './tone'

export type ThemeMode = 'light' | 'dark'

export interface PaletteOption {
  hex: string
  name: string
}

// Curated, muted product palette — premium, never neon.
export const ACCENT_PALETTE: PaletteOption[] = [
  { hex: '#3B7BEC', name: 'Blue' },
  { hex: '#7C6BF0', name: 'Violet' },
  { hex: '#17A398', name: 'Teal' },
  { hex: '#E8904E', name: 'Orange' },
  { hex: '#E0577E', name: 'Rose' },
]

// Roadmap stage identity → CSS stage token (muted, harmonious across themes).
const STAGE_COLOR: Record<string, string> = {
  BOSHLASH: 'violet',
  QIZIQISHLAR: 'blue',
  FAOLIYATLAR: 'teal',
  'ISH USLUBI': 'green',
  'ISH MUHITI': 'orange',
  NATIJA: 'rose',
}

export function stageVar(key: string): string {
  const name = STAGE_COLOR[key]
  return name ? `var(--stage-${name})` : 'var(--accent)'
}

export function luminance(hex: string): number {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  const lin = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(lin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function applyTheme(theme: ThemeMode, accent: string): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.dataset.theme = theme
  // Slightly lift the accent in dark mode so it stays vivid on dark surfaces.
  const base = theme === 'dark' ? mix(accent, '#ffffff', 0.16) : accent
  const dark = mix(accent, '#0b1220', 0.34)
  const light = mix(accent, '#ffffff', 0.3)
  const contrast = luminance(base) > 0.52 ? '#101828' : '#ffffff'
  const tokens: Record<string, string> = {
    '--accent': base,
    '--accent-light': light,
    '--accent-dark': dark,
    '--accent-contrast': contrast,
    '--accent-soft': rgba(base, 0.14),
    '--accent-tint': rgba(base, 0.08),
    '--accent-ring': rgba(base, 0.26),
    '--accent-glow': rgba(base, 0.32),
    '--accent-shadow': rgba(base, 0.45),
  }
  for (const [k, v] of Object.entries(tokens)) root.style.setProperty(k, v)
}