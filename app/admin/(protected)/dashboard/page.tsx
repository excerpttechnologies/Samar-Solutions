import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Archive,
  ArrowRight,
  CheckCircle2,
  FileEdit,
  FolderKanban,
  Images,
  PlusCircle,
  Settings,
  Tags,
} from 'lucide-react'
import { StatusBadge } from '@/components/admin/status-badge'
import { adminCardClass, adminPrimaryButtonClass } from '@/components/admin/form-styles'
import { requireAdminPage } from '@/lib/auth'
import { getDashboardData } from '@/lib/projects'
import type { ProjectSummary } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'

export const metadata: Metadata = { title: 'Dashboard' }

const stats = [
  {
    key: 'total' as const,
    label: 'Total projects',
    href: '/admin/projects',
    icon: FolderKanban,
    iconClass: 'bg-primary/10 text-primary',
  },
  {
    key: 'published' as const,
    label: 'Published',
    href: '/admin/projects?status=published',
    icon: CheckCircle2,
    iconClass: 'bg-primary/10 text-primary',
  },
  {
    key: 'draft' as const,
    label: 'Drafts',
    href: '/admin/projects?status=draft',
    icon: FileEdit,
    iconClass: 'bg-accent/20 text-accent-foreground',
  },
  {
    key: 'archived' as const,
    label: 'Archived',
    href: '/admin/projects?status=archived',
    icon: Archive,
    iconClass: 'bg-muted text-muted-foreground',
  },
]

function ProjectThumb({ project }: { project: ProjectSummary }) {
  return (
    <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
      {project.displayImage ? (
        <Image
          src={project.displayImage}
          alt=""
          fill
          sizes="44px"
          className="object-cover"
        />
      ) : (
        <span className="font-heading text-sm font-bold text-muted-foreground">
          {project.title.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  )
}

function RecentList({
  title,
  description,
  projects,
  emptyText,
}: {
  title: string
  description: string
  projects: ProjectSummary[]
  emptyText: string
}) {
  return (
    <div className={`${adminCardClass} p-5 md:p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Link
          href="/admin/projects"
          className="shrink-0 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          View all
        </Link>
      </div>
      {projects.length === 0 ? (
        <p className="mt-6 rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {emptyText}
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-border">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/admin/projects/${project.id}/edit`}
                className="flex items-center gap-3 py-3 transition-colors hover:text-primary"
              >
                <ProjectThumb project={project} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{project.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {project.categoryName ?? 'Uncategorised'}
                    {project.updatedAt ? ` · ${formatDateTime(project.updatedAt)}` : ''}
                  </span>
                </span>
                <StatusBadge status={project.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const quickActions = [
  {
    href: '/admin/projects/new',
    label: 'Add a project',
    description: 'Create a new case study with photos and SEO details.',
    icon: PlusCircle,
  },
  {
    href: '/admin/categories',
    label: 'Manage categories',
    description: 'Organise projects into solar, EV, EPC, or custom groups.',
    icon: Tags,
  },
  {
    href: '/admin/media',
    label: 'Media library',
    description: 'Review uploaded images, documents, and videos.',
    icon: Images,
  },
  {
    href: '/admin/settings',
    label: 'Website settings',
    description: 'Update contact details and the partnership line.',
    icon: Settings,
  },
]

export default async function AdminDashboardPage() {
  const session = await requireAdminPage()
  const data = getDashboardData()
  const firstName = session.admin.name.split(/\s+/)[0] || 'Admin'

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here’s the current state of the website content and project library.
          </p>
        </div>
        <Link href="/admin/projects/new" className={adminPrimaryButtonClass}>
          <PlusCircle aria-hidden="true" className="size-4" />
          Add new project
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.key}
              href={stat.href}
              className={`${adminCardClass} group p-5 transition-shadow hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex size-10 items-center justify-center rounded-md ${stat.iconClass}`}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5"
                />
              </div>
              <p className="mt-5 text-3xl font-extrabold tabular-nums">
                {data.counts[stat.key]}
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/categories"
          className={`${adminCardClass} flex items-center justify-between gap-4 p-5 transition-shadow hover:shadow-md`}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Tags aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Categories</p>
              <p className="text-xs text-muted-foreground">
                {data.categories} categor{data.categories === 1 ? 'y' : 'ies'} configured
              </p>
            </div>
          </div>
          <span className="text-2xl font-extrabold tabular-nums">{data.categories}</span>
        </Link>
        <Link
          href="/admin/media"
          className={`${adminCardClass} flex items-center justify-between gap-4 p-5 transition-shadow hover:shadow-md`}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Images aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Media assets</p>
              <p className="text-xs text-muted-foreground">
                {data.media} uploaded file{data.media === 1 ? '' : 's'}
              </p>
            </div>
          </div>
          <span className="text-2xl font-extrabold tabular-nums">{data.media}</span>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <RecentList
            title="Recently added"
            description="The newest projects in the library."
            projects={data.recentAdded}
            emptyText="No projects yet. Add your first project to get started."
          />
          <RecentList
            title="Recently updated"
            description="The latest edits across all project statuses."
            projects={data.recentUpdated}
            emptyText="Project updates will appear here."
          />
        </div>

        <div>
          <div className={`${adminCardClass} p-5 md:p-6`}>
            <h2 className="text-lg font-bold">Quick actions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Common tasks to keep the website current.
            </p>
            <ul className="mt-5 space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <li key={action.href}>
                    <Link
                      href={action.href}
                      className="group flex items-start gap-3 rounded-md border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/50"
                    >
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon aria-hidden="true" className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{action.label}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                          {action.description}
                        </span>
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="mt-2 size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
