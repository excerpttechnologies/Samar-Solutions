import { PencilLine } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Visibly marks content that SAMAR still needs to supply.
 * Styled so it can never be mistaken for real company information.
 */
export function PlaceholderNote({
  label = 'Placeholder – to be provided by SAMAR',
  children,
  tone = 'light',
  className,
}: {
  label?: string
  children?: React.ReactNode
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-md border-2 border-dashed p-4 text-sm',
        tone === 'light'
          ? 'border-foreground/25 bg-muted text-muted-foreground'
          : 'border-ink-foreground/30 bg-ink-foreground/5 text-ink-foreground/75',
        className,
      )}
    >
      <p className="flex items-center gap-2 font-mono text-[0.7rem] font-semibold uppercase tracking-wider">
        <PencilLine aria-hidden="true" className="size-3.5" />
        {label}
      </p>
      {children && <div className="mt-2 leading-relaxed">{children}</div>}
    </div>
  )
}
