type Audience = 'organizers'

const COPY: Record<Audience, { eyebrow: string; title: string; body: string }> = {
  organizers: {
    eyebrow: 'For event organizers',
    title: 'Plan the room before tickets go on sale.',
    body: 'Build a seat chart, organize sections and connect the layout to your ticket types, so guests know exactly where they are booking.',
  },
}

const SEATS = Array.from({ length: 36 }, (_, index) => ({
  x: 116 + (index % 9) * 38,
  y: 118 + Math.floor(index / 9) * 32,
  fill: index % 9 < 3 ? '#DCEFE4' : index % 9 > 6 ? '#F7E9CE' : '#E9ECE8',
}))

/** An upcoming seating-map concept for organizers. Venue seat charts are available in their portal. */
export function UpcomingFeature({ audience }: { audience: Audience }) {
  const copy = COPY[audience]

  return (
    <section
      aria-labelledby={`${audience}-seat-map-title`}
      className="mt-16 grid gap-8 overflow-hidden rounded-3xl bg-ink p-6 text-white sm:p-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12"
    >
      <div>
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/85 uppercase">
          Coming soon
        </span>
        <p className="mt-5 text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">
          {copy.eyebrow}
        </p>
        <h2
          id={`${audience}-seat-map-title`}
          className="mt-2 max-w-lg text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
        >
          {copy.title}
        </h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75">
          {copy.body}
        </p>
        <p className="mt-5 text-sm font-medium text-white/55">
          Seat charts &amp; venue maps
        </p>
      </div>

      <figure className="rounded-2xl bg-white p-3 text-ink shadow-xl sm:p-5">
        <svg
          viewBox="0 0 560 300"
          role="img"
          aria-label="Illustrative venue seating map with stage and three seating sections"
          className="w-full"
        >
          <rect x="1" y="1" width="558" height="298" rx="14" fill="#F7F8F6" />
          <path d="M195 30h170a10 10 0 0 1 10 10v37H185V40a10 10 0 0 1 10-10Z" fill="#10251D" />
          <text x="280" y="59" fill="#FFFFFF" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" textAnchor="middle">STAGE</text>
          <text x="165" y="107" fill="#167A55" fontFamily="Arial,sans-serif" fontSize="10" fontWeight="700" textAnchor="middle">SECTION A</text>
          <text x="280" y="107" fill="#647168" fontFamily="Arial,sans-serif" fontSize="10" fontWeight="700" textAnchor="middle">SECTION B</text>
          <text x="395" y="107" fill="#9A7029" fontFamily="Arial,sans-serif" fontSize="10" fontWeight="700" textAnchor="middle">SECTION C</text>
          {SEATS.map((seat, index) => (
            <rect
              key={index}
              x={seat.x}
              y={seat.y}
              width="22"
              height="18"
              rx="5"
              fill={seat.fill}
              stroke="#DDE2DA"
            />
          ))}
          <path d="M65 260h430" stroke="#DDE2DA" strokeDasharray="4 5" />
          <circle cx="221" cy="279" r="5" fill="#167A55" />
          <text x="233" y="283" fill="#647168" fontFamily="Arial,sans-serif" fontSize="10">Available</text>
          <circle cx="310" cy="279" r="5" fill="#D9A643" />
          <text x="322" y="283" fill="#647168" fontFamily="Arial,sans-serif" fontSize="10">Reserved</text>
          <circle cx="403" cy="279" r="5" fill="#AEB7B0" />
          <text x="415" y="283" fill="#647168" fontFamily="Arial,sans-serif" fontSize="10">Selected</text>
        </svg>
        <figcaption className="px-1 pt-2 text-xs text-mist">
          Illustrative seat chart · Demo layout
        </figcaption>
      </figure>
    </section>
  )
}
