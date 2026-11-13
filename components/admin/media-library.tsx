'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Copy,
  ExternalLink,
  FileText,
  Film,
  ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react'
import type { MediaAsset } from '@/lib/types'
import { ApiRequestError, uploadAsset } from '@/lib/api-client'
import { formatBytes, formatDateTime } from '@/lib/utils'
import { ConfirmDialog } from './confirm-dialog'
import {
  adminCardClass,
  adminInputClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from './form-styles'
import { useToast } from './toast'

const kindLabels: Record<MediaAsset['kind'], string> = {
  image: 'Image',
  document: 'Document',
  video: 'Video',
}

function KindIcon({ kind, className }: { kind: MediaAsset['kind']; className?: string }) {
  if (kind === 'document') return <FileText aria-hidden="true" className={className} />
  if (kind === 'video') return <Film aria-hidden="true" className={className} />
  return <ImageIcon aria-hidden="true" className={className} />
}

export function MediaLibrary({ items }: { items: MediaAsset[] }) {
  const router = useRouter()
  const toast = useToast()
  const fileInput = useRef<HTMLInputElement>(null)
  const [kind, setKind] = useState<MediaAsset['kind']>('image')
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<MediaAsset | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const accept =
    kind === 'image'
      ? 'image/jpeg,image/png,image/webp'
      : kind === 'video'
        ? 'video/mp4,video/webm'
        : '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv'

  async function upload(file: File | undefined) {
    if (!file) return
    setUploading(true)
    try {
      await uploadAsset(file, kind)
      toast.success('File uploaded to the media library.')
      router.refresh()
    } catch (caught) {
      toast.error(
        'Upload failed',
        caught instanceof ApiRequestError ? caught.message : 'Please try again.',
      )
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  async function copyUrl(media: MediaAsset) {
    const url = `${window.location.origin}${media.url}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Media URL copied.')
    } catch {
      toast.error('Could not copy URL', 'Your browser blocked clipboard access.')
    }
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeleteBusy(true)
    try {
      const response = await fetch(`/api/admin/media/${deleting.id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      })
      const data = (await response.json().catch(() => null)) as
        | { error?: string; success?: boolean }
        | null
      if (!response.ok) throw new Error(data?.error || 'Delete failed')
      toast.success('Media file deleted.')
      setDeleting(null)
      router.refresh()
    } catch (caught) {
      toast.error(
        'Could not delete file',
        caught instanceof Error ? caught.message : 'Please try again.',
      )
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <>
      <section className={`${adminCardClass} p-5 md:p-6`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-bold">Upload media</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Images are optimised automatically. Files used by a project cannot be deleted.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div>
              <label htmlFor="media-kind" className="sr-only">
                File type
              </label>
              <select
                id="media-kind"
                value={kind}
                onChange={(event) => setKind(event.target.value as MediaAsset['kind'])}
                className={`${adminInputClass} mt-0 sm:w-36`}
                disabled={uploading}
              >
                <option value="image">Image</option>
                <option value="document">Document</option>
                <option value="video">Video</option>
              </select>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(event) => void upload(event.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className={adminPrimaryButtonClass}
            >
              {uploading ? (
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Upload aria-hidden="true" className="size-4" />
              )}
              {uploading ? 'Uploading…' : 'Choose file'}
            </button>
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <div className={`${adminCardClass} mt-6 px-6 py-16 text-center`}>
          <ImageIcon
            aria-hidden="true"
            className="mx-auto size-10 text-muted-foreground/40"
          />
          <p className="mt-4 font-heading text-xl font-bold">No media files yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Upload images, documents, or videos here, or add them directly while editing a
            project.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((media) => (
            <li
              key={media.id}
              className={`${adminCardClass} flex flex-col overflow-hidden`}
            >
              <div className="relative flex aspect-[4/3] items-center justify-center bg-muted">
                {media.kind === 'image' ? (
                  <Image
                    src={media.url}
                    alt={media.originalName ?? media.filename}
                    fill
                    sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <KindIcon
                    kind={media.kind}
                    className="size-10 text-muted-foreground/50"
                  />
                )}
                <span className="absolute left-2 top-2 rounded bg-background/90 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  {kindLabels[media.kind]}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p
                  className="truncate text-sm font-semibold"
                  title={media.originalName ?? media.filename}
                >
                  {media.originalName ?? media.filename}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatBytes(media.sizeBytes)}
                  {media.width && media.height
                    ? ` · ${media.width}×${media.height}`
                    : ''}
                </p>
                <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
                  {formatDateTime(media.createdAt)}
                </p>
                <div className="mt-auto flex items-center gap-1 pt-3">
                  <button
                    type="button"
                    onClick={() => void copyUrl(media)}
                    className={`${adminSecondaryButtonClass} h-8 flex-1 px-2 text-xs`}
                    title="Copy URL"
                  >
                    <Copy aria-hidden="true" className="size-3.5" />
                    Copy URL
                  </button>
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Open file"
                  >
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                    <span className="sr-only">Open file</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setDeleting(media)}
                    className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Delete file"
                  >
                    <Trash2 aria-hidden="true" className="size-3.5" />
                    <span className="sr-only">Delete file</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete “${deleting?.originalName ?? deleting?.filename ?? ''}”?`}
        description="The file will be removed from the server. Files currently used by a project cannot be deleted."
        confirmLabel="Delete file"
        destructive
        busy={deleteBusy}
        onClose={() => setDeleting(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  )
}
