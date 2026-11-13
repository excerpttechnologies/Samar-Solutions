'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Archive,
  Copy,
  ExternalLink,
  EyeOff,
  Globe2,
  Pencil,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import type { ProjectStatus } from '@/lib/types'
import { ApiRequestError, apiFetch } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { ConfirmDialog } from './confirm-dialog'
import { useToast } from './toast'

const iconButton =
  'inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50'

type Action =
  | 'publish'
  | 'unpublish'
  | 'archive'
  | 'restore'
  | 'duplicate'
  | 'delete'

export function ProjectRowActions({
  id,
  title,
  slug,
  status,
}: {
  id: number
  title: string
  slug: string
  status: ProjectStatus
}) {
  const router = useRouter()
  const toast = useToast()
  const [busy, setBusy] = useState<Action | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function run(action: Action, successMessage: string) {
    setBusy(action)
    try {
      if (action === 'delete') {
        await apiFetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
      } else {
        const endpoint =
          action === 'publish' || action === 'unpublish'
            ? `/api/admin/projects/${id}/${action}`
            : action === 'archive'
              ? `/api/admin/projects/${id}/archive`
              : action === 'restore'
                ? `/api/admin/projects/${id}/restore`
                : `/api/admin/projects/${id}/duplicate`
        await apiFetch(endpoint, { method: 'POST' })
      }
      toast.success(successMessage)
      setConfirmDelete(false)
      router.refresh()
    } catch (caught) {
      toast.error(
        'Action failed',
        caught instanceof ApiRequestError ? caught.message : 'Please try again.',
      )
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {status === 'published' && (
        <a
          href={`/projects/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={iconButton}
          title="View public page"
        >
          <ExternalLink aria-hidden="true" className="size-4" />
          <span className="sr-only">View public page</span>
        </a>
      )}
      <Link href={`/admin/projects/${id}/edit`} className={iconButton} title="Edit project">
        <Pencil aria-hidden="true" className="size-4" />
        <span className="sr-only">Edit project</span>
      </Link>
      <button
        type="button"
        className={iconButton}
        title="Duplicate project"
        onClick={() => run('duplicate', 'Project duplicated as a draft.')}
        disabled={busy !== null}
      >
        <Copy aria-hidden="true" className="size-4" />
        <span className="sr-only">Duplicate project</span>
      </button>

      {status === 'published' ? (
        <button
          type="button"
          className={iconButton}
          title="Unpublish project"
          onClick={() => run('unpublish', 'Project moved to drafts.')}
          disabled={busy !== null}
        >
          <EyeOff aria-hidden="true" className="size-4" />
          <span className="sr-only">Unpublish project</span>
        </button>
      ) : (
        <button
          type="button"
          className={cn(iconButton, 'hover:border-primary/30 hover:text-primary')}
          title="Publish project"
          onClick={() => run('publish', 'Project published.')}
          disabled={busy !== null}
        >
          <Globe2 aria-hidden="true" className="size-4" />
          <span className="sr-only">Publish project</span>
        </button>
      )}

      {status === 'archived' ? (
        <button
          type="button"
          className={iconButton}
          title="Restore to drafts"
          onClick={() => run('restore', 'Project restored to drafts.')}
          disabled={busy !== null}
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          <span className="sr-only">Restore project</span>
        </button>
      ) : (
        <button
          type="button"
          className={iconButton}
          title="Archive project"
          onClick={() => run('archive', 'Project archived.')}
          disabled={busy !== null}
        >
          <Archive aria-hidden="true" className="size-4" />
          <span className="sr-only">Archive project</span>
        </button>
      )}

      <button
        type="button"
        className={cn(iconButton, 'hover:border-destructive/30 hover:text-destructive')}
        title="Delete project"
        onClick={() => setConfirmDelete(true)}
        disabled={busy !== null}
      >
        <Trash2 aria-hidden="true" className="size-4" />
        <span className="sr-only">Delete project</span>
      </button>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete “${title}”?`}
        description="This permanently deletes the project and its media links. Uploaded files remain available in the Media Library. This action cannot be undone."
        confirmLabel="Delete project"
        destructive
        busy={busy === 'delete'}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => run('delete', 'Project deleted.')}
      />
    </div>
  )
}
