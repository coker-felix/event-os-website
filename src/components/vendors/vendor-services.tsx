import { formatPrice } from '#/features/events/money'
import { serviceKindLabel } from '#/features/vendors/callouts'
import type { VendorService } from '#/features/vendors/types'

/** The vendor's service catalog. A price shows only when the vendor set one. */
export function VendorServices({ services }: { services: Array<VendorService> }) {
  return (
    <section aria-label="Services" className="mt-8">
      <h2 className="text-xl font-bold">Services</h2>
      {services.length === 0 ? (
        <p className="mt-2 text-mist">This vendor hasn't listed services yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-card">
          {services.map((s, i) => {
            const price = formatPrice(s.priceMinor, s.currency)
            return (
              <li
                key={`${s.name}-${i}`}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{s.name}</p>
                  {s.kind && (
                    <p className="text-sm text-mist">{serviceKindLabel(s.kind)}</p>
                  )}
                </div>
                {price && <p className="shrink-0 font-bold">{price}</p>}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
