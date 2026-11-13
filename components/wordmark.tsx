import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Interim text wordmark. Replace with SAMAR's official logo once supplied.
 */
export function Wordmark({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  const light = tone === 'light'
  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-3 rounded-sm', className)}
      aria-label="SAMAR Solutions India — home"
    >
      <span
        aria-hidden="true"
        className={cn(
          'relative flex size-9 items-center justify-center overflow-hidden rounded-xl ring-1 transition-transform duration-300 group-hover:scale-[1.03]',
          light ? 'bg-white/10 ring-white/20' : 'bg-primary/10 ring-primary/20',
        )}
      >
        <span className="absolute inset-0 bg-gradient-to-br from-primary/80 to-emerald/70 opacity-90" />
        <span className="relative size-2.5 rounded-full bg-accent shadow-[0_0_0_5px_rgba(245,158,11,0.18)]" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-heading text-[1.05rem] font-extrabold tracking-[0.22em]',
            light ? 'text-white' : 'text-foreground',
          )}
        >
          SAMAR
        </span>
        <span
          className={cn(
            'mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.24em]',
            light ? 'text-white/70' : 'text-muted-foreground',
          )}
        >
          Solutions India
        </span>
      </span>
    </Link>
  )
}
