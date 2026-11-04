import { MOCKS_ENABLED } from '#/lib/mocks'
import { TRUSTED_BRANDS } from '#/content/trusted-brands'
import { MOCK_TRUSTED } from '#/features/mocks/trusted'
import { visibleBrands } from '#/features/trusted/visible'
import type { TrustedBrand } from '#/features/trusted/visible'

const KIND_LABEL = { organizer: 'Organizer', brand: 'Brand', sponsor: 'Sponsor' } as const

function Tile({ brand }: { brand: TrustedBrand }) {
  const inner = (
    <>
      {brand.logo ? (
        <img
          src={brand.logo}
          alt={brand.name}
          loading="lazy"
          className="max-h-10 max-w-[70%] object-contain grayscale transition hover:grayscale-0"
        />
      ) : (
        <span className="px-3 text-center font-display text-lg leading-tight font-extrabold text-ink">
          {brand.name}
        </span>
      )}
      {brand.kind && (
        <span className="mt-2 text-[11px] font-medium text-neutral-500">{KIND_LABEL[brand.kind]}</span>
      )}
    </>
  )
  const cls = 'flex h-28 flex-col items-center justify-center bg-white'
  return brand.href ? (
    <a
      href={brand.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} hover:bg-neutral-50`}
    >
      {inner}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

/**
 * Partners Event OS has worked with. The list is static
 * (`src/content/trusted-brands.ts`); with no entries the section is hidden.
 * In dev, invented placeholders stand in so the design can be seen.
 */
export function TrustedBy() {
  const real = visibleBrands(TRUSTED_BRANDS)
  // The dev placeholders are our own code (inlined data: URLs), so they skip the
  // URL check that guards the real list.
  const brands = real.length > 0 ? real : MOCKS_ENABLED ? MOCK_TRUSTED : []
  if (brands.length === 0) return null
  return (
    <section aria-labelledby="trusted-h" className="mt-16">
      <h2 id="trusted-h" className="max-w-2xl text-2xl leading-tight font-extrabold sm:text-3xl">
        Trusted by the brands behind Africa's biggest nights
      </h2>
      <p className="mt-2 text-sm text-mist">
        Organizers, brands and sponsors we've worked with.
      </p>
      <ul
        className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))' }}
      >
        {brands.map((b) => (
          <li key={b.name} className="contents">
            <Tile brand={b} />
          </li>
        ))}
      </ul>
    </section>
  )
}
