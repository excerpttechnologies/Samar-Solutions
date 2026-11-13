import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, MapPin } from 'lucide-react'
import type { ProjectSummary } from '@/lib/types'

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-35px_rgba(15,23,42,0.45)]"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-muted">
        {project.displayImage ? (
          <Image
            src={project.displayImage}
            alt={project.coverImageAlt ?? `${project.title} project`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink to-primary/80">
            <span className="font-heading text-6xl font-extrabold text-white/12">
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-transparent opacity-70" />
        {project.categoryName && (
          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
            {project.categoryName}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="text-xl font-bold leading-snug tracking-tight text-foreground md:text-[1.35rem]">
          {project.title}
        </h3>
        {project.projectLocation && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
            {project.projectLocation}
          </p>
        )}
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
          {project.shortDescription}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          View project details
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  )
}

