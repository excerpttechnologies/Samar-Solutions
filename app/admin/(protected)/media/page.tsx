import type { Metadata } from 'next'
import Link from 'next/link'
import { MediaLibrary } from '@/components/admin/media-library'
import { listMedia } from '@/lib/uploads'
import type { MediaAsset } from '@/lib/types'

export const metadata: Metadata = { title: 'Media Library' }

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

const tabs: { value: MediaAsset['kind'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All media' },
  { value: 'image', label: 'Images' },
  { value: 'document', label: 'Documents' },
  { value: 'video', label: 'Videos' },
]

function hrefFor(kind: MediaAsset['kind'] | 'all', page = 1) {
  const params = new URLSearchParams()
  if (kind !== 'all') params.set('kind', kind)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/admin/media?${query}` : '/admin/media'
}

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const query = await searchParams
  const rawKind = first(query.kind) ?? 'all'
  const kind = ['image', 'document', 'video'].includes(rawKind)
    ? (rawKind as MediaAsset['kind'])
    : 'all'
  const rawPage = Number(first(query.page) ?? 1)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1

  const result = listMedia({ kind, page, pageSize: 24 })

  return (
    <div>
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Assets
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl">
          Media library
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review the files uploaded for projects. {result.total} file
          {result.total === 1 ? '' : 's'} in this view.
        </p>
      </div>

      <MediaLibrary items={result.items} />

      <nav aria-label="Filter media by type" className="mt-8">
        <ul className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <li key={tab.value}>
              <Link
                href={hrefFor(tab.value)}
                aria-current={kind === tab.value ? 'page' : undefined}
                className={
                  kind === tab.value
                    ? 'inline-flex rounded-md border border-primary bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground'
                    : 'inline-flex rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted'
                }
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {result.totalPages > 1 && (
        <nav
          aria-label="Media pages"
          className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4"
        >
          {result.page > 1 ? (
            <Link
              href={hrefFor(kind, result.page - 1)}
              className="inline-flex h-9 items-center rounded-md border border-border bg-card px-4 text-sm font-semibold hover:bg-muted"
            >
              Previous
            </Link>
          ) : (
            <span className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-semibold text-muted-foreground opacity-50">
              Previous
            </span>
          )}
          <p className="text-xs text-muted-foreground">
            Page {result.page} of {result.totalPages}
          </p>
          {result.page < result.totalPages ? (
            <Link
              href={hrefFor(kind, result.page + 1)}
              className="inline-flex h-9 items-center rounded-md border border-border bg-card px-4 text-sm font-semibold hover:bg-muted"
            >
              Next
            </Link>
          ) : (
            <span className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-semibold text-muted-foreground opacity-50">
              Next
            </span>
          )}
        </nav>
      )}
    </div>
  )
}
