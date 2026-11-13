import { cn } from '@/lib/utils'
import type { ProjectStatus } from '@/lib/types'

const labels: Record<ProjectStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
}

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        status === 'published' && 'bg-primary/10 text-primary',
        status === 'draft' && 'bg-accent/20 text-accent-foreground',
        status === 'archived' && 'bg-muted text-muted-foreground',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full',
          status === 'published' && 'bg-primary',
          status === 'draft' && 'bg-accent',
          status === 'archived' && 'bg-muted-foreground/60',
        )}
      />
      {labels[status]}
    </span>
  )
}
