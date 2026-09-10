/**
 * Share system config. The result page URL is openable by anyone; the preview
 * image is generated client-side from real data. Set baseUrl to a deployed
 * origin when available — it flips automatically to window.location.origin.
 */
export const shareConfig = {
  /** Where the result page lives. Falls back to the current origin. */
  get baseUrl(): string {
    return typeof window !== 'undefined' ? window.location.origin : ''
  },
  get resultUrl(): string {
    return `${this.baseUrl}/result`
  },
  hashtag: '#kasbimniTopdim',
}

export interface SharePayload {
  title: string
  text: string
  url: string
}

export function encodeShare(text: string): string {
  return encodeURIComponent(text)
}

export function telegramUrl(payload: SharePayload): string {
  const params = new URLSearchParams()
  if (payload.text) params.set('text', payload.text)
  params.set('url', payload.url)
  return `https://t.me/share/url?${params.toString()}`
}

export function whatsappUrl(payload: SharePayload): string {
  const full = `${payload.text}\n${payload.url}`
  return `https://wa.me/?text=${encodeURIComponent(full)}`
}

export function openInTab(url: string): void {
  const win = window.open(url, '_blank', 'noopener,noreferrer')
  if (win) try { win.opener = null } catch { /* noop */ }
}

export async function copyShare(payload: SharePayload): Promise<boolean> {
  const text = `${payload.title}\n${payload.text}\n${payload.url}`
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
      return true
    } catch {
      return false
    }
  }
}

export interface NativeShareResult {
  kind: 'shared' | 'cancelled' | 'unsupported' | 'failed'
}

export async function nativeShare(payload: SharePayload, files?: File[]): Promise<NativeShareResult> {
  const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void>; canShare?: (data: ShareData) => boolean }
  if (!nav.share) return { kind: 'unsupported' }
  const data: ShareData = {
    title: payload.title,
    text: `${payload.text} ${payload.url}`,
    url: payload.url,
  }
  if (files && files.length > 0 && nav.canShare && nav.canShare({ files })) {
    data.files = files
  }
  try {
    await nav.share(data)
    return { kind: 'shared' }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return { kind: 'cancelled' }
    return { kind: 'failed' }
  }
}

export function dataUrlToFile(dataUrl: string, filename: string): File {
  const [head, body] = dataUrl.split(',')
  const mime = /data:([^;]+)/.exec(head)?.[1] ?? 'image/png'
  const bin = atob(body)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new File([bytes], filename, { type: mime })
}