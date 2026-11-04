import { Link } from '@tanstack/react-router'
import type { IssueNotice } from '#/features/checkout/changes'
import { CTA } from '#/lib/cta'

/** Says what went wrong or what changed, and what to do next. */
export function ChangeNotice({
  notice,
  changes,
  onAcknowledge,
  onRetry,
}: {
  notice: IssueNotice
  changes: Array<string>
  onAcknowledge: () => void
  onRetry: () => void
}) {
  return (
    <div
      role="alert"
      className="rounded-2xl border-2 border-flame bg-secondary p-4"
    >
      <p className="font-semibold">{notice.message}</p>
      {changes.length > 0 && (
        <ul className="mt-2 list-disc pl-5 text-sm">
          {changes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap gap-3">
        {notice.needsConfirm && (
          <button
            type="button"
            onClick={onAcknowledge}
            className={`${CTA.ink}`}
          >
            Got it
          </button>
        )}
        {notice.retry && (
          <button
            type="button"
            onClick={onRetry}
            className={`${CTA.ink}`}
          >
            Try again
          </button>
        )}
        {notice.contactLink && (
          <Link
            to="/contact"
            className={`${CTA.outline}`}
          >
            Contact us
          </Link>
        )}
      </div>
    </div>
  )
}
