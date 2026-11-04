import { useEffect, useRef } from 'react'
import { prefersReducedMotion, staggerDelay } from '#/lib/motion'
import type { ElementType, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Position in a group, for a short stagger. */
  delayIndex?: number
  className?: string
  as?: ElementType
}

/**
 * Eases content in as it scrolls into view. It is visible on the server and on
 * first paint, so nothing is hidden without JavaScript or above the fold.
 * After mount, only content below the viewport is hidden, then shown once.
 * With reduced motion, or without IntersectionObserver, it does nothing.
 */
export function Reveal({
  children,
  delayIndex = 0,
  className,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    if (typeof IntersectionObserver === 'undefined') return
    // In or above the viewport already: leave it alone.
    if (el.getBoundingClientRect().top < window.innerHeight) return

    el.style.transitionDelay = `${staggerDelay(delayIndex)}ms`
    el.dataset.reveal = 'hidden'
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        el.dataset.reveal = 'shown'
        io.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      // Never leave content hidden if this unmounts or re-runs.
      el.dataset.reveal = 'shown'
    }
  }, [delayIndex])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
