import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaBand } from '@/components/blocks'
import { PageHero } from '@/components/page-hero'
import { ProjectCard } from '@/components/project-card'
import { Section } from '@/components/section'
import { getCategories } from '@/lib/categories'
import { getPublishedProjects } from '@/lib/projects'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Solar rooftop, EV charging, and EPC project case studies from SAMAR SOLUTIONS INDIA PVT. LTD.',
}

export const dynamic = 'force-dynamic'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function hrefFor(page: number, category?: string): string {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/projects?${query}` : '/projects'
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const query = await searchParams
  const category = first(query.category)
  const rawPage = Number(first(query.page) ?? 1)
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1

  const categories = getCategories()
  const activeCategory = category
    ? categories.find((item) => item.slug === category)
    : null
  const result = getPublishedProjects({
    categorySlug: activeCategory?.slug,
    page,
    pageSize: 9,
  })

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="A premium portfolio of solar, EV charging, and EPC delivery"
        intro="Explore published case studies showcasing SAMAR’s engineering, execution, and infrastructure capabilities."
        cta={false}
      />
      <Section labelledBy="projects-list-title" className="bg-[linear-gradient(180deg,#ddebe1_0%,#e8dcc4_100%)] pt-16 md:pt-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="projects-list-title" className="text-2xl font-extrabold tracking-tight md:text-3xl">
              Published project case studies
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Filter by category to view relevant solar, EV charging, and EPC projects.
            </p>
          </div>
          {categories.length > 0 && (
            <nav aria-label="Filter projects by category">
              <ul className="flex flex-wrap gap-2">
                <li>
                  <Link
                    href={hrefFor(1)}
                    aria-current={!activeCategory ? 'page' : undefined}
                    className={cn(
                      'inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition-all',
                      !activeCategory
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border bg-card/70 hover:border-primary/20 hover:bg-muted',
                    )}
                  >
                    All projects
                  </Link>
                </li>
                {categories.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={hrefFor(1, item.slug)}
                      aria-current={activeCategory?.id === item.id ? 'page' : undefined}
                      className={cn(
                        'inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition-all',
                        activeCategory?.id === item.id
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                          : 'border-border bg-card/70 hover:border-primary/20 hover:bg-muted',
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {result.items.length === 0 ? (
          <div className="mx-auto mt-14 max-w-3xl rounded-[2rem] border border-border/70 bg-card/70 p-10 text-center md:p-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Project Portfolio</p>
            <p className="mt-4 font-heading text-2xl font-bold tracking-tight md:text-3xl">
              {activeCategory ? 'No projects in this category yet' : 'Project details coming soon'}
            </p>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
              {activeCategory
                ? 'Browse all projects or choose another category.'
                : 'Verified project case studies will appear here as they are published. In the meantime, we’re happy to discuss relevant experience directly.'}
            </p>
            {activeCategory ? (
              <Link
                href="/projects"
                className="mt-7 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                View all projects
              </Link>
            ) : (
              <Link
                href="/contact"
                className="mt-7 inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Discuss your project
              </Link>
            )}
          </div>
        ) : (
          <>
            <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {result.items.map((project) => (
                <li key={project.id}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>

            {result.totalPages > 1 && (
              <nav
                aria-label="Project pages"
                className="mt-12 flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/60 px-4 py-4"
              >
                {result.page > 1 ? (
                  <Link
                    href={hrefFor(result.page - 1, activeCategory?.slug)}
                    className="inline-flex h-10 items-center rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold text-muted-foreground opacity-50">
                    Previous
                  </span>
                )}
                <p className="text-sm text-muted-foreground">
                  Page {result.page} of {result.totalPages}
                </p>
                {result.page < result.totalPages ? (
                  <Link
                    href={hrefFor(result.page + 1, activeCategory?.slug)}
                    className="inline-flex h-10 items-center rounded-full border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold text-muted-foreground opacity-50">
                    Next
                  </span>
                )}
              </nav>
            )}
          </>
        )}
      </Section>
      <CtaBand />
    </>
  )
}
