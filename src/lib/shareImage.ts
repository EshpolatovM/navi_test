import { drawNaviLogo, getIconDataUrl, NAVI_BLUE } from './naviVisuals'
import type { Lang } from './i18n'
import type { ResultData } from '../components/result/useResultData'
import type { PdfTranslate } from './pdf'

const W = 1200
const H = 630

const C = {
  bg: '#F7F7F7',
  card: '#FFFFFF',
  border: '#E7ECF3',
  text: '#0F172A',
  muted: '#64748B',
  accent: NAVI_BLUE,
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function truncate(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text
  let out = text
  while (out.length > 1 && ctx.measureText(`${out}\u2026`).width > maxW) out = out.slice(0, -1)
  return `${out}\u2026`
}

const FONT = "'Manrope',system-ui,sans-serif"

/**
 * Generates the 1200×630 social share preview card from real result data.
 * Shows a short attractive summary only — full results live in the PDF.
 */
export async function buildSharePreview(
  data: ResultData,
  lang: Lang,
  t: PdfTranslate,
): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas unavailable')

  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = C.accent
  ctx.fillRect(0, 0, W, 8)

  drawNaviLogo(ctx, 64, 52, 236)
  ctx.fillStyle = C.muted
  ctx.font = `600 26px ${FONT}`
  ctx.textAlign = 'right'
  ctx.fillText('#kasbimniTopdim', W - 64, 92)
  ctx.textAlign = 'left'

  ctx.fillStyle = C.text
  ctx.font = `800 54px ${FONT}`
  ctx.fillText(truncate(ctx, t('result.share.nativeTitle'), 900), 64, 176)
  ctx.fillStyle = C.muted
  ctx.font = `500 27px ${FONT}`
  ctx.fillText(truncate(ctx, t('result.hero.title'), 900), 64, 216)

  const cardTop = 252
  const cardH = 252
  ctx.fillStyle = C.card
  ctx.strokeStyle = C.border
  ctx.lineWidth = 2
  rr(ctx, 64, cardTop, W - 128, cardH, 28)
  ctx.fill()
  ctx.stroke()

  const topThree =
    data.sources.includes('career') && data.allCareers.length > 0
      ? data.allCareers.slice(0, 3)
      : data.directionScores.slice(0, 3)

  const hero = data.directionScores[0]
  if (hero) {
    const heroIcon = await getIconDataUrl(hero.icon, 128)
    ctx.fillStyle = C.accent
    rr(ctx, 104, cardTop + 36, 72, 72, 20)
    ctx.fill()
    if (heroIcon) {
      const img = new Image()
      img.src = heroIcon
      await img.decode().catch(() => undefined)
      if (img.width) ctx.drawImage(img, 104, cardTop + 36, 72, 72)
    }
    ctx.fillStyle = C.text
    ctx.font = `700 34px ${FONT}`
    ctx.fillText(truncate(ctx, t(hero.nameKey), 560), 200, cardTop + 66)
    ctx.fillStyle = C.accent
    ctx.font = `800 30px ${FONT}`
    ctx.fillText(`${Math.round(hero.score)}%`, 200, cardTop + 104)
    ctx.fillStyle = C.muted
    ctx.font = `500 20px ${FONT}`
    const matchWord = t('rc.match')
    ctx.fillText(matchWord, 200 + ctx.measureText(`${Math.round(hero.score)}%`).width + 14, cardTop + 99)

    ctx.fillStyle = '#E5ECF6'
    rr(ctx, 200, cardTop + 124, 440, 14, 7)
    ctx.fill()
    ctx.fillStyle = C.accent
    rr(ctx, 200, cardTop + 124, (440 * Math.max(0, Math.min(100, hero.score))) / 100, 14, 7)
    ctx.fill()

    ctx.fillStyle = C.muted
    ctx.font = `500 20px ${FONT}`
    const exp = hero.explanation.length > 120 ? `${hero.explanation.slice(0, 117)}\u2026` : hero.explanation
    ctx.fillText(truncate(ctx, exp, 560), 200, cardTop + 160)
  }

  topThree.forEach((item, i) => {
    const y = cardTop + 40 + i * 66
    ctx.fillStyle = i === 0 ? C.accent : '#E2E8F0'
    ctx.beginPath()
    ctx.arc(988, y + 14, 16, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = i === 0 ? '#FFFFFF' : C.muted
    ctx.font = `700 22px ${FONT}`
    ctx.textAlign = 'center'
    ctx.fillText(String(i + 1), 988, y + 21)
    ctx.textAlign = 'left'
    ctx.fillStyle = C.text
    ctx.font = `600 24px ${FONT}`
    const name = 'name' in item ? item.name : t(item.nameKey)
    ctx.fillText(truncate(ctx, name, 300), 1020, y + 20)
    ctx.fillStyle = i === 0 ? C.accent : '#94A3B8'
    ctx.font = `700 22px ${FONT}`
    ctx.fillText(`${Math.round(item.score)}%`, 1096, y + 20)
  })

  ctx.fillStyle = C.accent
  ctx.beginPath()
  ctx.arc(64, 572, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = C.muted
  ctx.font = `600 24px ${FONT}`
  ctx.fillText('QuizLab', 84, 580)
  ctx.fillStyle = '#B6C2D2'
  ctx.font = `500 20px ${FONT}`
  ctx.fillText('#kasbimniTopdim', W - 64 - ctx.measureText('#kasbimniTopdim').width, 580)

  return canvas.toDataURL('image/png')
}