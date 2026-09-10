import { SVG_ICONS } from '../components/QuizIcon'
import { NAVI_LOGO_PATHS } from '../components/NaviLogo'

/** Brand accent used by the offline PDF / preview renderers. */
export const NAVI_BLUE = '#3B7BEC'

export const NAVI_LOGO_VIEWBOX = { w: 1998, h: 437 } as const

function ensureSvgSize(markup: string, size: number): string {
  if (/<svg[^>]*\bwidth=/.test(markup)) return markup
  return markup.replace('<svg', `<svg width="${size}" height="${size}"`)
}

async function renderSvgToPng(markup: string, width: number, height: number): Promise<string> {
  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }))
  try {
    const img = new Image()
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('svg image failed to load'))
      img.src = url
    })
    const scale = 2
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(width * scale)
    canvas.height = Math.round(height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('canvas 2d context unavailable')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png')
  } finally {
    URL.revokeObjectURL(url)
  }
}

const iconCache = new Map<string, Promise<string | null>>()

/**
 * Rasterizes one of the bundled brand SVG icons (ai, design, it, ...) to a
 * PNG data URL so it can be embedded into the PDF / share preview.
 */
export function getIconDataUrl(name: string, size = 64): Promise<string | null> {
  const key = `${name}:${size}`
  const cached = iconCache.get(key)
  if (cached) return cached

  const url = SVG_ICONS[name]
  if (!url) return Promise.resolve(null)

  const job = (async () => {
    try {
      const res = await fetch(url)
      if (!res.ok) return null
      const markup = ensureSvgSize(await res.text(), size)
      return await renderSvgToPng(markup, size, size)
    } catch {
      return null
    }
  })()
  iconCache.set(key, job)
  return job
}

const logoCache = new Map<string, Promise<string>>()

/** Rasterizes the NAVI wordmark (fills it with the brand blue). */
export function getNaviLogoDataUrl(width = 420): Promise<string> {
  const cached = logoCache.get(String(width))
  if (cached) return cached

  const job = (async () => {
    const height = Math.round((width * NAVI_LOGO_VIEWBOX.h) / NAVI_LOGO_VIEWBOX.w)
    const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${NAVI_LOGO_VIEWBOX.w} ${NAVI_LOGO_VIEWBOX.h}">${NAVI_LOGO_PATHS.map(
      (d) => `<path d="${d}" fill="${NAVI_BLUE}"/>`,
    ).join('')}</svg>`
    return renderSvgToPng(markup, width, height)
  })()
  logoCache.set(String(width), job)
  return job
}

/** Draws the NAVI wordmark directly onto a 2D canvas (width-driven, ratio kept). */
export function drawNaviLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  color = NAVI_BLUE,
): void {
  const scale = width / NAVI_LOGO_VIEWBOX.w
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.fillStyle = color
  for (const d of NAVI_LOGO_PATHS) {
    ctx.fill(new Path2D(d))
  }
  ctx.restore()
}