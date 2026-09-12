import { jsPDF } from 'jspdf'
import type { Lang } from './i18n'
import type { ResultData, DirectionScore } from '../components/result/useResultData'
import { getIconDataUrl, getNaviLogoDataUrl } from './naviVisuals'
import type { RoadmapBlock, RoadmapStep } from './roadmap'

import manropeRegular from '../assets/fonts/Manrope-Regular.ttf?url'
import manropeBold from '../assets/fonts/Manrope-Bold.ttf?url'

export const RESULT_PDF_FILENAME = 'QuizLab-Natijam.pdf'
export const ROADMAP_PDF_FILENAME = 'QuizLab-Shaxsiy-Yol-Xaritasi.pdf'

export type PdfTranslate = (key: string, vars?: Record<string, string | number>) => string

const PAGE = { w: 210, h: 297 }
const M = { l: 16, r: 16, t: 18, b: 22 }
const CW = PAGE.w - M.l - M.r

export const PDF_COLORS = {
  bg: '#FFFFFF',
  surface: '#F1F5F9',
  soft: '#F8FAFC',
  border: '#E2E8F0',
  text: '#0F172A',
  muted: '#64748B',
  lightAccent: '#DBEAFE',
  accent: '#3B7BEC',
} as const

const RIASEC = {
  order: ['R', 'I', 'A', 'S', 'E', 'C'] as const,
  colors: { R: '#64748B', I: '#3B7BEC', A: '#DB2777', S: '#10B981', E: '#F59E0B', C: '#2563EB' },
}

const VALUE_COLORS: Record<string, string> = {
  independence: '#6366F1',
  creativity: '#DB2777',
  helping: '#10B981',
  stability: '#64748B',
  growth: '#F59E0B',
  teamwork: '#2563EB',
  opportunity: '#EA580C',
}

function hexRgb(hex: string): [number, number, number] {
  if (typeof hex !== 'string' || !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
    return [15, 23, 42]
  }
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...Array.from(bytes.subarray(i, i + 0x8000)))
  }
  return btoa(bin)
}

let fontsLoaded = false

async function loadFonts(doc: jsPDF): Promise<void> {
  if (fontsLoaded) return
  const [reg, bold] = await Promise.all([
    fetch(manropeRegular).then((r) => r.arrayBuffer()),
    fetch(manropeBold).then((r) => r.arrayBuffer()),
  ])
  doc.addFileToVFS('Manrope.ttf', toBase64(reg))
  doc.addFileToVFS('ManropeB.ttf', toBase64(bold))
  doc.addFont('Manrope.ttf', 'Manrope', 'normal')
  doc.addFont('ManropeB.ttf', 'ManropeB', 'bold')
  fontsLoaded = true
}

/** Parses `**bold**` markers into mixed-styled segments (marks are stripped). */
function parseRich(line: string): Array<{ text: string; bold: boolean }> {
  const out: Array<{ text: string; bold: boolean }> = []
  const re = /\*\*([^*]+)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) out.push({ text: line.slice(last, m.index), bold: false })
    out.push({ text: m[1], bold: true })
    last = m.index + m[0].length
  }
  if (last < line.length) out.push({ text: line.slice(last), bold: false })
  return out
}

export class Report {
  doc: jsPDF
  y: number
  page: number

  constructor() {
    this.doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
    this.doc.setFillColor(...hexRgb(PDF_COLORS.bg))
    this.doc.rect(0, 0, PAGE.w, PAGE.h, 'F')
    this.y = M.t
    this.page = 1
  }

  async ready(): Promise<void> {
    await loadFonts(this.doc)
  }

  newPage(): void {
    this.doc.addPage()
    this.page++
    this.doc.setFillColor(...hexRgb(PDF_COLORS.bg))
    this.doc.rect(0, 0, PAGE.w, PAGE.h, 'F')
    this.y = M.t
  }

  ensure(h: number): void {
    if (this.y + h > PAGE.h - M.b) this.newPage()
  }

  font(bold: boolean, size: number): void {
    this.doc.setFont(bold ? 'ManropeB' : 'Manrope', bold ? 'bold' : 'normal')
    this.doc.setFontSize(size)
  }

  textColor(hex: string): void {
    this.doc.setTextColor(...hexRgb(hex))
  }

  fill(hex: string): void {
    this.doc.setFillColor(...hexRgb(hex))
  }

  strokeColor(hex: string): void {
    this.doc.setDrawColor(...hexRgb(hex))
  }

  text(s: string, x: number, y: number, align: 'left' | 'center' | 'right' = 'left'): void {
    this.doc.text(s, x, y, align === 'left' ? undefined : { align })
  }

  width(s: string): number {
    return this.doc.getTextWidth(s)
  }

  wrap(s: string, w: number): string[] {
    return this.doc.splitTextToSize(s, w) as string[]
  }

  card(x: number, y: number, w: number, h: number, color: string = PDF_COLORS.surface, r = 3.5): void {
    this.fill(color)
    this.doc.roundedRect(x, y, w, h, r, r, 'F')
  }

  bar(x: number, y: number, w: number, pct: number, color: string, track: string = PDF_COLORS.surface, h = 3): void {
    this.fill(track)
    this.doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F')
    const p = Math.max(0, Math.min(100, pct))
    if (p > 0.5) {
      this.fill(color)
      this.doc.roundedRect(x, y, (w * p) / 100, h, h / 2, h / 2, 'F')
    }
  }

  /** Draws every wrapped line (no truncation) inside a card built from the line count. */
  textBlock(cardW: number, text: string, opts: {
    bodyX: number
    bodyW: number
    lineH?: number
    size?: number
    color?: string
    padBottom?: number
  }): void {
    const lineH = opts.lineH ?? 3.4
    const size = opts.size ?? 8.5
    this.font(false, size)
    const lines = this.wrap(text, opts.bodyW)
    const cardH = lines.length * lineH + (opts.padBottom ?? 5) + 6
    this.ensure(cardH + 4)
    this.card(M.l, this.y, cardW, cardH)
    this.y += 4.5
    this.textColor(opts.color ?? PDF_COLORS.muted)
    this.font(false, size)
    for (const line of lines) {
      this.ensure(lineH + 2)
      this.text(line, opts.bodyX, this.y)
      this.y += lineH
    }
    this.y += opts.padBottom ?? 5
  }

  /** Word-wrapping flow that splits bold segments; breaks to a new page when needed. */
  richFlow(segments: Array<{ text: string; bold: boolean }>, x: number, w: number, lineH: number, size: number): void {
    let xCur = x
    let first = true
    for (const seg of segments) {
      const words = seg.text.split(/\s+/).filter((s) => s.length > 0)
      if (words.length === 0) continue
      for (const word of words) {
        this.font(seg.bold, size)
        const prefix = first ? '' : ' '
        const wd = this.width(prefix + word)
        if (xCur + wd > x + w) {
          xCur = x
          this.y += lineH
          this.ensure(lineH)
          this.font(seg.bold, size)
          const wd2 = this.width(word)
          this.doc.text(word, xCur, this.y)
          xCur += wd2
        } else {
          this.font(seg.bold, size)
          this.doc.text(prefix + word, xCur, this.y)
          xCur += wd
        }
        first = false
      }
    }
  }

  sectionHeader(num: string, label: string): void {
    this.ensure(24)
    this.fill(PDF_COLORS.accent)
    this.doc.roundedRect(M.l, this.y, 10, 10, 3, 3, 'F')
    this.textColor('#FFFFFF')
    this.font(true, 7.5)
    this.text(num, M.l + 5, this.y + 6.8, 'center')
    this.textColor(PDF_COLORS.text)
    this.font(true, 13)
    this.text(label, M.l + 16, this.y + 8)
    // tiny brand mark on the right of the section row
    this.textColor(PDF_COLORS.border)
    this.font(true, 6.5)
    this.text('QuizLab', M.l + CW, this.y + 4.5, 'right')
    this.textColor(PDF_COLORS.border)
    this.doc.setLineWidth(0.5)
    this.doc.line(M.l, this.y + 14.5, M.l + CW, this.y + 14.5)
    this.y += 21
  }

  chip(text: string, x: number, labelColor: string = PDF_COLORS.muted, border: string = PDF_COLORS.border, padX = 5, size = 8): number {
    this.font(false, size)
    const w = this.width(text) + padX * 2
    this.strokeColor(border)
    this.doc.setLineWidth(0.4)
    this.doc.roundedRect(x, this.y - 3.4, w, 6.6, 3.3, 3.3, 'S')
    this.textColor(labelColor)
    this.text(text, x + padX, this.y + 0.7)
    return w
  }

  footer(total: number): void {
    for (let i = 1; i <= total; i++) {
      this.doc.setPage(i)
      this.font(false, 7)
      this.textColor(PDF_COLORS.muted)
      this.doc.text('QuizLab \u00b7 Shaxsiy natija hisoboti', M.l, PAGE.h - 9)
      this.doc.text(`${i} / ${total}`, PAGE.w - M.r, PAGE.h - 9, { align: 'right' })
    }
  }
}

function testTypeLabel(data: ResultData, t: PdfTranslate): string {
  const hasCareer = data.sources.includes('career')
  const hasInterest = data.sources.includes('interest')
  if (hasCareer && hasInterest) return t('pdf.testTypeCombined')
  if (hasCareer) return t('pdf.testTypeCareer')
  return t('pdf.testTypeInterest')
}

function formatDate(lang: Lang): string {
  return new Date().toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

async function preloadIcons(data: ResultData): Promise<Map<string, string | null>> {
  const names = Array.from(
    new Set([...data.directionScores.map((d) => d.icon), ...data.allCareers.map((c) => c.icon)]),
  )
  const map = new Map<string, string | null>()
  await Promise.all(
    names.map(async (n) => {
      map.set(n, await getIconDataUrl(n, 64))
    }),
  )
  return map
}

/* ------------------------------------------------------------------ */
/* Result PDF                                                          */
/* ------------------------------------------------------------------ */

async function drawCover(rep: Report, data: ResultData, lang: Lang, t: PdfTranslate): Promise<void> {
  rep.font(true, 10)
  rep.textColor(PDF_COLORS.accent)
  rep.text('QUIZLAB', PAGE.w / 2, 22, 'center')

  const logo = await getNaviLogoDataUrl(620)
  rep.doc.addImage(logo, 'PNG', PAGE.w / 2 - 34, 26, 68, 14.88)

  rep.y = 68
  rep.textColor(PDF_COLORS.text)
  rep.font(true, 24)
  const titleLines = rep.wrap(t('result.hero.title'), CW - 10)
  for (const line of titleLines.slice(0, 2)) {
    rep.doc.text(line, PAGE.w / 2, rep.y, { align: 'center' })
    rep.y += 8
  }

  rep.textColor(PDF_COLORS.muted)
  rep.font(false, 10)
  const subLines = rep.wrap(t('result.hero.subtitle'), CW - 24)
  for (const line of subLines.slice(0, 2)) {
    rep.doc.text(line, PAGE.w / 2, rep.y, { align: 'center' })
    rep.y += 5.2
  }

  rep.y += 4
  const typeLabel = `${t('pdf.testType')} ${testTypeLabel(data, t)}`
  const typeW = rep.chip(typeLabel, PAGE.w / 2 - rep.width(typeLabel) / 2 - 5, PDF_COLORS.muted)
  void typeW
  const dateLabel = `${t('pdf.generatedOn')} ${formatDate(lang)}`
  const dateW = rep.width(dateLabel)
  rep.y += 8.5
  rep.chip(dateLabel, PAGE.w / 2 - dateW / 2 - 5, PDF_COLORS.muted)
  rep.y += 9

  // Short summary strip — the "qisqa summary" from the interest/character/values summaries.
  const summaries: Array<{ label: string; value: string; color: string }> = [
    { label: t('result.summary.interests'), value: data.summaryInterest, color: '#6366F1' },
    { label: t('result.summary.character'), value: data.summaryCharacter, color: '#F59E0B' },
    { label: t('result.summary.values'), value: data.summaryValues, color: '#10B981' },
  ]
  rep.ensure(42)
  rep.textColor(PDF_COLORS.accent)
  rep.font(true, 8.5)
  rep.text(t('result.summary.title').toUpperCase(), M.l + 2, rep.y + 2)
  rep.y += 5.5
  for (const s of summaries) {
    const valueLines = rep.wrap(s.value, CW / 3 - 12)
    rep.ensure(valueLines.length * 3 + 8)
    rep.textColor(s.color)
    rep.font(true, 7)
    rep.text(s.label.toUpperCase(), M.l + 2, rep.y + 2)
    rep.textColor(PDF_COLORS.text)
    rep.font(false, 8)
    for (const line of valueLines.slice(0, 3)) {
      rep.text(line, M.l + 2, rep.y + 5)
      rep.y += 2.9
    }
    rep.y += 4
    rep.textColor(PDF_COLORS.border)
    rep.doc.setLineWidth(0.3)
    rep.doc.line(M.l, rep.y + 1, M.l + CW, rep.y + 1)
  }

  rep.ensure(14)
  rep.textColor(PDF_COLORS.muted)
  rep.font(false, 11)
  rep.text('#kasbimniTopdim', PAGE.w / 2, PAGE.h - 26, 'center')
}

function drawInterests(rep: Report, data: ResultData, t: PdfTranslate, icons: Map<string, string | null>, num: string): void {
  rep.newPage()
  rep.sectionHeader(num, t('pdf.directions'))

  data.directionScores.forEach((dir, i) => {
    drawDirectionRow(rep, dir, icons.get(dir.icon) ?? null, i + 1, t)
  })
}

function drawDirectionRow(rep: Report, dir: DirectionScore, iconUrl: string | null, rank: number, t: PdfTranslate): void {
  const explLines = rep.wrap(dir.explanation, CW - 38)
  const lineH = 3.3
  const rowH = 16 + explLines.length * lineH + 6
  rep.ensure(rowH + 4)
  rep.card(M.l, rep.y, CW, rowH)
  rep.y += 5

  if (iconUrl) {
    rep.doc.addImage(iconUrl, 'PNG', M.l + 4.5, rep.y - 2, 9, 9)
  } else {
    rep.fill(PDF_COLORS.accent)
    rep.doc.roundedRect(M.l + 4.5, rep.y - 2, 9, 9, 2.4, 2.4, 'F')
  }

  rep.textColor(PDF_COLORS.text)
  rep.font(true, 10.5)
  rep.text(t(dir.nameKey), M.l + 17, rep.y + 1)
  rep.textColor(PDF_COLORS.accent)
  rep.font(true, 9)
  rep.text(`${rank}.`, M.l + CW - 16, rep.y + 1, 'right')
  rep.font(true, 9.5)
  rep.text(`${Math.round(dir.score)}%`, M.l + CW - 5, rep.y + 1, 'right')

  rep.bar(M.l + 17, rep.y + 4, CW - 39, dir.score, PDF_COLORS.accent, '#E2E8F0', 2.4)
  rep.y += 7.5

  rep.textColor(PDF_COLORS.muted)
  rep.font(false, 8)
  for (const line of explLines) {
    rep.ensure(lineH + 2)
    rep.text(line, M.l + 17, rep.y)
    rep.y += lineH
  }
  rep.y += 3
}

function drawRiasec(rep: Report, data: ResultData, t: PdfTranslate, num: string): void {
  rep.newPage()
  rep.sectionHeader(num, t('pdf.riasec'))

  RIASEC.order.forEach((letter, i) => {
    const score = data.riasecScores[i] ?? 0
    const color = RIASEC.colors[letter]
    const dominant = data.archetype.dominant === i
    rep.ensure(20)
    rep.card(M.l, rep.y, CW, 16)
    rep.y += 4
    rep.fill(color)
    rep.doc.roundedRect(M.l + 4, rep.y - 3, 8, 8, 2.2, 2.2, 'F')
    rep.textColor('#FFFFFF')
    rep.font(true, 8)
    rep.text(letter, M.l + 8, rep.y + 1.4, 'center')

    rep.textColor(PDF_COLORS.text)
    rep.font(true, 9.5)
    rep.text(t(`dim.${letter}.short`), M.l + 16, rep.y + 0.6)
    const shortW = rep.width(t(`dim.${letter}.short`))
    rep.textColor(PDF_COLORS.muted)
    rep.font(false, 7.3)
    rep.text(t(`dim.${letter}.name`), M.l + 16 + shortW + 6, rep.y + 0.6)

    rep.textColor(color)
    rep.font(true, 8.5)
    rep.text(`${Math.round(score)}%`, M.l + CW - 5, rep.y + 0.6, 'right')
    if (dominant) {
      const tag = ` ${t('pdf.dominant')} `
      rep.font(false, 6.8)
      rep.strokeColor(color)
      rep.doc.setLineWidth(0.4)
      const tw = rep.width(tag)
      rep.doc.roundedRect(M.l + CW - 5 - tw - 5, rep.y - 2.8, tw + 4, 6, 3, 3, 'S')
      rep.textColor(color)
      rep.text(tag, M.l + CW - 5 - tw - 3, rep.y + 0.9, 'right')
    }

    rep.bar(M.l + 16, rep.y + 4.2, CW - 32, score, color, '#E2E8F0', 2.4)
    rep.y += 12
  })
}

function drawCharacter(rep: Report, data: ResultData, t: PdfTranslate, num: string): void {
  rep.newPage()
  rep.sectionHeader(num, t('pdf.character'))

  for (const trait of data.characterTraits) {
    const desc = rep.wrap(trait.description, CW - 38)
    const lineH = 3.2
    const rowH = 14 + desc.length * lineH + 5
    rep.ensure(rowH + 4)
    rep.card(M.l, rep.y, CW, rowH)
    rep.y += 4
    rep.fill(PDF_COLORS.accent)
    rep.doc.roundedRect(M.l + 4.5, rep.y - 2, 9, 9, 2.4, 2.4, 'F')
    rep.textColor('#FFFFFF')
    rep.font(true, 6.5)
    rep.text(trait.nameKey.replace(/^trait\./, '').slice(0, 1).toUpperCase(), M.l + 9, rep.y + 1.6, 'center')

    rep.textColor(PDF_COLORS.text)
    rep.font(true, 9.5)
    rep.text(t(trait.nameKey), M.l + 17, rep.y + 0.6)
    rep.textColor(PDF_COLORS.accent)
    rep.font(true, 8.5)
    rep.text(`${Math.round(trait.score)}%`, M.l + CW - 5, rep.y + 0.6, 'right')
    rep.bar(M.l + 17, rep.y + 4, CW - 38, trait.score, PDF_COLORS.accent, '#E2E8F0', 2.2)
    rep.y += 7.5

    rep.textColor(PDF_COLORS.muted)
    rep.font(false, 7.6)
    for (const line of desc) {
      rep.ensure(lineH + 2)
      rep.text(line, M.l + 17, rep.y)
      rep.y += lineH
    }
    rep.y += 3.5
  }
}

function drawValues(rep: Report, data: ResultData, t: PdfTranslate, num: string): void {
  rep.newPage()
  rep.sectionHeader(num, t('pdf.values'))
  const topScore = Math.max(0, ...data.values.map((v) => v.score))

  for (const val of data.values) {
    const desc = rep.wrap(val.description, CW - 38)
    const lineH = 3.2
    const rowH = 14 + desc.length * lineH + 5
    const color = VALUE_COLORS[val.id] ?? PDF_COLORS.accent
    const strongest = val.score === topScore && topScore > 0
    rep.ensure(rowH + 4)
    rep.card(M.l, rep.y, CW, rowH, strongest ? PDF_COLORS.soft : PDF_COLORS.surface)
    rep.strokeColor(strongest ? color : PDF_COLORS.border)
    rep.doc.setLineWidth(0.4)
    rep.doc.roundedRect(M.l, rep.y, CW, rowH, 3.5, 3.5, 'S')
    rep.y += 4
    rep.fill(color)
    rep.doc.roundedRect(M.l + 4.5, rep.y - 2, 9, 9, 2.4, 2.4, 'F')

    rep.textColor(PDF_COLORS.text)
    rep.font(true, 9.5)
    rep.text(t(val.nameKey), M.l + 17, rep.y + 0.6)
    rep.textColor(color)
    rep.font(true, 8.5)
    rep.text(`${Math.round(val.score)}%`, M.l + CW - 5, rep.y + 0.6, 'right')
    if (strongest) {
      const tag = ` ${t('pdf.strongestValue')} `
      rep.font(false, 6.8)
      const tw = rep.width(tag)
      rep.strokeColor(color)
      rep.doc.setLineWidth(0.4)
      rep.doc.roundedRect(M.l + CW - 5 - tw - 5, rep.y - 2.8, tw + 4, 6, 3, 3, 'S')
      rep.textColor(color)
      rep.text(tag, M.l + CW - 5 - tw - 3, rep.y + 0.9, 'right')
    }
    rep.bar(M.l + 17, rep.y + 4, CW - 38, val.score, color, '#E2E8F0', 2.2)
    rep.y += 7.5

    rep.textColor(PDF_COLORS.muted)
    rep.font(false, 7.6)
    for (const line of desc) {
      rep.ensure(lineH + 2)
      rep.text(line, M.l + 17, rep.y)
      rep.y += lineH
    }
    rep.y += 3.5
  }
}

function drawArchetype(rep: Report, data: ResultData, t: PdfTranslate, num: string): void {
  rep.newPage()
  rep.sectionHeader(num, t('pdf.archetype'))

  const subtitleLines = rep.wrap(t(data.archetype.subtitleKey), CW - 24)
  const heroH = 16 + Math.min(subtitleLines.length, 6) * 3.4 + 8
  rep.ensure(heroH + 4)
  rep.card(M.l, rep.y, CW, heroH)
  rep.y += 5
  rep.fill(PDF_COLORS.accent)
  rep.doc.roundedRect(M.l + 5, rep.y - 2, 4, 12, 2, 2, 'F')
  rep.textColor(PDF_COLORS.text)
  rep.font(true, 13.5)
  rep.text(t(data.archetype.titleKey), M.l + 14, rep.y + 1)
  rep.y += 5
  rep.textColor(PDF_COLORS.muted)
  rep.font(false, 8.5)
  for (const line of subtitleLines) {
    rep.ensure(3.4 + 2)
    rep.text(line, M.l + 14, rep.y)
    rep.y += 3.4
  }
  rep.y += 6

  const domLetter = RIASEC.order[data.archetype.dominant] ?? 'R'
  rep.ensure(16)
  rep.textColor(PDF_COLORS.text)
  rep.font(true, 9.5)
  rep.text(`${t('pdf.dominant').toUpperCase()}: `, M.l, rep.y + 2)
  const prefixW = rep.width(`${t('pdf.dominant').toUpperCase()}: `)
  rep.textColor(RIASEC.colors[domLetter])
  rep.text(t(`dim.${domLetter}.name`), M.l + prefixW, rep.y + 2)
  rep.y += 9

  RIASEC.order.forEach((letter, i) => {
    const score = data.riasecScores[i] ?? 0
    const color = RIASEC.colors[letter]
    rep.ensure(9)
    rep.fill(color)
    rep.doc.roundedRect(M.l, rep.y - 3, 7, 7, 2, 2, 'F')
    rep.textColor('#FFFFFF')
    rep.font(true, 7)
    rep.text(letter, M.l + 3.5, rep.y + 0.6, 'center')
    rep.textColor(PDF_COLORS.text)
    rep.font(true, 8)
    rep.text(`${Math.round(score)}%`, M.l + 11, rep.y + 0.4)
    rep.bar(M.l + 24, rep.y - 1, CW - 34, score, color, '#E2E8F0', 2)
    rep.y += 10
  })
}

function drawStrengths(rep: Report, data: ResultData, t: PdfTranslate, num: string): void {
  rep.newPage()
  rep.sectionHeader(num, t('pdf.strengths'))

  data.strengths.forEach((s, i) => {
    const desc = rep.wrap(s.description, CW - 38)
    const lineH = 3.2
    const rowH = 14 + desc.length * lineH + 5
    const color = i === 0 ? PDF_COLORS.accent : s.color
    rep.ensure(rowH + 4)
    rep.card(M.l, rep.y, CW, rowH)
    rep.y += 4
    rep.fill(color)
    rep.doc.roundedRect(M.l + 4.5, rep.y - 2, 9, 9, 2.4, 2.4, 'F')
    rep.textColor('#FFFFFF')
    rep.font(true, 7)
    rep.text(String(i + 1), M.l + 9, rep.y + 1.5, 'center')

    rep.textColor(PDF_COLORS.text)
    rep.font(true, 9.5)
    rep.text(t(s.nameKey), M.l + 17, rep.y + 0.6)
    rep.textColor(color)
    rep.font(true, 8.5)
    rep.text(`${Math.round(s.score)}%`, M.l + CW - 5, rep.y + 0.6, 'right')
    rep.bar(M.l + 17, rep.y + 4, CW - 38, s.score, color, '#E2E8F0', 2.2)
    rep.y += 7.5

    rep.textColor(PDF_COLORS.muted)
    rep.font(false, 7.6)
    for (const line of desc) {
      rep.ensure(lineH + 2)
      rep.text(line, M.l + 17, rep.y)
      rep.y += lineH
    }
    rep.y += 3.5
  })
}

function drawGrowth(rep: Report, data: ResultData, t: PdfTranslate, num: string): void {
  rep.newPage()
  rep.sectionHeader(num, t('pdf.growth'))

  for (const g of data.growthAreas) {
    const desc = rep.wrap(g.description, CW - 28)
    const actionSegments = [{ text: `\u2192 ${t(g.actionKey)}`, bold: false }]
    const actionLines = rep.wrap( actionSegments[0].text, CW - 26)
    const lineH = 3.2
    const rowH = 19 + desc.length * lineH + actionLines.length * lineH + 6
    rep.ensure(rowH + 4)
    rep.card(M.l, rep.y, CW, rowH)
    rep.y += 4

    rep.textColor(PDF_COLORS.text)
    rep.font(true, 9.5)
    rep.text(t(g.nameKey), M.l + 12, rep.y + 0.6)
    rep.textColor(g.color)
    rep.font(true, 8.5)
    rep.text(`${Math.round(g.current)}% \u2192 ${Math.round(g.target)}%`, M.l + CW - 5, rep.y + 0.6, 'right')

    rep.bar(M.l + 12, rep.y + 4, CW - 24, g.current, '#E2E8F0', '#F1F5F9', 2.2)
    const targetX = M.l + 12 + ((CW - 24) * Math.max(0, Math.min(100, g.target))) / 100
    rep.fill(g.color)
    rep.doc.circle(targetX, rep.y + 5.1, 1.5, 'F')
    rep.y += 7.5

    rep.textColor(PDF_COLORS.muted)
    rep.font(false, 7.6)
    for (const line of desc) {
      rep.ensure(lineH + 2)
      rep.text(line, M.l + 12, rep.y)
      rep.y += lineH
    }

    rep.textColor(g.color)
    rep.font(false, 8)
    for (const line of actionLines) {
      rep.ensure(lineH + 2)
      rep.text(line, M.l + 12, rep.y)
      rep.y += lineH
    }
    rep.y += 4
  }
}

function drawAdvice(rep: Report, data: ResultData, t: PdfTranslate, num: string): void {
  rep.newPage()
  rep.sectionHeader(num, t('pdf.advice'))

  data.advice.forEach((a, i) => {
    const body = rep.wrap(t(a.bodyKey, a.vars), CW - 30)
    const lineH = 3.3
    const rowH = 15 + body.length * lineH + 5
    rep.ensure(rowH + 4)
    rep.card(M.l, rep.y, CW, rowH)
    rep.y += 4
    rep.fill(PDF_COLORS.accent)
    rep.doc.roundedRect(M.l + 4.5, rep.y - 2, 9, 9, 2.4, 2.4, 'F')
    rep.textColor('#FFFFFF')
    rep.font(true, 7)
    rep.text(String(i + 1), M.l + 9, rep.y + 1.5, 'center')

    rep.textColor(PDF_COLORS.text)
    rep.font(true, 9.5)
    rep.text(t(a.titleKey), M.l + 17, rep.y + 0.6, 'left')
    rep.y += 3.5
    rep.textColor(PDF_COLORS.muted)
    rep.font(false, 7.8)
    for (const line of body) {
      rep.ensure(lineH + 2)
      rep.text(line, M.l + 17, rep.y)
      rep.y += lineH
    }
    rep.y += 4
  })
}

function drawReports(rep: Report, data: ResultData, t: PdfTranslate, num: string): void {
  rep.newPage()
  rep.sectionHeader(num, t('report.title'))

  const colors: Record<string, string> = {
    'report.interest': '#6366F1',
    'report.match': '#10B981',
    'report.strength': '#F59E0B',
    'report.direction': '#EA580C',
  }

  data.reports.forEach((r, _i) => {
    const desc = rep.wrap(t(r.descriptionKey), CW - 20)
    const lineH = 3.2
    const rowH = 17 + desc.length * lineH + 5
    const color = colors[r.categoryKey] ?? '#6366F1'
    rep.ensure(rowH + 4)
    rep.card(M.l, rep.y, CW, rowH)
    rep.y += 3.5
    rep.fill(color)
    rep.doc.roundedRect(M.l + 4.5, rep.y - 2, 12, 5.5, 2.75, 2.75, 'F')
    rep.textColor('#FFFFFF')
    rep.font(true, 6)
    rep.text(t(r.categoryKey).slice(0, 18).toUpperCase(), M.l + 10.5, rep.y + 0.5, 'center')
    rep.y += 1.5
    rep.textColor(PDF_COLORS.text)
    rep.font(true, 9.5)
    rep.text(t(r.titleKey), M.l + 4.5, rep.y)
    rep.y += 3
    rep.textColor(PDF_COLORS.muted)
    rep.font(false, 7.6)
    for (const line of desc) {
      rep.ensure(lineH + 2)
      rep.text(line, M.l + 4.5, rep.y)
      rep.y += lineH
    }
    rep.y += 4.5
  })
}

function drawTopCareers(rep: Report, data: ResultData, t: PdfTranslate, icons: Map<string, string | null>, num: string): void {
  if (data.topCareers.length === 0) return
  rep.newPage()
  rep.sectionHeader(num, t('pdf.careers'))

  data.topCareers.forEach((career, i) => {
    const desc = rep.wrap(career.description, CW - 38)
    const reasons = career.reasons.map((r) => r.trim()).filter((r) => r.length > 0)
    const lineH = 3.2
    const descH = desc.length * lineH
    const reasonsH = reasons.map((r) => rep.wrap(r, CW - 44).length * lineH).reduce((a, b) => a + b, 0)
    const skillsH = career.skillKeys.length > 0 ? 5 : 0
    const hero = i === 0
    const rowH = (hero ? 24 : 18) + descH + reasonsH + skillsH + 6
    rep.ensure(rowH + 4)
    rep.card(M.l, rep.y, CW, rowH, hero ? PDF_COLORS.soft : PDF_COLORS.surface)
    if (hero) {
      rep.strokeColor(career.color)
      rep.doc.setLineWidth(0.5)
      rep.doc.roundedRect(M.l, rep.y, CW, rowH, 3.5, 3.5, 'S')
    }
    rep.y += 4

    rep.fill(i === 0 ? PDF_COLORS.accent : career.color)
    rep.doc.circle(M.l + 7, rep.y - 1, 5, 'F')
    rep.textColor('#FFFFFF')
    rep.font(true, 7.5)
    rep.text(String(i + 1), M.l + 7, rep.y + 1.6, 'center')

    const ico = icons.get(career.icon) ?? null
    if (ico) rep.doc.addImage(ico, 'PNG', M.l + 15, rep.y - 3.5, 9, 9)

    rep.textColor(PDF_COLORS.text)
    rep.font(true, 10)
    rep.text(career.name, M.l + 28, rep.y + 0.2)
    rep.textColor(i === 0 ? PDF_COLORS.accent : career.color)
    rep.font(true, 9)
    rep.text(`${Math.round(career.score)}%`, M.l + CW - 5, rep.y + 0.2, 'right')
    rep.bar(M.l + 28, rep.y + 3.8, CW - 50, career.score, i === 0 ? PDF_COLORS.accent : career.color, '#E2E8F0', 2.2)
    rep.y += 7.5

    rep.textColor(PDF_COLORS.muted)
    rep.font(false, 7.6)
    for (const line of desc) {
      rep.ensure(lineH + 2)
      rep.text(line, M.l + 28, rep.y)
      rep.y += lineH
    }

    if (reasons.length > 0) {
      rep.y += 0.5
      rep.textColor(PDF_COLORS.text)
      rep.font(true, 8)
      rep.text(t('career.why').toUpperCase(), M.l + 28, rep.y)
      rep.y += 3.4
      rep.textColor(PDF_COLORS.muted)
      rep.font(false, 7.6)
      for (const reason of reasons) {
        const rLines = rep.wrap(reason, CW - 44)
        rep.fill(career.color)
        rep.doc.circle(M.l + 30, rep.y - 1, 1.1, 'F')
        for (const l of rLines) {
          rep.ensure(lineH + 2)
          rep.text(l, M.l + 34, rep.y)
          rep.y += lineH
        }
      }
    }

    if (career.skillKeys.length > 0) {
      rep.y += 0.5
      rep.textColor(career.color)
      rep.font(true, 7)
      const skills = career.skillKeys.map((k) => t(k)).join('   ')
      for (const line of rep.wrap(skills, CW - 44)) {
        rep.ensure(lineH + 2)
        rep.text(line, M.l + 28, rep.y)
        rep.y += lineH
      }
    }
    rep.y += 3
  })
}

function drawCareerList(rep: Report, data: ResultData, t: PdfTranslate, icons: Map<string, string | null>, num: string): void {
  if (data.allCareers.length === 0) return
  rep.newPage()
  rep.sectionHeader(num, t('pdf.careerMatches'))

  data.allCareers.forEach((career, i) => {
    const desc = rep.wrap(career.description, CW - 30)
    const lineH = 3.1
    const rowH = 16 + desc.length * lineH + 5
    rep.ensure(rowH + 3)
    rep.card(M.l, rep.y, CW, rowH, i % 2 === 0 ? PDF_COLORS.surface : PDF_COLORS.soft)
    rep.y += 4

    rep.fill(career.color)
    rep.doc.circle(M.l + 6, rep.y - 2, 4.2, 'F')
    rep.textColor('#FFFFFF')
    rep.font(true, 6.5)
    rep.text(String(i + 1), M.l + 6, rep.y + 0.9, 'center')

    const ico = icons.get(career.icon) ?? null
    if (ico) rep.doc.addImage(ico, 'PNG', M.l + 12, rep.y - 3, 7, 7)

    rep.textColor(PDF_COLORS.text)
    rep.font(true, 8.8)
    rep.text(career.name, M.l + 22, rep.y + 0.1)
    rep.textColor(career.color)
    rep.font(true, 8)
    rep.text(`${Math.round(career.score)}%`, M.l + CW - 5, rep.y + 0.1, 'right')

    rep.y += 3.4
    rep.textColor(PDF_COLORS.muted)
    rep.font(false, 7)
    for (const line of desc) {
      rep.ensure(lineH + 2)
      rep.text(line, M.l + 22, rep.y)
      rep.y += lineH
    }
    rep.y += 4
  })
}

function drawNextStep(rep: Report, data: ResultData, t: PdfTranslate, num: string): void {
  rep.newPage()
  rep.sectionHeader(num, t('pdf.nextStep'))

  const sub = rep.wrap(t(data.nextStep.subtitleKey, { name: data.nextStep.name }), CW - 24)
  const bodyH = 16 + sub.length * 4 + 10
  rep.ensure(bodyH + 4)
  rep.fill(PDF_COLORS.accent)
  rep.doc.roundedRect(M.l, rep.y, CW, bodyH, 6, 6, 'F')
  rep.y += 8
  rep.textColor('#FFFFFF')
  rep.font(true, 7.5)
  rep.text(t('pdf.nextStep').toUpperCase(), PAGE.w / 2, rep.y, 'center')
  rep.y += 6
  rep.font(true, 15)
  const head = rep.wrap(t(data.nextStep.titleKey), CW - 40)
  for (const line of head.slice(0, 3)) {
    rep.text(line, PAGE.w / 2, rep.y, 'center')
    rep.y += 5.5
  }
  rep.y += 1
  rep.font(false, 9)
  rep.textColor('#EAF2FF')
  for (const line of sub) {
    rep.text(line, PAGE.w / 2, rep.y, 'center')
    rep.y += 4
  }
  rep.y += 3

  const targetKey = data.nextStep.target === 'career' ? 'nav.careers' : data.nextStep.target === 'directions' ? 'nav.interests' : 'pdf.nextStep'
  rep.textColor(PDF_COLORS.accent)
  rep.font(true, 9)
  const tag = ` ${t(targetKey).toUpperCase()} `
  const tw = rep.width(tag)
  rep.fill('#FFFFFF')
  rep.doc.roundedRect(PAGE.w / 2 - tw / 2 - 2, rep.y - 3.2, tw + 4, 6.6, 3.3, 3.3, 'F')
  rep.text(tag, PAGE.w / 2, rep.y + 0.7, 'center')
}

export async function buildResultPdf(
  data: ResultData,
  lang: Lang,
  t: PdfTranslate,
): Promise<jsPDF> {
  const rep = new Report()
  await rep.ready()
  const icons = await preloadIcons(data)
  const hasCareer = data.sources.includes('career')

  await drawCover(rep, data, lang, t)
  drawInterests(rep, data, t, icons, '01')
  drawRiasec(rep, data, t, '02')
  const topNum = hasCareer ? '03' : ''
  const listNum = hasCareer ? '04' : ''
  if (hasCareer) {
    drawTopCareers(rep, data, t, icons, topNum)
    drawCareerList(rep, data, t, icons, listNum)
  }
  const base = hasCareer ? 5 : 3
  drawCharacter(rep, data, t, String(base).padStart(2, '0'))
  drawValues(rep, data, t, String(base + 1).padStart(2, '0'))
  drawArchetype(rep, data, t, String(base + 2).padStart(2, '0'))
  drawStrengths(rep, data, t, String(base + 3).padStart(2, '0'))
  drawGrowth(rep, data, t, String(base + 4).padStart(2, '0'))
  drawAdvice(rep, data, t, String(base + 5).padStart(2, '0'))
  drawReports(rep, data, t, String(base + 6).padStart(2, '0'))
  drawNextStep(rep, data, t, String(base + 7).padStart(2, '0'))

  rep.footer(rep.doc.getNumberOfPages())
  return rep.doc
}

/* ------------------------------------------------------------------ */
/* AI Roadmap PDF                                                      */
/* ------------------------------------------------------------------ */

function drawRoadmapCover(rep: Report, logo: string, t: PdfTranslate, lang: Lang): void {
  rep.font(true, 10)
  rep.textColor(PDF_COLORS.accent)
  rep.text('QUIZLAB', PAGE.w / 2, 24, 'center')
  rep.doc.addImage(logo, 'PNG', PAGE.w / 2 - 36, 28, 72, 15.75)

  rep.y = 72
  rep.textColor(PDF_COLORS.text)
  rep.font(true, 24)
  const titleLines = rep.wrap(t('roadmap.title'), CW - 10)
  for (const line of titleLines.slice(0, 2)) {
    rep.doc.text(line, PAGE.w / 2, rep.y, { align: 'center' })
    rep.y += 8
  }

  rep.textColor(PDF_COLORS.muted)
  rep.font(false, 9.5)
  const kickerLines = rep.wrap(t('roadmap.heroKicker'), CW - 24)
  for (const line of kickerLines.slice(0, 2)) {
    rep.doc.text(line, PAGE.w / 2, rep.y, { align: 'center' })
    rep.y += 5
  }

  rep.y += 4
  const dateLabel = `${t('pdf.generatedOn')} ${formatDate(lang)}`
  const dateW = rep.width(dateLabel)
  rep.strokeColor(PDF_COLORS.border)
  rep.doc.setLineWidth(0.4)
  rep.doc.roundedRect(PAGE.w / 2 - dateW / 2 - 5, rep.y - 3.4, dateW + 10, 6.6, 3.3, 3.3, 'S')
  rep.textColor(PDF_COLORS.muted)
  rep.font(false, 8.5)
  rep.text(dateLabel, PAGE.w / 2, rep.y + 0.7, 'center')

  rep.y = 112
  rep.ensure(60)
  rep.fill(PDF_COLORS.surface)
  rep.doc.roundedRect(M.l + 14, rep.y, CW - 28, 64, 5, 5, 'F')
  rep.y += 9
  rep.textColor(PDF_COLORS.accent)
  rep.font(true, 8)
  rep.text(t('roadmap.heroSub').toUpperCase(), PAGE.w / 2, rep.y, 'center')
  rep.y += 7
  rep.textColor(PDF_COLORS.text)
  rep.font(false, 10.5)
  const descSegments = parseRich(t('roadmap.desc'))
  rep.richFlow(descSegments, M.l + 26, CW - 52, 5, 10.5)
  rep.y += 8

  rep.textColor(PDF_COLORS.muted)
  rep.font(false, 8.5)
  const noteLines = rep.wrap(t('roadmap.note'), CW - 60)
  for (const line of noteLines.slice(0, 3)) {
    rep.doc.text(line, PAGE.w / 2, rep.y, { align: 'center' })
    rep.y += 4
  }

  rep.textColor(PDF_COLORS.muted)
  rep.font(false, 11)
  rep.text('#kasbimniTopdim', PAGE.w / 2, 262, 'center')
}

function drawRoadmapIntro(rep: Report, t: PdfTranslate, lang: Lang): void {
  rep.newPage()
  rep.sectionHeader('01', t('roadmap.title'))

  const descLines = rep.wrap(t('roadmap.desc'), CW - 8)
  rep.textColor(PDF_COLORS.muted)
  rep.font(false, 9)
  for (const line of descLines) {
    rep.ensure(4)
    rep.text(line, M.l, rep.y)
    rep.y += 4
  }
  rep.y += 2
  rep.textColor(PDF_COLORS.text)
  rep.font(true, 8.5)
  rep.text(t('roadmap.heroSub'), M.l, rep.y)
  rep.y += 4
  rep.textColor(PDF_COLORS.accent)
  rep.font(false, 8.5)
  rep.text(`${t('pdf.generatedOn')} ${formatDate(lang)}`, M.l, rep.y)
  rep.y += 8
}

function drawTimeline(rep: Report, steps: RoadmapStep[], t: PdfTranslate): void {
  rep.newPage()
  rep.sectionHeader('02', t('roadmap.timeline'))

  steps.forEach((step, i) => {
    const textLines = rep.wrap(step.text, CW - 52)
    const lineH = 3.4
    const rowH = 16 + textLines.length * lineH + 5
    rep.ensure(rowH + 4)
    rep.card(M.l, rep.y, CW, rowH)
    rep.y += 4
    rep.fill(PDF_COLORS.accent)
    rep.doc.circle(M.l + 10, rep.y + 0.5, 6.5, 'F')
    rep.textColor('#FFFFFF')
    rep.font(true, 9)
    rep.text(String(i + 1), M.l + 10, rep.y + 2.7, 'center')

    rep.textColor(PDF_COLORS.text)
    rep.font(true, 10)
    rep.text(step.title, M.l + 24, rep.y + 0.6)
    rep.y += 5
    rep.textColor(PDF_COLORS.muted)
    rep.font(false, 8)
    for (const line of textLines) {
      rep.ensure(lineH + 2)
      rep.text(line, M.l + 24, rep.y)
      rep.y += lineH
    }
    rep.y += 4
  })
}

function drawRoadmapBlocks(rep: Report, blocks: RoadmapBlock[]): void {
  blocks.forEach((block, bi) => {
    rep.newPage()
    const num = String(bi + 3).padStart(2, '0')
    const heading = block.heading.replace(/^#+\s*/, '').replace(/\*\*/g, '')
    rep.sectionHeader(num, heading)

    for (const rawLine of block.lines) {
      const line = rawLine.trim()
      if (!line) {
        rep.y += 2
        continue
      }
      const isBullet = /^[-*•]\s+/.test(line)
      const isNumbered = /^\d+[.)]\s+/.test(line)
      const bulletIndent = isBullet || isNumbered
      const clean = line.replace(/^[-*•]\s+/, '').replace(/^\d+[.)]\s+/, '')
      const segments = parseRich(clean)
      const maxW = CW - (bulletIndent ? 34 : 20)
      const indent = bulletIndent ? 18 : 12

      if (bulletIndent) {
        rep.ensure(5)
        rep.fill(PDF_COLORS.accent)
        rep.doc.circle(M.l + 9.5, rep.y, 1.4, 'F')
      }

      rep.ensure(5)
      rep.textColor(PDF_COLORS.text)
      rep.richFlow(segments, M.l + indent, maxW, 3.6, 9)
      rep.y += 3.6
    }
  })
}

export async function buildRoadmapPdf(
  blocks: RoadmapBlock[],
  steps: RoadmapStep[],
  lang: Lang,
  t: PdfTranslate,
): Promise<jsPDF> {
  const rep = new Report()
  await rep.ready()
  const logo = await getNaviLogoDataUrl(620)

  drawRoadmapCover(rep, logo, t, lang)
  drawRoadmapIntro(rep, t, lang)
  drawTimeline(rep, steps, t)
  drawRoadmapBlocks(rep, blocks)

  rep.footer(rep.doc.getNumberOfPages())
  return rep.doc
}