/** EventRail's compact rail-and-signal mark, paired with the wordmark. */
export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-7 shrink-0 grid-cols-3 items-end gap-0.5 rounded-sm p-1 ${light ? 'bg-white/10' : 'bg-primary/10'}`}
    >
      <span className={`h-2/3 rounded-[1px] ${light ? 'bg-white/70' : 'bg-primary/60'}`} />
      <span className={`h-full rounded-[1px] ${light ? 'bg-white' : 'bg-primary'}`} />
      <span className={`h-1/2 rounded-[1px] ${light ? 'bg-[#E8B34B]' : 'bg-[#A96512]'}`} />
    </span>
  )
}
