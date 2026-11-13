import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PlusCircle, Search, X } from 'lucide-react'
import { ProjectRowActions } from '@/components/admin/project-row-actions'
import { StatusBadge } from '@/components/admin/status-badge'
import {
  adminCardClass,
  adminInputClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from '@/components/admin/form-styles'
import { getCategories } from '@/lib/categories'
import { getAdminProjects, getProjectStatusCounts } from '@/lib/projects'
import { formatDateTime } from '@/lib/utils'
import type { ProjectStatus } from '@/lib/types'

export const metadata: Metadata = { title: 'All Projects' }

const statusTabs: { value: ProjectStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'archived', label: 'Archived' },
]

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function buildHref({
  status,
  search,
  categoryId,
  page,
}: {
  status: string
  search?: string
  categoryId?: number | null
  page?: number
}) {
  const params = new URLSearchParams()
  if (status && status !== 'all') params.set('status', status)
  if (search) params.set('search', search)
  if (categoryId) params.set('category', String(categoryId))
  if (page && page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/admin/projects?${query}` : '/admin/projects'
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const query = await searchParams
  const search = first(query.search)?.trim() ?? ''
  const rawStatus = first(query.status) ?? 'all'
  const status: ProjectStatus | 'all' = ['draft', 'published', 'archived'].includes(rawStatus)
    ? (rawStatus as ProjectStatus)
    : 'all'
  const rawCategory = Number(first(query.category))
  const categoryId =
    Number.isInteger(rawCategory) && rawCategory > 0 ? rawCategory : null
  const rawPage = Number(first(query.page) ?? 1)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1

  const categories = getCategories()
  const counts = getProjectStatusCounts()
  const result = getAdminProjects({
    search,
    status,
    categoryId,
    page,
    pageSize: 10,
  })

  const countFor = (value: ProjectStatus | 'all') => counts[value]
  const selectionStart = result.total === 0 ? 0 : (result.page - 1) * result.pageSize + 1
  const selectionEnd = Math.min(result.total, result.page * result.pageSize)

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Project library
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl">
            All projects
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add, edit, publish, archive, duplicate, or delete project content.
          </p>
        </div>
        <Link href="/admin/projects/new" className={adminPrimaryButtonClass}>
          <PlusCircle aria-hidden="true" className="size-4" />
          Add new project
        </Link>
      </div>

      <nav aria-label="Filter by status" className="mt-8 border-b border-border">
        <ul className="flex flex-wrap gap-1">
          {statusTabs.map((tab) => {
            const active = status === tab.value
            return (
              <li key={tab.value}>
                <Link
                  href={buildHref({ status: tab.value, search, categoryId })}
                  aria-current={active ? 'page' : undefined}
                  className={
                    active
                      ? 'inline-flex items-center gap-2 border-b-2 border-primary px-3 pb-3 pt-2 text-sm font-semibold text-primary'
                      : 'inline-flex items-center gap-2 border-b-2 border-transparent px-3 pb-3 pt-2 text-sm font-medium text-muted-foreground hover:text-foreground'
                  }
                >
                  {tab.label}
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[0.7rem] tabular-nums text-muted-foreground">
                    {countFor(tab.value)}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <form
        action="/admin/projects"
        method="get"
        className={`${adminCardClass} mt-6 flex flex-col gap-3 p-4 md:flex-row md:items-end`}
      >
        {status !== 'all' && <input type="hidden" name="status" value={status} />}
        <div className="flex-1">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="project-search"
              name="search"
              type="search"
              defaultValue={search}
              placeholder="Search by title, slug, client, or location"
              className={`${adminInputClass} mt-0 pl-10`}
            />
          </div>
        </div>
        <div className="md:w-56">
          <label htmlFor="project-category" className="sr-only">
            Filter by category
          </label>
          <select
            id="project-category"
            name="category"
            defaultValue={categoryId ? String(categoryId) : ''}
            className={`${adminInputClass} mt-0`}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={adminPrimaryButtonClass}>
          Apply filters
        </button>
        {(search || categoryId) && (
          <Link
            href={buildHref({ status })}
            className={`${adminSecondaryButtonClass} px-3`}
            title="Clear filters"
          >
            <X aria-hidden="true" className="size-4" />
            Clear
          </Link>
        )}
      </form>

      <div className={`${adminCardClass} mt-4 overflow-hidden`}>
        {result.items.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-heading text-xl font-bold">No projects found</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {search || categoryId || status !== 'all'
                ? 'Try a different search term or clear the filters.'
                : 'Add your first project to start building the public project library.'}
            </p>
            {!search && !categoryId && status === 'all' && (
              <Link
                href="/admin/projects/new"
                className={`${adminPrimaryButtonClass} mt-6`}
              >
                <PlusCircle aria-hidden="true" className="size-4" />
                Add new project
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-sm">
                <caption className="sr-only">
                  Projects, including draft, published, and archived items
                </caption>
                <thead className="border-b border-border bg-muted/50 text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Project
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Updated
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result.items.map((project) => (
                    <tr key={project.id} className="align-middle hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                            {project.displayImage ? (
                              <Image
                                src={project.displayImage}
                                alt=""
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <span className="font-heading text-lg font-bold text-muted-foreground">
                                {project.title.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </span>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/projects/${project.id}/edit`}
                              className="block max-w-[22rem] truncate font-semibold hover:text-primary hover:underline"
                            >
                              {project.title}
                            </Link>
                            <p className="mt-0.5 max-w-[22rem] truncate font-mono text-xs text-muted-foreground">
                              /projects/{project.slug}
                            </p>
                            {project.projectLocation && (
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {project.projectLocation}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">
                          {project.categoryName ?? 'Uncategorised'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={project.status} />
                        {project.featured && (
                          <span className="mt-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-accent-foreground">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                        {formatDateTime(project.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <ProjectRowActions
                          id={project.id}
                          title={project.title}
                          slug={project.slug}
                          status={project.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {selectionStart}–{selectionEnd} of {result.total} project
                {result.total === 1 ? '' : 's'}
              </p>
              {result.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  {result.page > 1 ? (
                    <Link
                      href={buildHref({
                        status,
                        search,
                        categoryId,
                        page: result.page - 1,
                      })}
                      className={`${adminSecondaryButtonClass} h-8 px-3 text-xs`}
                    >
                      Previous
                    </Link>
                  ) : (
                    <span className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-semibold text-muted-foreground opacity-50">
                      Previous
                    </span>
                  )}
                  <span className="px-1 text-xs text-muted-foreground">
                    Page {result.page} of {result.totalPages}
                  </span>
                  {result.page < result.totalPages ? (
                    <Link
                      href={buildHref({
                        status,
                        search,
                        categoryId,
                        page: result.page + 1,
                      })}
                      className={`${adminSecondaryButtonClass} h-8 px-3 text-xs`}
                    >
                      Next
                    </Link>
                  ) : (
                    <span className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-semibold text-muted-foreground opacity-50">
                      Next
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
