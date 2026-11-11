/** EventRail's junction mark, paired with the wordmark. */
export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-7 shrink-0"
      viewBox="0 0 256 256"
      fill="none"
    >
      <g fill={light ? '#FFFFFF' : '#176B5B'}>
        <rect x="112" y="24" width="32" height="208" rx="16" />
        <rect x="24" y="112" width="208" height="32" rx="16" />
      </g>
      <circle cx="128" cy="128" r="28" fill="#E8B34B" />
    </svg>
  )
}
