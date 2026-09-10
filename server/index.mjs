import { readFile, stat } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

try {
  process.loadEnvFile?.()
} catch {
  /* .env optional — keys may come from the process environment */
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')

const PORT = Number(process.env.PORT || 4317)
const AI_BASE_URL = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '')
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini'

const API_KEYS = [process.env.AI_API_KEY_1, process.env.AI_API_KEY_2, process.env.AI_API_KEY_3].filter(Boolean)
if (API_KEYS.length === 0) console.warn('⚠  AI_API_KEY_1..3 not set — /api/roadmap will return 503')

const MAX_BODY_BYTES = 2 * 1024 * 1024

const ROADMAP_START = '---ROADMAP-STEPS-START---'
const ROADMAP_END = '---ROADMAP-STEPS-END---'

/** Language-specific system prompt. Tells the model what to produce, in what
 *  tone and format. Never invents raw scores — it works from the data sent. */
function systemPrompt(lang, result) {
  const name = ({ name, score }) => `${name} (${Math.round(score)}%)`
  const content = JSON.stringify(result, null, 0)
  return `Sen professional va xushmuomala karьera-yo'l-navigatori yordamchisan. Foydalanuvchi quizlab testlarini yakunladi. Bu yerda uning HAQIQIY natijalari bor (faqat shu ma'lumotdan foydalan — hech narsa o'ylab chiqirma, ballarni o'zgartirma, kasb yoki tashxis uydirma).

Top yo'nalish: ${result.topDirection ? name(result.topDirection) : '—'}
Top kasblar: ${result.topCareers ? result.topCareers.map(name).slice(0, 3).join(', ') : '—'}
Umumiy RIASEC: ${(result.riasec || []).map((r) => `${r.letter} ${Math.round(r.score)}%`).join(', ')}
Tahlil uchun to'liq natijalar: ${content.slice(0, 9000)}

Talablar:
- Javobni SHU tartibda, aniq 10 bo'limda yoz, har biri markdown sarlavhasi bilan boshlansin (bir xil nom bilan): "## 1. Yo'nalishlar tahlili", "## 2. Kasb yo'nalishlari", "## 3. Kuchli tomonlaring", "## 4. Rivojlanish yo'nalishlari", "## 5. Qiziqishlar va qadriyatlar", "## 6. Dastlabki qadamlar (30 kun)", "## 7. Keyingi bosqich (3-6 oy)", "## 8. Uzoq muddatli maqsadlar (1-3 yil)", "## 9. Loyiha g'oyalari", "## 10. O'rganish tartibi va yakuniy yo'l xaritasi".
- Bo'limlar ichida qisqa fikrlar va telsizlik: "1. " qatorlar yoki "- " nuqtali qatorlardan foydalanish mumkin.
- Til: foydalanuvchi tilida (${lang === 'uz' ? "o'zbek" : lang === 'ru' ? 'rus' : 'ingliz'}) yoz.
- Barcha kuzatuvlar yumshoq, maslahat xos bo'lsin: "natijalaring shuni ko'rsatmoqda", "senga mos", "hissiy salohiyating". Tashxis, mutlaq gap, yolg'on fakt YO'Q.
- Ta'kid (bold) faqat muhim narsa uchun: **qator ichida**.
- Yangi "## " sarlavhalar qo'shma, nomlarini o'zgartirma — topilgan bo'limlar tarkibi o'zgarishi mumkin.
- Oxirida, ALBATTA, yo'l xaritasining bosqichlarini marker delimiters ichida, qat'iy 5 qator formatda yoz (har bir satr navbat raqami, nuqta, bo'sh joy, sarlavha, "|", tavsif):
${ROADMAP_START}
1. Yo'l xaritang boshlanadi|Hozirgi kuchli tomonlardan foydalanib birinchi qadamni qo'y.
2. Birinchi loyiha|...
3. Ko'nikmalarni mustahkamlash|...
4. Portfolio yig'ish|...
5. Keyingi bosqich|...
${ROADMAP_END}
Marker bilan ${ROADMAP_END} teskari satr yozishni unutma. Keyingi bo'sh qatorni hech narsa bilan to'ldirma.`
}

function parseSteps(content) {
  const start = content.indexOf(ROADMAP_START)
  const end = content.indexOf(ROADMAP_END)
  const steps = []
  if (start !== -1 && end !== -1 && end > start) {
    const lines = content.slice(start + ROADMAP_START.length, end).split(/\r?\n/)
    for (const raw of lines) {
      const line = raw.trim()
      if (!line) continue
      const m = /^(\d{1,2})[.)]\s+(.+?)\s*\|\s*(.+)$/.exec(line)
      if (m) steps.push({ title: m[2].trim(), text: m[3].trim() })
    }
  }
  return steps.slice(0, 5)
}

function parseBlocks(content) {
  const body = content.replace(new RegExp(`${escapeRegExp(ROADMAP_START)}[\\s\\S]*?${escapeRegExp(ROADMAP_END)}`), '')
  const blocks = []
  let current = null
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('## ')) {
      current = { heading: line.slice(3).trim(), lines: [] }
      blocks.push(current)
    } else if (current) {
      current.lines.push(line.replace(/^\s*[-•]\s*/, '- '))
    } else {
      if (blocks.length === 0) {
        current = { heading: '', lines: [] }
        blocks.push(current)
      }
      current.lines.push(line)
    }
  }
  return blocks.filter((b) => b.heading.length > 0 || b.lines.length > 0)
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function validateResult(result) {
  if (!result || typeof result !== 'object') return false
  if (!Array.isArray(result.sources) || result.sources.length === 0) return false
  if (!Array.isArray(result.directions) || result.directions.length === 0) return false
  if (!Array.isArray(result.riasec) || result.riasec.length !== 6) return false
  return true
}

function isRetriable(status, errorText) {
  if (status === 429) return true
  if (status >= 500 && status < 600) return true
  const t = String(errorText || '').toLowerCase()
  return t.includes('insufficient_quota') || t.includes('rate_limit') || t.includes('overloaded')
}

async function callOpenAI(key, messages) {
  const res = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      temperature: 0.5,
      max_tokens: 2600,
      messages,
    }),
    signal: AbortSignal.timeout(90_000),
  })
  const raw = await res.text()
  let json = null
  try {
    json = JSON.parse(raw)
  } catch {
    /* non-json upstream body */
  }
  if (!res.ok) {
    const code = json?.error?.code || json?.error?.message || ''
    return { ok: false, status: res.status, error: code }
  }
  const content = json?.choices?.[0]?.message?.content
  if (typeof content !== 'string' || content.length === 0) {
    return { ok: false, status: 502, error: 'empty completion' }
  }
  return { ok: true, content }
}

async function handleRoadmap(req, body) {
  let parsed
  try {
    parsed = JSON.parse(body)
  } catch {
    return { status: 400, json: { ok: false, error: 'invalid_json' } }
  }
  if (!validateResult(parsed.result)) {
    return { status: 400, json: { ok: false, error: 'invalid_result' } }
  }
  const lang = parsed.lang === 'ru' ? 'ru' : parsed.lang === 'en' ? 'en' : 'uz'
  if (API_KEYS.length === 0) {
    return { status: 503, json: { ok: false, error: 'no_keys' } }
  }

  const messages = [
    { role: 'system', content: systemPrompt(lang, parsed.result) },
    { role: 'user', content: "Men testlarni yakunladim. Yuqoridagi natijalarim asosida menga shaxsiy career roadmap'ni tuzib ber, yuqoridagi barcha talablarga rioya qilgan holda (10 bo'lim + 5 bosqich marker)." },
  ]

  const lastRetriable = API_KEYS.length - 1
  for (let i = 0; i < API_KEYS.length; i++) {
    const attempt = await callOpenAI(API_KEYS[i], messages)
    if (attempt.ok) {
      return {
        status: 200,
        json: {
          ok: true,
          data: {
            blocks: parseBlocks(attempt.content),
            steps: parseSteps(attempt.content),
            createdAt: Date.now(),
          },
        },
      }
    }
    const retriable = isRetriable(attempt.status, attempt.error)
    if (!retriable || i === lastRetriable) {
      return { status: 502, json: { ok: false, error: 'upstream_unavailable' } }
    }
    /* retriable failure → try the next key */
  }
  return { status: 502, json: { ok: false, error: 'upstream_unavailable' } }
}

async function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  const requested = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '')
  const filePath = path.join(DIST, requested)
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403).end('Forbidden')
    return
  }
  try {
    const stats = await stat(filePath)
    if (stats.isFile()) {
      const data = await readFile(filePath)
      const type = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.ico': 'image/x-icon',
        '.ttf': 'font/ttf',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.json': 'application/json',
      }[path.extname(filePath)] || 'application/octet-stream'
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'public, max-age=31536000, immutable' })
      res.end(data)
      return
    }
  } catch {
    /* fall through to SPA fallback */
  }
  try {
    const index = await readFile(path.join(DIST, 'index.html'))
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(index)
  } catch {
    res.writeHead(404).end('Not found — run `npm run build` first')
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const started = Date.now()
  if (req.method === 'POST' && url.pathname === '/api/roadmap') {
    const chunks = []
    let size = 0
    let aborted = false
    for await (const chunk of req) {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        aborted = true
        res.writeHead(413, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: false, error: 'too_large' }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    }
    if (aborted) return
    const body = Buffer.concat(chunks).toString('utf8')
    const { status, json } = await handleRoadmap(req, body)
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(json))
    if (status >= 500) console.warn(`[roadmap] ${status} in ${Date.now() - started}ms`)
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: true, model: AI_MODEL, base: AI_BASE_URL }))
    return
  }

  await serveStatic(req, res)
})

server.listen(PORT, () => {
  console.log(`[server] QuizLab API + static on http://localhost:${PORT}`)
})