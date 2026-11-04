import type { QuestionAnswer } from '#/features/checkout/validation'
import type { Question } from '#/features/tickets/types'

export type Answers = Record<string, Omit<QuestionAnswer, 'questionId'>>

const FIELD = 'mt-1 w-full rounded-xl border border-line bg-card px-4 text-base'

function QuestionField({
  q,
  answer,
  onChange,
  error,
}: {
  q: Question
  answer: Answers[string] | undefined
  onChange: (patch: Answers[string]) => void
  error?: string
}) {
  const a = answer ?? {}
  const label = (
    <span className="text-sm font-semibold">
      {q.label}
      {q.required && q.type !== 'waiver' && (
        <span className="text-mist"> (required)</span>
      )}
    </span>
  )
  let control: React.ReactNode
  switch (q.type) {
    case 'long_text':
      control = (
        <textarea
          value={a.text ?? ''}
          onChange={(e) => onChange({ text: e.target.value })}
          rows={3}
          className={`${FIELD} py-3`}
        />
      )
      break
    case 'short_text':
      control = (
        <input
          type="text"
          value={a.text ?? ''}
          onChange={(e) => onChange({ text: e.target.value })}
          className={`${FIELD} h-12`}
        />
      )
      break
    case 'date':
      control = (
        <input
          type="date"
          value={a.date ?? ''}
          onChange={(e) => onChange({ date: e.target.value })}
          className={`${FIELD} h-12`}
        />
      )
      break
    case 'single_select':
      control = (
        <div className="mt-1 space-y-2">
          {(q.options ?? []).map((o) => (
            <label key={o} className="flex min-h-12 items-center gap-3 rounded-xl border border-line px-4 text-sm">
              <input
                type="radio"
                name={q.id}
                checked={a.options?.[0] === o}
                onChange={() => onChange({ options: [o] })}
                className="size-5 accent-violet"
              />
              {o}
            </label>
          ))}
        </div>
      )
      break
    case 'multi_select':
      control = (
        <div className="mt-1 space-y-2">
          {(q.options ?? []).map((o) => {
            const chosen = a.options ?? []
            return (
              <label key={o} className="flex min-h-12 items-center gap-3 rounded-xl border border-line px-4 text-sm">
                <input
                  type="checkbox"
                  checked={chosen.includes(o)}
                  onChange={() =>
                    onChange({
                      options: chosen.includes(o)
                        ? chosen.filter((x) => x !== o)
                        : [...chosen, o],
                    })
                  }
                  className="size-5 accent-violet"
                />
                {o}
              </label>
            )
          })}
        </div>
      )
      break
    case 'boolean':
      control = (
        <div className="mt-1 flex gap-3">
          {([true, false] as const).map((v) => (
            <label key={String(v)} className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-line px-4 text-sm font-semibold">
              <input
                type="radio"
                name={q.id}
                checked={a.boolValue === v}
                onChange={() => onChange({ boolValue: v })}
                className="size-5 accent-violet"
              />
              {v ? 'Yes' : 'No'}
            </label>
          ))}
        </div>
      )
      break
    case 'waiver':
      return (
        <div>
          <p className="whitespace-pre-line rounded-xl bg-secondary p-4 text-sm">
            {q.waiverText}
          </p>
          <label className="mt-2 flex min-h-12 items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={a.waiverAccepted === true}
              onChange={(e) => onChange({ waiverAccepted: e.target.checked })}
              aria-invalid={!!error}
              className="size-5 accent-violet"
            />
            {q.label}
          </label>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
      )
  }
  return (
    <div>
      <label className="block">
        {label}
        {control}
      </label>
      {error && (
        <p role="alert" className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

/** The event's questionnaire. Rendered only when the event has questions. */
export const QuestionsSection = ({
  questions,
  answers,
  onAnswer,
  errors,
  sectionRef,
}: {
  questions: Array<Question>
  answers: Answers
  onAnswer: (id: string, patch: Answers[string]) => void
  errors: Record<string, string>
  sectionRef?: React.Ref<HTMLElement>
}) => {
  if (questions.length === 0) return null
  return (
    <section
      ref={sectionRef}
      aria-label="A few questions"
      className="rounded-2xl border border-line bg-card p-5"
    >
      <h2 className="text-lg font-bold">A few questions</h2>
      <div className="mt-4 space-y-5">
        {questions.map((q) => (
          <QuestionField
            key={q.id}
            q={q}
            answer={answers[q.id]}
            onChange={(patch) => onAnswer(q.id, patch)}
            error={errors[q.id]}
          />
        ))}
      </div>
    </section>
  )
}
