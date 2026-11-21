import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'accent' | 'outline' | 'outline-light' | 'ghost-light' | 'text'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-[0_10px_30px_-12px_rgba(20,83,45,0.55)] hover:-translate-y-0.5 hover:bg-primary/92 hover:shadow-[0_18px_36px_-14px_rgba(20,83,45,0.6)]',
  accent:
    'bg-accent text-accent-foreground shadow-[0_10px_30px_-12px_rgba(245,158,11,0.45)] hover:-translate-y-0.5 hover:bg-accent/92 hover:shadow-[0_18px_36px_-14px_rgba(245,158,11,0.5)]',
  outline:
    'border border-foreground/15 bg-background/40 text-foreground hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted',
  'outline-light':
    'border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:-translate-y-0.5 hover:bg-white/12',
  'ghost-light': 'text-white/90 hover:bg-white/10 hover:text-white',
  text: 'h-auto px-0 text-primary underline-offset-4 hover:underline',
}

export function CtaLink({
  href,
  children,
  variant = 'primary',
  arrow = false,
  className,
}: {
  href: string
  children: React.ReactNode
  variant?: Variant
  arrow?: boolean
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-tight transition-all duration-300',
        variant !== 'text' && 'h-12 px-6',
        variants[variant],
        className,
      )}
    >
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      )}
    </Link>
  )
}

