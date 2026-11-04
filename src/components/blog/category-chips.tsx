/** "All" plus one chip per category. Scrolls sideways on a phone. */
export function CategoryChips({
  categories,
  active,
  onSelect,
}: {
  categories: Array<string>
  active: string | undefined
  onSelect: (category: string | undefined) => void
}) {
  if (categories.length === 0) return null
  const chip = (label: string, value: string | undefined) => {
    const on = active === value
    return (
      <li key={label} className="shrink-0">
        <button
          type="button"
          aria-pressed={on}
          onClick={() => onSelect(value)}
          className={
            on
              ? 'h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white'
              : 'h-11 rounded-full border border-line bg-card px-5 text-sm font-semibold hover:border-ink'
          }
        >
          {label}
        </button>
      </li>
    )
  }
  return (
    <ul
      aria-label="Categories"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
    >
      {chip('All', undefined)}
      {categories.map((c) => chip(c, c))}
    </ul>
  )
}
