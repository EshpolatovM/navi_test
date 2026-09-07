import { ArrowRight } from 'lucide-react'
import { CAREERS, QUESTIONS, STAGES } from '../data'

function SplashScreen({ onStart }: { onStart: () => void }) {
  const featured = CAREERS.slice(0, 6)

  return (
    <div className="animate-question-in mx-auto w-full max-w-[640px]">
      <div className="rounded-3xl bg-white/90 p-8 text-center shadow-[0_20px_50px_rgba(30,41,59,0.12)] ring-1 ring-white/70 backdrop-blur md:p-12">
        <div className="animate-bubble-in mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[0_12px_28px_rgba(37,99,235,0.45)] md:size-20">
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-extrabold tracking-[-0.01em] text-slate-900 md:text-[2rem]">
          Sizga mos keladigan kasblarni <span className="text-blue-600">toping</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-slate-600">
          4 ta bosqichda — qiziqishlar, faoliyatlar, ish uslubi va ish muhiti —
          {QUESTIONS.length} ta qisqa savolga javob bering. Javoblaringizni {CAREERS.length} ta
          kasb profili bilan taqqoslab, siz uchun eng kuchli yo\u2018nalishlarni tartiblaymiz.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {STAGES.map((s, i) => (
            <div
              key={s.key}
              className="animate-slide-up flex items-center gap-1.5 rounded-full px-3 py-1.5 ring-1 ring-slate-200"
              style={{ animationDelay: `${150 + i * 80}ms` }}
            >
              <span className="text-[11px] font-bold tracking-[0.08em] text-blue-600">
                {String(s.from).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-bold tracking-[0.08em] text-slate-500">{s.key}</span>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {featured.map((career, i) => (
            <div
              key={career.id}
              className="animate-slide-up flex items-center gap-2 rounded-full px-3.5 py-1.5 ring-1"
              style={{
                background: `${career.color}0d`,
                borderColor: `${career.color}33`,
                animationDelay: `${200 + i * 90}ms`,
              }}
            >
              <career.icon style={{ width: 15, height: 15, color: career.color }} strokeWidth={2.2} />
              <span className="text-[13px] font-semibold text-slate-700">{career.name}</span>
            </div>
          ))}
          <div className="animate-slide-up rounded-full px-3.5 py-1.5 ring-1 ring-slate-200" style={{ animationDelay: '740ms' }}>
            <span className="text-[13px] font-semibold text-slate-500">va yana {CAREERS.length - featured.length} tasi</span>
          </div>
        </div>

        <div className="mt-9">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-9 text-sm font-bold uppercase tracking-[0.06em] text-white shadow-[0_12px_28px_-8px_rgba(37,99,235,0.6)] transition-all duration-200 ease-out select-none hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0 active:scale-[0.99]"
          >
            Quizni boshlash
            <ArrowRight className="size-4" />
          </button>
          <p className="mt-3 text-xs font-medium text-slate-400">
            {STAGES.length} ta bosqich · {QUESTIONS.length} ta savol · taxminan 4 daqiqa ·
            ro\u2018yxatdan o\u2018tish shart emas
          </p>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen