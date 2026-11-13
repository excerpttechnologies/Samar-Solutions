import { cn } from '@/lib/utils'

export function Section({
  children,
  className,
  containerClassName,
  tone = 'default',
  id,
  labelledBy,
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  tone?: 'default' | 'muted' | 'ink' | 'soft'
  id?: string
  labelledBy?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'relative overflow-hidden py-20 md:py-28 lg:py-32',
        tone === 'default' && 'bg-[linear-gradient(180deg,#ddebe1_0%,#e8dcc4_100%)]',
        tone === 'muted' && 'bg-[linear-gradient(135deg,#d8e7dc_0%,#cfe3d8_50%,#e6dcc7_100%)]',
        tone === 'soft' && 'bg-[linear-gradient(135deg,#cfe7df_0%,#ddebe1_45%,#e8dcc4_100%)]',
        tone === 'ink' && 'bg-gradient-to-br from-[#062d24] via-[#0b3a31] to-[#151c1b] text-ink-foreground',
        className,
      )}
    >
      <div className={cn('mx-auto max-w-7xl px-4 md:px-6', containerClassName)}>{children}</div>
    </section>
  )
}

export function Eyebrow({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'ink' }) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em]',
        tone === 'ink' ? 'text-accent' : 'text-primary',
      )}
    >
      <span aria-hidden="true" className={cn('h-px w-10', tone === 'ink' ? 'bg-accent/70' : 'bg-accent')} />
      {children}
    </p>
  )
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  tone = 'default',
  align = 'left',
  className,
}: {
  id?: string
  eyebrow?: string
  title: string
  intro?: string
  tone?: 'default' | 'ink'
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className={cn(
          'mt-5 text-3xl font-extrabold leading-[1.08] tracking-tight md:text-4xl lg:text-5xl',
          tone === 'ink' ? 'text-ink-foreground' : 'text-foreground',
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            'mt-5 text-pretty text-base leading-relaxed md:text-lg',
            tone === 'ink' ? 'text-ink-foreground/72' : 'text-muted-foreground',
            align === 'center' && 'mx-auto max-w-2xl',
          )}
        >
          {intro}
        </p>
      )}
    </div>
  )
}

