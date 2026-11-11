import type { ProductId } from '#/config/products'

const PREVIEWS: Record<
  ProductId,
  { eyebrow: string; title: string; body: string; image: string; alt: string }
> = {
  attendees: {
    eyebrow: 'A better way to go out',
    title: 'From discovery to the door, it all connects.',
    body: 'Explore events, choose your tickets and keep your plans together in one simple place.',
    image: '/media/attendee-preview.svg',
    alt: 'Illustrative EventRail event discovery page with search and featured events',
  },
  organizers: {
    eyebrow: 'The organizer workspace',
    title: 'See the whole event at a glance.',
    body: 'Track sales, guest check-ins, budgets and the work still to do from one clear dashboard.',
    image: '/media/organizer-preview.svg',
    alt: 'Illustrative EventRail organizer dashboard with ticket sales, revenue and event status',
  },
  vendors: {
    eyebrow: 'The vendor workspace',
    title: 'Good opportunities, easier to find.',
    body: 'Browse relevant event callouts, review the details and keep your applications and bookings moving.',
    image: '/media/vendor-preview.svg',
    alt: 'Illustrative EventRail vendor workspace showing event callouts and application actions',
  },
  venues: {
    eyebrow: 'The venue workspace',
    title: 'One operations hub for every kind of venue activity.',
    body: 'Bring bookings from EventRail, other platforms and AI tools together with private events and seat charts. A public listing is optional.',
    image: '/media/venue-preview.svg',
    alt: 'Illustrative EventRail venue calendar with internal, external and confirmed booking examples',
  },
}

/** Replace the local SVG preview with a product screenshot or video when ready. */
export function ProductShowcase({ product }: { product: ProductId }) {
  const preview = PREVIEWS[product]

  return (
    <section
      aria-labelledby={`${product}-preview-title`}
      className="mt-16 grid items-center gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12"
    >
      <div className="max-w-md">
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          {preview.eyebrow}
        </p>
        <h2
          id={`${product}-preview-title`}
          className="mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
        >
          {preview.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">{preview.body}</p>
      </div>

      <figure className="overflow-hidden rounded-2xl border border-line bg-secondary p-2 shadow-[0_20px_60px_-36px_rgba(16,37,29,0.45)] sm:p-3">
        <img
          src={preview.image}
          alt={preview.alt}
          width="1200"
          height="675"
          className="block aspect-[16/9] w-full rounded-xl object-cover"
        />
        <figcaption className="flex flex-wrap items-center justify-between gap-2 px-2 pt-3 pb-1 text-xs text-mist sm:px-3">
          <span>Illustrative product preview</span>
          <span className="rounded-full bg-card px-2.5 py-1 font-medium text-foreground">
            Demo content
          </span>
        </figcaption>
      </figure>
    </section>
  )
}
