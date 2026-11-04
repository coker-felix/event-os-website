import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { BillingSection } from '#/components/checkout/billing-section'
import { ChangeNotice } from '#/components/checkout/change-notice'
import { ContactSection } from '#/components/checkout/contact-section'
import { PayBar, PayButton } from '#/components/checkout/pay-bar'
import { QuestionsSection } from '#/components/checkout/questions-section'
import { Summary } from '#/components/checkout/summary'
import { checkoutCart, getCart } from '#/features/checkout/api'
import {
  checkoutFingerprint,
  describeCartChange,
  issueNotice,
  needsBillingCountry,
} from '#/features/checkout/changes'
import { createAttemptTracker } from '#/features/checkout/attempt'
import { countriesQuery } from '#/features/checkout/countries'
import { classifyCheckoutError } from '#/features/checkout/errors'
import {
  validateAnswers,
  validateContact,
} from '#/features/checkout/validation'
import { formatEventWhen, toDate } from '#/features/events/format'
import { eventPageQuery } from '#/features/tickets/queries'
import { useCarts } from '#/stores/carts'
import { safeHttpsUrl } from '#/lib/url'
import { useCartsHydrated } from '#/stores/use-carts-hydrated'
import type { Answers } from '#/components/checkout/questions-section'
import type { ContactErrors, ContactValue } from '#/components/checkout/contact-section'
import type { IssueNotice } from '#/features/checkout/changes'
import type { Cart } from '#/features/checkout/types'
import type { StoredCart } from '#/stores/carts'
import type { PublicQuestionnaire } from '#/features/tickets/types'

export const Route = createFileRoute('/_attendee/events/$eventId/checkout')({
  head: () => ({
    meta: [
      { title: 'Checkout | Event OS' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: CheckoutPage,
})

function asQuestionnaire(v: unknown): PublicQuestionnaire | undefined {
  if (!v || typeof v !== 'object') return undefined
  const q = v as { versionId?: unknown; questions?: unknown }
  return typeof q.versionId === 'string' && Array.isArray(q.questions)
    ? (v as PublicQuestionnaire)
    : undefined
}

function Message({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-6" role="status">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-mist">{body}</p>
      <div className="mt-4">{action}</div>
    </div>
  )
}

function CheckoutPage() {
  const { eventId } = Route.useParams()
  const navigate = Route.useNavigate()
  const queryClient = useQueryClient()
  const hydrated = useCartsHydrated()
  const stored = useCarts((s): StoredCart | undefined => s.byEvent[eventId])
  const clearCart = useCarts((s) => s.clearCart)

  const pageQuery = useQuery(eventPageQuery(eventId))
  const countries = useQuery(countriesQuery)
  const cartKey = ['cart', stored?.cartId] as const
  const fetchCart = () => getCart(stored?.cartId ?? '', stored?.token ?? '')
  const cartQuery = useQuery({
    queryKey: cartKey,
    queryFn: fetchCart,
    enabled: !!stored,
    retry: false,
    staleTime: 0,
  })

  const [contact, setContact] = useState<ContactValue>({
    phone: '',
    email: '',
    delivery: 'sms',
  })
  const [answers, setAnswers] = useState<Answers>({})
  const [country, setCountry] = useState('')
  const [contactErrors, setContactErrors] = useState<ContactErrors>({})
  const [answerErrors, setAnswerErrors] = useState<Record<string, string>>({})
  const [countryError, setCountryError] = useState<string | undefined>()
  const [notice, setNotice] = useState<IssueNotice | null>(null)
  const [changes, setChanges] = useState<Array<string>>([])
  const [confirmNeeded, setConfirmNeeded] = useState(false)
  const [freshQuestionnaire, setFreshQuestionnaire] = useState<
    PublicQuestionnaire | undefined
  >()
  const [busy, setBusy] = useState(false)
  const tracker = useMemo(() => createAttemptTracker(), [])
  const questionsRef = useRef<HTMLElement>(null)
  const prefilled = useRef(false)

  const cart = cartQuery.data
  // Start the form from what the cart already knows, once.
  useEffect(() => {
    if (!cart || prefilled.current) return
    prefilled.current = true
    setContact({
      phone: cart.contactPhone ?? '',
      email: cart.contactEmail ?? '',
      delivery:
        cart.preferredDeliveryChannel ||
        (cart.contactPhone ? 'sms' : cart.contactEmail ? 'email' : 'sms'),
    })
  }, [cart])

  const page = pageQuery.data
  const names = useMemo(
    () => new Map((page?.ticketTypes ?? []).map((t) => [t.id, t.name] as const)),
    [page],
  )

  const expiredAction = (
    <Link
      to="/events/$eventId"
      params={{ eventId }}
      className="inline-flex h-12 items-center rounded-full bg-violet px-6 font-semibold text-white"
    >
      Pick your tickets again
    </Link>
  )

  if (!hydrated || (stored && (cartQuery.isPending || pageQuery.isPending))) {
    return <p className="text-mist" role="status">Loading your order…</p>
  }
  if (!stored) {
    return (
      <Message
        title="Your cart expired"
        body="Pick your tickets again to continue."
        action={expiredAction}
      />
    )
  }
  if (
    cartQuery.isError &&
    classifyCheckoutError(cartQuery.error).kind === 'cart_missing'
  ) {
    clearCart(eventId)
    return (
      <Message
        title="Your cart expired"
        body="Pick your tickets again to continue."
        action={expiredAction}
      />
    )
  }
  if (cartQuery.isError || pageQuery.isError || !cart || !page) {
    return (
      <Message
        title="We couldn't load your order"
        body="Check your connection, then try again."
        action={
          <button
            type="button"
            onClick={() => {
              void cartQuery.refetch()
              void pageQuery.refetch()
            }}
            className="h-12 rounded-full bg-violet px-6 font-semibold text-white"
          >
            Try again
          </button>
        }
      />
    )
  }
  if (cart.status !== 'active') {
    return (
      <Message
        title={cart.orderId ? 'This order was already placed' : 'Your cart expired'}
        body={
          cart.orderId
            ? 'Check the status of your payment.'
            : 'Pick your tickets again to continue.'
        }
        action={
          cart.orderId ? (
            <Link
              to="/checkout/return"
              search={{ order: cart.orderId }}
              className="inline-flex h-12 items-center rounded-full bg-violet px-6 font-semibold text-white"
            >
              See my order
            </Link>
          ) : (
            expiredAction
          )
        }
      />
    )
  }

  const event = page.event
  const questionnaire = freshQuestionnaire ?? page.questionnaire
  const questions = questionnaire?.questions ?? []
  const billingNeeded = needsBillingCountry(page.ticketTypes, cart)
  const total = cart.subtotalMinor ?? 0
  const payLabel = confirmNeeded
    ? 'Confirm to pay'
    : total === 0
      ? 'Get free tickets'
      : 'Pay with Paystack'
  const start = toDate(event.startsAt)
  const place = [event.venueName, event.city]
    .filter((x, i, a) => x && a.indexOf(x) === i)
    .join(', ')

  async function onPay(current: Cart) {
    // Pressing "Confirm to pay" is the confirmation.
    setConfirmNeeded(false)

    const contactResult = validateContact({
      phone: contact.phone,
      email: contact.email,
    })
    const aErrors = validateAnswers(questions, answers)
    const cErr =
      billingNeeded && !country ? 'Choose your billing country.' : undefined
    setContactErrors(contactResult.ok ? {} : contactResult.errors)
    setAnswerErrors(aErrors)
    setCountryError(cErr)
    if (!contactResult.ok || Object.keys(aErrors).length > 0 || cErr) return

    setBusy(true)
    setNotice(null)
    setChanges([])
    const answerList = Object.entries(answers).map(([questionId, a]) => ({
      questionId,
      ...a,
    }))
    try {
      const key = tracker.keyFor(
        checkoutFingerprint({
          cartId: current.id,
          quoteRevision: current.quoteRevision ?? '',
          phone: contactResult.phone ?? '',
          email: contactResult.email ?? '',
          delivery: contact.delivery,
          billingCountry: billingNeeded ? country : '',
          answers,
        }),
      )
      const result = await checkoutCart(
        current.id,
        stored?.token ?? '',
        {
          contactPhone: contactResult.phone,
          contactEmail: contactResult.email,
          expectedQuoteRevision: current.quoteRevision ?? '',
          ...(billingNeeded ? { billingCountry: country } : {}),
          ...(questionnaire
            ? { questionnaireVersionId: questionnaire.versionId, answers: answerList }
            : {}),
          deliveryChannel: contact.delivery,
        },
        key,
      )
      if (result.authorization_url) {
        // Off to Paystack; the cart stays until the payment is confirmed.
        const payUrl = safeHttpsUrl(result.authorization_url)
        if (!payUrl) {
          setNotice(issueNotice({ kind: 'unknown' }))
          setBusy(false)
          return
        }
        window.location.assign(payUrl)
        return
      }
      clearCart(eventId)
      await navigate({ to: '/checkout/return', search: { order: result.order_id } })
    } catch (err) {
      const issue = classifyCheckoutError(err)
      const next = issueNotice(issue)
      setNotice(next)
      if (next.clearCart) clearCart(eventId)
      if (next.refreshCart) {
        try {
          const after = await queryClient.fetchQuery({
            queryKey: cartKey,
            queryFn: fetchCart,
            staleTime: 0,
          })
          setChanges(describeCartChange(current, after, names))
          setConfirmNeeded(true)
        } catch {
          // The refresh failed too; the notice already says what happened.
        }
      }
      if (issue.kind === 'questionnaire_stale') {
        setFreshQuestionnaire(asQuestionnaire(issue.questionnaire))
        setAnswers({})
        window.setTimeout(
          () => questionsRef.current?.scrollIntoView({ behavior: 'smooth' }),
          0,
        )
      }
      setBusy(false)
    }
  }

  const pay = () => void onPay(cart)
  const button = <PayButton label={payLabel} busy={busy} onPay={pay} />

  return (
    <div className="pb-28 lg:pb-0">
      <Link
        to="/events/$eventId"
        params={{ eventId }}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to event
      </Link>
      <h1 className="mt-2 text-3xl font-bold">Checkout</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <section
            aria-label="Your event"
            className="rounded-2xl border border-line bg-card p-5"
          >
            <h2 className="text-lg font-bold">{event.title}</h2>
            <p className="mt-1 text-sm text-mist">
              {[start && formatEventWhen(start, event.timezone), place]
                .filter(Boolean)
                .join(' · ')}
            </p>
            <Link
              to="/events/$eventId"
              params={{ eventId }}
              className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-violet-ink hover:underline"
            >
              Edit tickets
            </Link>
          </section>

          {notice && (
            <ChangeNotice
              notice={notice}
              changes={changes}
              onAcknowledge={() => {
                setConfirmNeeded(false)
                setNotice(null)
                setChanges([])
              }}
              onRetry={pay}
            />
          )}

          <ContactSection
            value={contact}
            onChange={setContact}
            errors={contactErrors}
          />
          <QuestionsSection
            questions={questions}
            answers={answers}
            onAnswer={(id, patch) =>
              setAnswers((a) => ({ ...a, [id]: { ...a[id], ...patch } }))
            }
            errors={answerErrors}
            sectionRef={questionsRef}
          />
          {billingNeeded && (
            <BillingSection
              countries={countries.data ?? []}
              value={country}
              onChange={setCountry}
              error={countryError}
            />
          )}
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <Summary cart={cart} action={button} />
        </div>
      </div>

      <PayBar
        totalMinor={total}
        currency={cart.currency}
        label={payLabel}
        busy={busy}
        onPay={pay}
      />
    </div>
  )
}
