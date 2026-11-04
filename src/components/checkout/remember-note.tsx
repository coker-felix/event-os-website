import { useConsent } from '#/stores/consent'

/** Says plainly whether we will remember these details, and how to undo it. */
export function RememberNote() {
  const status = useConsent((s) => s.status)
  const openSettings = useConsent((s) => s.openSettings)
  const forgetDetails = useConsent((s) => s.forgetDetails)

  // Nothing until the consent choice has loaded, so server and client match.
  if (status === 'loading') return null

  const button =
    'min-h-11 rounded-full px-3 text-sm font-semibold text-violet-ink underline underline-offset-2'

  return (
    <p className="-mt-2 flex flex-wrap items-center gap-x-2 px-1 text-sm text-mist">
      {status === 'accepted' ? (
        <>
          <span>We'll remember your phone and email on this device.</span>
          <button type="button" className={button} onClick={forgetDetails}>
            Forget my details
          </button>
        </>
      ) : (
        <>
          <span>
            Accept cookies and we'll remember your phone and email next time.
          </span>
          <button type="button" className={button} onClick={openSettings}>
            Cookie settings
          </button>
        </>
      )}
    </p>
  )
}
