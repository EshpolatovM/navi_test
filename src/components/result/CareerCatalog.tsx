import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { useSettings } from '../SettingsContext'
import QuizIcon from '../QuizIcon'
import { ResultCard, ResultIconTile } from './ui/ResultCard'
import { CardHeader } from './ui/CardHeader'
import { RankNum, ScoreValue } from './ui/Score'
import { ScoreLabel } from './ui/ScoreLabel'
import { ResultProgress } from './ui/ResultProgress'
import type { CareerMatchData } from './useResultData'

const CATEGORY_MAP: Record<string, string[]> = {
  it: ['dev'],
  data: ['data', 'biologist'],
  design: ['designer', 'architect'],
  media: ['musician', 'writer', 'translator'],
  business: ['sales', 'entrepreneur', 'marketing'],
  finance: ['accountant', 'fin-analysis'],
  engineering: ['mechanic', 'electrician', 'carpenter', 'pilot'],
  other: ['doctor', 'nurse', 'teacher', 'counselor', 'phys-therapist', 'police', 'farmer', 'conservation'],
}

function getCareerCategory(careerId: string): string {
  for (const [cat, ids] of Object.entries(CATEGORY_MAP)) {
    if (ids.includes(careerId)) return cat
  }
  return 'other'
}

const CATEGORY_KEYS: Record<string, string> = {
  all: 'catalog.all',
  it: 'catalog.it',
  data: 'catalog.data',
  design: 'catalog.design',
  media: 'catalog.media',
  business: 'catalog.business',
  finance: 'catalog.finance',
  engineering: 'catalog.engineering',
  other: 'catalog.other',
}

function CareerCatalog({
  careers,
  onCareerClick,
  embedded = false,
}: {
  careers: CareerMatchData[]
  onCareerClick: (career: CareerMatchData) => void
  onBack?: () => void
  embedded?: boolean
}) {
  const { t } = useSettings()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = useMemo(() => {
    const cats = new Set<string>()
    careers.forEach((c) => cats.add(getCareerCategory(c.id)))
    return ['all', ...Array.from(cats)]
  }, [careers])

  const filtered = useMemo(() => {
    let result = careers
    if (activeCategory !== 'all') {
      result = result.filter((c) => getCareerCategory(c.id) === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      )
    }
    return result
  }, [careers, activeCategory, search])

  return (
    <section id="catalog" className="flex flex-col gap-5">
      {/* Header */}
      {!embedded && (
        <div>
          <h2 className="font-display text-[20px] font-bold text-[var(--text-primary)]">
            {t('catalog.title')}
          </h2>
          <p className="mt-1 text-[13px] text-[var(--text-muted)]">
            {careers.length} ta kasb · {t('catalog.search')}
          </p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('catalog.search')}
          className="h-10 w-full rounded-xl bg-[var(--surface-elevated)] pl-9 pr-9 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          style={{ border: '1px solid var(--border)' }}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Category filters — horizontal scroll strip on phones, wrapped pills on desktop */}
      <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition-all duration-150 ${
              activeCategory === cat
                ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            style={activeCategory !== cat ? { border: '1px solid var(--border)' } : undefined}
          >
            {t(CATEGORY_KEYS[cat] ?? cat)}
          </button>
        ))}
      </div>

      {/* Career grid */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <Search className="mx-auto size-6 text-[var(--text-muted)]" />
          <p className="mt-3 text-[13px] text-[var(--text-secondary)]">{t('catalog.empty')}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((career, i) => (
            <ResultCard
              key={career.id}
              as="button"
              onClick={() => onCareerClick(career)}
              delay={i * 40}
              className="p-5"
            >
              <div className="flex h-full flex-col">
                <CardHeader
                  rank={<RankNum n={i + 1} />}
                  icon={
                    <ResultIconTile
                      icon={<QuizIcon name={career.icon} size={20} />}
                      color={career.color}
                      size={44}
                      interactive
                    />
                  }
                  title={<span className="truncate">{career.name}</span>}
                  score={<ScoreValue value={career.score} accent={career.color} size="sm" className="mt-1" />}
                  meta={<ScoreLabel score={career.score} accent={career.color} />}
                />
                <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                  {career.description}
                </p>
                <div className="mt-auto pt-4">
                  <ResultProgress value={career.score} accent={career.color} delay={0.1 + i * 0.03} segments={14} />
                </div>
              </div>
            </ResultCard>
          ))}
        </div>
      )}
    </section>
  )
}

export default CareerCatalog