import { ArrowRight, Compass, RotateCcw } from 'lucide-react'
import { CAREERS, DIMS, INTEREST_COUNT, QUESTIONS, STAGES } from '../data'

export type AssessmentMode = 'interest' | 'career'

interface Resume {
  answered: number
  total: number
  finished: boolean
}

function ModeCard({
  title,
  subtitle,
  badge,
  icon,
  gradient,
  chips,
  resume,
  cta,
  onSelect,
  delay,
}: {
  title: string
  subtitle: string
  badge: string
  icon: React.ReactNode
  gradient: string
  chips: React.ReactNode
  resume: Resume | null
  cta: string
  onSelect: () => void
  delay: number
}) {
  const resumeLabel = resume
    ? resume.finished
      ? 'Natijani ko\u2018rish'
      : `Davom etish \u00b7 ${resume.answered}/${resume.total}`
    : null

  return (
    <div
      className="animate-slide-up flex flex-col rounded-3xl bg-white/90 p-6 text-left shadow-[0_20px_50px_rgba(30,41,59,0.12)] ring-1 ring-white/70 backdrop-blur transition-transform duration-300 ease-out hover:-translate-y-1 md:p-7"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold whitespace-nowrap uppercase tracking-[0.18em]"
        style={{ background: `${resume ? '#10B981' : '#1e293b'}0d`, color: resume ? '#059669' : '#334155' }}
      >
        {resume ? <RotateCcw style={{ width: 10, height: 10 }} /> : null}
        {resumeLabel ?? badge}
      </span>

      <div className="mt-4 flex min-h-[3.5rem] items-center gap-4">
        <span className={`grid size-14 shrink-0 place-items-center rounded-2xl text-white shadow-[0_12px_28px_rgba(30,41,59,0.35)] ${gradient}`}>
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-[19px] font-bold leading-tight tracking-[-0.01em] text-slate-900 md:text-[21px] md:leading-snug">
            {title}
          </h2>
          <p className="mt-0.5 min-h-[3.25rem] text-[12px] leading-snug font-semibold text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-4 min-h-[3.5rem]">{chips}</div>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold uppercase tracking-[0.06em] text-white transition-all duration-200 ease-out select-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
          style={{ background: 'linear-gradient(135deg, #1d4ed8, #3730a3)', boxShadow: '0 12px 28px -8px rgba(55,48,163,0.55)' }}
        >
          {resume ? resumeLabel : cta}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function SplashScreen({
  career,
  interest,
  onSelect,
}: {
  career: Resume | null
  interest: Resume | null
  onSelect: (mode: AssessmentMode) => void
}) {
  return (
    <div className="animate-question-in mx-auto w-full max-w-[1040px] px-1">
      <div className="mb-7 text-center">
        <div className="animate-bubble-in mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-white/90 text-slate-900 shadow-[0_12px_28px_rgba(30,41,59,0.18)] ring-1 ring-white/70 backdrop-blur md:size-16">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold tracking-[-0.01em] text-slate-900 md:text-[2rem]">
          Nimadan <span className="text-blue-600">boshlaymiz</span>?
        </h1>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-slate-600">
          Ikkala test ham bepul va ro&lsquo;yxatdan o&lsquo;tish talab qilmaydi. Istalgan paytda
          orqaga qaytib, natijangizni saqlab davom ettirishingiz mumkin.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <ModeCard
          title="QIZIQISH"
          subtitle="O\u2018zingizga qaysi turdagi ish va faoliyatlar ko\u2018proq yoqishini aniqlang."
          badge="Yangi \u00b7 RIASEC"
          icon={<Compass style={{ width: 30, height: 30 }} strokeWidth={2.1} />}
          gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          chips={
            <div className="flex flex-wrap items-center gap-1.5">
              {DIMS.map((d, i) => (
                <span
                  key={d.key}
                  className="animate-slide-up inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1"
                  style={{ background: `${d.color}0d`, borderColor: `${d.color}33`, animationDelay: `${200 + i * 60}ms` }}
                >
                  <span className="font-display text-[10px] font-bold" style={{ color: d.color }}>
                    {d.key}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">{d.short}</span>
                </span>
              ))}
            </div>
          }
          resume={interest}
          cta="Testni boshlash"
          onSelect={() => onSelect('interest')}
          delay={150}
        />

        <ModeCard
          title="REAL KASB TANLASH"
          subtitle="Mavjud test orqali o\u2018zingizga mos kasb yo\u2018nalishlarini aniqlang."
          badge="To\u2018liq kasb testi"
          icon={
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
            </svg>
          }
          gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          chips={
            <div className="flex flex-wrap items-center gap-1.5">
              {STAGES.map((s, i) => (
                <span
                  key={s.key}
                  className="animate-slide-up inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1"
                  style={{ background: `${s.accent}0d`, borderColor: `${s.accent}33`, animationDelay: `${200 + i * 70}ms` }}
                >
                  <span className="grid size-4 place-items-center rounded-full text-white" style={{ background: s.accent }}>
                    <s.icon style={{ width: 9, height: 9 }} strokeWidth={2.6} />
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.06em] text-slate-600">{s.key}</span>
                </span>
              ))}
            </div>
          }
          resume={career}
          cta="Testni boshlash"
          onSelect={() => onSelect('career')}
          delay={220}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-center">
        <span className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
          Qiziqish: {INTEREST_COUNT} savol · taxminan 2 daqiqa
        </span>
        <span className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
          Real kasb: {QUESTIONS.length} savol · {CAREERS.length} kasb · ~4 daqiqa
        </span>
      </div>
    </div>
  )
}

export default SplashScreen