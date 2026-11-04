export function ShellPage({
  title,
  children,
}: {
  title: string
  children?: React.ReactNode
}) {
  return (
    <section>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-3 text-muted-foreground">Welcome to the {title}.</p>
      {children}
    </section>
  )
}
