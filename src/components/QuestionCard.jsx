import { useState } from 'react'
import { CircleHelp, ChevronRight, Check, X } from 'lucide-react'

const LETTERS = ['A', 'B', 'C', 'D']

function QuestionCard({
  question = '',
  options = [],
  selectedOption = null,
  onSelect,
  correctIndex = null,
  currentQuestion = 1,
  totalQuestions = options.length || 1,
  onNext,
}) {
  const [revealed, setRevealed] = useState(false)

  const progress = Math.round((currentQuestion / totalQuestions) * 100)

  const handleSelect = (index) => {
    if (selectedOption !== null) return
    onSelect?.(index)
  }

  const handleReveal = () => {
    if (selectedOption === null || revealed) return
    setRevealed(true)
    window.setTimeout(() => onNext?.(), 1300)
  }

  return (
    <div className="w-full">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)] md:text-sm">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold text-[var(--accent)] md:text-sm">
            {progress}%
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)] ring-1 ring-[var(--border)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--accent-dark)] to-[var(--accent)] shadow-[0_0_12px_rgba(245,197,66,0.45)] transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="animate-card-in relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)] md:p-11">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="mb-9 flex items-center gap-4">
          <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] ring-1 ring-[var(--accent)]/30">
            <CircleHelp className="size-6" strokeWidth={2.25} />
          </span>
          <h2 className="text-2xl font-bold leading-tight text-[var(--text-primary)] md:text-[2rem] md:leading-[1.2]">
            {question}
          </h2>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3.5">
          {options.map((option, index) => {
            const selected = selectedOption === index
            const isAnswer = correctIndex === index
            const showCorrect = revealed && isAnswer
            const showWrong = revealed && selected && !isAnswer
            const dimmed = revealed && !isAnswer

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(index)}
                aria-pressed={selected}
                className={`group relative flex min-h-16 w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-200 ease-out md:min-h-18 md:px-5 ${
                  revealState({ showCorrect, showWrong, selected, revealed })
                } ${
                  revealed
                    ? 'pointer-events-none cursor-default'
                    : 'hover:-translate-y-0.5 active:scale-[0.99]'
                } ${dimmed ? 'opacity-40' : ''} ${showWrong ? 'animate-shake' : ''} ${
                  showCorrect ? 'animate-pop-in' : ''
                }`}
                style={
                  showCorrect
                    ? { '--ring-color': 'rgba(76,175,109,0.5)' }
                    : undefined
                }
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors duration-200 ${
                    badgeState({ showCorrect, showWrong, selected, revealed })
                  }`}
                >
                  {showCorrect ? (
                    <Check className="size-5" strokeWidth={3} />
                  ) : showWrong ? (
                    <X className="size-5" strokeWidth={3} />
                  ) : (
                    LETTERS[index]
                  )}
                </span>
                <span
                  className={`text-base font-semibold md:text-lg ${
                    textColor({ showCorrect, showWrong, selected, revealed })
                  }`}
                >
                  {option}
                </span>
                {showCorrect && (
                  <span
                    className="animate-pop-in ml-auto grid size-8 shrink-0 place-items-center rounded-full bg-[var(--success)] text-white"
                    style={{ '--ring-color': 'rgba(76,175,109,0.5)' }}
                  >
                    <Check className="size-4.5" strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Next */}
        <div className={`mt-9 ${revealed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          <button
            type="button"
            onClick={handleReveal}
            disabled={selectedOption === null}
            className={`inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl px-8 text-base font-bold uppercase tracking-[0.06em] transition-all duration-200 ease-out select-none md:w-auto md:float-right ${
              selectedOption === null
                ? 'cursor-not-allowed bg-[var(--bg-elevated)] text-[var(--text-secondary)]/50'
                : 'bg-gradient-to-b from-[#ffd95e] to-[var(--accent)] text-[#141005] shadow-[0_10px_30px_-10px_rgba(245,197,66,0.7)] hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-10px_rgba(245,197,66,0.75)] active:translate-y-0 active:scale-[0.99]'
            }`}
          >
            Next
            <ChevronRight className="size-5" strokeWidth={2.75} />
          </button>
        </div>
      </div>
    </div>
  )
}

function revealState({ showCorrect, showWrong, selected, revealed }) {
  if (showCorrect) {
    return 'border-[var(--success)] bg-[rgba(76,175,109,0.15)] shadow-[0_0_28px_-6px_rgba(76,175,109,0.5)]'
  }
  if (showWrong) {
    return 'border-[var(--danger)] bg-[rgba(239,106,90,0.13)] shadow-[0_0_28px_-6px_rgba(239,106,90,0.5)]'
  }
  if (!revealed && selected) {
    return 'border-[var(--accent)] bg-[rgba(245,197,66,0.1)] shadow-[0_0_34px_-10px_rgba(245,197,66,0.55)]'
  }
  if (!revealed) {
    return 'border-[var(--border)] bg-[var(--surface-hover)] group-hover:border-[rgba(245,197,66,0.35)] group-hover:bg-[#262c3a]'
  }
  return 'border-[var(--border)] bg-[var(--surface-hover)]'
}

function badgeState({ showCorrect, showWrong, selected, revealed }) {
  if (showCorrect) return 'bg-[var(--success)] text-white shadow-[0_0_18px_-2px_rgba(76,175,109,0.7)]'
  if (showWrong) return 'bg-[var(--danger)] text-white shadow-[0_0_18px_-2px_rgba(239,106,90,0.7)]'
  if (!revealed && selected) {
    return 'bg-[var(--accent)] text-[#141005] shadow-[0_0_18px_-2px_rgba(245,197,66,0.7)]'
  }
  if (!revealed) {
    return 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] ring-1 ring-[var(--border)] group-hover:text-[var(--text-primary)]'
  }
  return 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] ring-1 ring-[var(--border)]'
}

function textColor({ showCorrect, showWrong, selected, revealed }) {
  if (showCorrect) return 'text-[var(--text-primary)]'
  if (showWrong) return 'text-[var(--text-primary)]'
  if (!revealed && selected) return 'text-[var(--accent)]'
  return 'text-[var(--text-primary)]'
}

export default QuestionCard