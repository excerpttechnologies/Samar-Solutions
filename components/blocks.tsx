import { Check } from 'lucide-react'
import { projectJourney } from '@/lib/site'
import { cn } from '@/lib/utils'
import { CtaLink } from './cta-link'

export function ScopeGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <li
          key={item.title}
          className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_25px_60px_-40px_rgba(15,23,42,0.4)] md:p-8"
        >
          <div aria-hidden="true" className="absolute -right-8 -top-8 size-24 rounded-full bg-accent/10 blur-2xl transition-opacity group-hover:opacity-100" />
          <span className="inline-flex rounded-full bg-secondary px-3 py-1 font-mono text-[11px] font-semibold tracking-[0.14em] text-primary">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-5 text-lg font-bold leading-snug tracking-tight md:text-xl">{item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{item.body}</p>
        </li>
      ))}
    </ol>
  )
}

export function AudienceList({ items, columns = 3 }: { items: string[]; columns?: 2 | 3 }) {
  return (
    <ul className={cn('grid gap-3 sm:grid-cols-2', columns === 3 && 'lg:grid-cols-3')}>
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/70 px-4 py-4 text-sm font-medium leading-snug transition-colors hover:border-primary/20 hover:bg-secondary/30"
        >
          <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check aria-hidden="true" className="size-3.5" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

export function JourneySteps({ tone = 'default' }: { tone?: 'default' | 'ink' }) {
  const ink = tone === 'ink'
  return (
    <ol className="relative grid gap-6 md:grid-cols-5 md:gap-4">
      <div
        aria-hidden="true"
        className={cn(
          'absolute left-5 top-5 hidden h-px md:block',
          ink ? 'bg-ink-foreground/15' : 'bg-border',
        )}
        style={{ right: '10%' }}
      />
      {projectJourney.map((s) => (
        <li key={s.step} className="relative">
          <div
            className={cn(
              'relative z-10 flex size-11 items-center justify-center rounded-2xl font-mono text-sm font-semibold shadow-sm',
              ink ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground',
            )}
          >
            {s.step}
          </div>
          <h3 className={cn('mt-5 text-lg font-bold tracking-tight', ink && 'text-ink-foreground')}>{s.title}</h3>
          <p
            className={cn(
              'mt-2 text-sm leading-relaxed',
              ink ? 'text-ink-foreground/72' : 'text-muted-foreground',
            )}
          >
            {s.body}
          </p>
        </li>
      ))}
    </ol>
  )
}

export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-accent/25 bg-accent/8 px-5 py-4 text-sm leading-relaxed text-foreground/80">
      {children}
    </p>
  )
}

export function CtaBand({
  title = "Let's Build a Smarter Energy Future Together.",
  body = 'Tell us about your site and requirements. Our team will help you plan the right solar, EV charging, or EPC solution.',
}: {
  title?: string
  body?: string
}) {
  return (
    <section aria-labelledby="cta-band-title" className="relative overflow-hidden bg-[#062d24] py-20 text-ink-foreground md:py-24">
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(120deg,#062d24_0%,#087a55_45%,#087f83_70%,#151c1b_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(244,198,94,0.22),transparent_35%),radial-gradient(ellipse_at_bottom_right,rgba(166,230,90,0.18),transparent_35%)]" />
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 md:flex-row md:items-end md:justify-between md:px-6">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            <span aria-hidden="true" className="h-px w-10 bg-accent/70" />
            Start Your Project
          </p>
          <h2 id="cta-band-title" className="mt-5 text-3xl font-extrabold leading-[1.05] tracking-tight md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ink-foreground/75 md:text-lg">
            {body}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <CtaLink href="/contact" variant="accent" arrow>
            Discuss Your Project
          </CtaLink>
          <CtaLink href="/contact" variant="outline-light">
            Contact Us
          </CtaLink>
        </div>
      </div>
    </section>
  )
}

