import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { useConsent } from '#/stores/consent'

const CHOICE_TEXT = {
  loading: 'Loading your choice…',
  none: 'You have not chosen yet.',
  accepted: 'You accepted. We remember your preferences on this device.',
  declined: 'You declined. We remember nothing beyond what the site needs.',
} as const

export function CookieSettings() {
  const { status, settingsOpen, closeSettings, accept, decline, forgetDetails } =
    useConsent()

  return (
    <Dialog open={settingsOpen} onOpenChange={(o) => !o && closeSettings()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cookie settings</DialogTitle>
          <DialogDescription>{CHOICE_TEXT[status]}</DialogDescription>
        </DialogHeader>
        <p className="text-sm">
          Necessary storage keeps your cart and this choice. Preferences are your
          city, saved events, theme and checkout phone and email. Declining
          deletes them. We do not track you or show ads.{' '}
          <a
            href="/cookies"
            onClick={closeSettings}
            className="underline underline-offset-2"
          >
            Read about cookies
          </a>
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="min-h-11" onClick={accept} disabled={status === 'accepted'}>
            Accept
          </Button>
          <Button
            variant="outline"
            className="min-h-11"
            onClick={decline}
            disabled={status === 'declined'}
          >
            Decline
          </Button>
          <Button variant="outline" className="min-h-11" onClick={forgetDetails}>
            Forget my details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
