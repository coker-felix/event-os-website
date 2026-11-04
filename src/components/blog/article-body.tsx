import { articleParagraphs } from '#/features/blog/utils'

/** Plain-text body as paragraphs. Never raw HTML, so post text cannot inject markup. */
export function ArticleBody({ body }: { body: string }) {
  const paragraphs = articleParagraphs(body)
  if (paragraphs.length === 0) return null
  return (
    <div className="mt-8 space-y-5 text-[18px] leading-relaxed sm:text-lg">
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  )
}
