import { cache } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Download,
  FileText,
  MapPin,
  Tag,
  User,
} from 'lucide-react'
import { CtaBand } from '@/components/blocks'
import { Section } from '@/components/section'
import { getPublishedProjectBySlug } from '@/lib/projects'
import { formatDate } from '@/lib/utils'
import { getVideoEmbedUrl, isDirectVideoUrl } from '@/lib/video'

const getProject = cache(getPublishedProjectBySlug)

export const dynamic = 'force-dynamic'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Project not found' }

  const title = project.seoTitle ?? project.title
  const description = project.seoDescription ?? project.shortDescription
  const image = project.coverImage ?? project.displayImage

  return {
    title,
    description,
    keywords: project.seoKeywords
      ? project.seoKeywords
          .split(',')
          .map((keyword) => keyword.trim())
          .filter(Boolean)
      : undefined,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/projects/${project.slug}`,
      images: image ? [{ url: image, alt: project.coverImageAlt ?? project.title }] : undefined,
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const completionDate = formatDate(project.completionDate)
  const startDate = formatDate(project.startDate)
  const coverImage = project.coverImage ?? project.displayImage
  const embedUrl = project.videoUrl ? getVideoEmbedUrl(project.videoUrl) : null
  const directVideo = project.videoUrl ? isDirectVideoUrl(project.videoUrl) : false

  const details = [
    { label: 'Client', value: project.clientName, icon: User },
    { label: 'Location', value: project.projectLocation, icon: MapPin },
    { label: 'Start date', value: startDate, icon: CalendarDays },
    { label: 'Completion date', value: completionDate, icon: CalendarDays },
    { label: 'Project status', value: project.projectStatus, icon: Check },
    { label: 'Category', value: project.categoryName, icon: Tag },
  ].filter((item) => Boolean(item.value))

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink pt-28 text-ink-foreground md:pt-32 lg:pt-36">
        {coverImage ? (
          <>
            <Image src={coverImage} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-25" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/55" />
          </>
        ) : (
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.2),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.12),transparent_35%)]" />
        )}
        <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            All projects
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              {project.categoryName && (
                <p className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {project.categoryName}
                </p>
              )}
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.03] tracking-tight md:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-foreground/78 md:text-xl">
                {project.shortDescription}
              </p>
              <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
                {project.projectLocation && (
                  <div className="flex items-center gap-2 text-sm text-white/85">
                    <MapPin aria-hidden="true" className="size-4 text-accent" />
                    <dt className="sr-only">Location</dt>
                    <dd className="font-medium">{project.projectLocation}</dd>
                  </div>
                )}
                {completionDate && (
                  <div className="flex items-center gap-2 text-sm text-white/85">
                    <CalendarDays aria-hidden="true" className="size-4 text-accent" />
                    <dt className="sr-only">Completed</dt>
                    <dd className="font-medium">{completionDate}</dd>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-white/85">
                  <Check aria-hidden="true" className="size-4 text-accent" />
                  <dt className="sr-only">Project status</dt>
                  <dd className="font-medium">{project.projectStatus}</dd>
                </div>
              </dl>
            </div>

            <figure className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={project.coverImageAlt ?? `${project.title} project`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/70 to-ink">
                    <span className="font-heading text-7xl font-extrabold text-white/12">
                      {project.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
              </div>
            </figure>
          </div>
        </div>
      </section>

      <Section className="pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {project.detailedDescription ? (
              <div className="space-y-5">
                {project.detailedDescription.split(/\n{2,}/).map((paragraph, index) => (
                  <p
                    key={index}
                    className="whitespace-pre-line text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                {project.shortDescription}
              </p>
            )}

            {project.highlights.length > 0 && (
              <section aria-labelledby="highlights-title" className="mt-14">
                <h2 id="highlights-title" className="text-2xl font-extrabold tracking-tight">
                  Project highlights
                </h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {project.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/70 px-4 py-4 text-sm font-medium"
                    >
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.features.length > 0 && (
              <section aria-labelledby="features-title" className="mt-14">
                <h2 id="features-title" className="text-2xl font-extrabold tracking-tight">
                  Scope and features
                </h2>
                <ul className="mt-6 space-y-3">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 rounded-2xl border border-border/60 bg-secondary/20 px-4 py-3.5 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.gallery.length > 0 && (
              <section aria-labelledby="gallery-title" className="mt-14">
                <h2 id="gallery-title" className="text-2xl font-extrabold tracking-tight">
                  Project gallery
                </h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.gallery.map((image, index) => (
                    <li key={`${image.url}-${index}`}>
                      <figure>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted">
                          <Image
                            src={image.url}
                            alt={image.altText ?? `${project.title} project photograph ${index + 1}`}
                            fill
                            sizes="(min-width: 640px) 40vw, 100vw"
                            className="object-cover transition-transform duration-700 hover:scale-105"
                          />
                        </div>
                        {image.caption && (
                          <figcaption className="mt-2 text-sm text-muted-foreground">{image.caption}</figcaption>
                        )}
                      </figure>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.videoUrl && (
              <section aria-labelledby="video-title" className="mt-14">
                <h2 id="video-title" className="text-2xl font-extrabold tracking-tight">
                  Project video
                </h2>
                <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-border/70 bg-ink shadow-lg">
                  {embedUrl ? (
                    <div className="relative aspect-video">
                      <iframe
                        src={embedUrl}
                        title={`${project.title} project video`}
                        className="absolute inset-0 size-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : directVideo ? (
                    <video controls preload="metadata" className="aspect-video w-full">
                      <source
                        src={project.videoUrl}
                        type={project.videoUrl.endsWith('.webm') ? 'video/webm' : 'video/mp4'}
                      />
                      Your browser does not support embedded video.
                    </video>
                  ) : (
                    <div className="p-6">
                      <a
                        href={project.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-accent underline-offset-4 hover:underline"
                      >
                        Watch the project video
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6 lg:col-span-4">
            {details.length > 0 && (
              <div className="rounded-[1.75rem] border border-border/70 bg-card/80 p-6 shadow-sm">
                <h2 className="text-lg font-bold tracking-tight">Project details</h2>
                <dl className="mt-5 space-y-4">
                  {details.map((detail) => (
                    <div key={detail.label} className="border-b border-border/60 pb-4 last:border-0 last:pb-0">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{detail.label}</dt>
                      <dd className="mt-1.5 text-sm font-medium text-foreground">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {project.technologies.length > 0 && (
              <div className="rounded-[1.75rem] border border-border/70 bg-card/80 p-6">
                <h2 className="text-lg font-bold tracking-tight">Technologies</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <li key={technology} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">{technology}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.tags.length > 0 && (
              <div className="rounded-[1.75rem] border border-border/70 bg-card/80 p-6">
                <h2 className="text-lg font-bold tracking-tight">Tags</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">{tag}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.documents.length > 0 && (
              <div className="rounded-[1.75rem] border border-border/70 bg-card/80 p-6">
                <h2 className="text-lg font-bold tracking-tight">Documents</h2>
                <ul className="mt-4 space-y-3">
                  {project.documents.map((document, index) => (
                    <li key={`${document.url}-${index}`}>
                      <a href={document.url} target="_blank" rel="noopener noreferrer" download className="flex items-start gap-3 rounded-xl border border-border/60 px-3 py-3 text-sm font-medium text-primary transition-colors hover:bg-muted">
                        <FileText aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                        <span className="flex-1">{document.filename ?? `Document ${index + 1}`}</span>
                        <Download aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-[1.75rem] bg-gradient-to-br from-primary to-ink p-6 text-primary-foreground shadow-lg">
              <h2 className="text-lg font-bold">Planning a similar project?</h2>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">Tell us about your site and requirements. Our team will get in touch to discuss the next steps.</p>
              <Link href="/contact" className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">Discuss your project</Link>
            </div>
          </aside>
        </div>
      </Section>
      <CtaBand />
    </>
  )
}
