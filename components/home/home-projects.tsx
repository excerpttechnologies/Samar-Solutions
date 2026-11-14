import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProjectCard } from '@/components/project-card'
import { CtaLink } from '@/components/cta-link'
import { Section, SectionHeading } from '@/components/section'
import { getPublishedProjects } from '@/lib/projects'

export function HomeProjects() {
  const { items } = getPublishedProjects({ pageSize: 3 })
  if (items.length === 0) {
    return (
      <Section labelledBy="home-projects-title">
        <div className="grid gap-8 rounded-[2rem] border border-border/70 bg-card/70 p-8 md:grid-cols-[1.2fr_0.8fr] md:items-center md:p-12">
          <SectionHeading
            id="home-projects-title"
            eyebrow="Featured Projects"
            title="Project portfolio, presented with verified case studies"
            intro="Published project case studies will appear here as they are added from the admin panel. In the meantime, our team can discuss relevant experience directly."
          />
          <div className="flex flex-col items-start gap-4 md:items-end">
            <CtaLink href="/projects" arrow>
              View Projects Page
            </CtaLink>
            <CtaLink href="/contact" variant="outline">
              Discuss Relevant Experience
            </CtaLink>
          </div>
        </div>
      </Section>
    )
  }

  const [featured, ...rest] = items

  return (
    <Section labelledBy="home-projects-title">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          id="home-projects-title"
          eyebrow="Featured Projects"
          title="Recent solar, EV charging, and EPC work"
          intro="A selection of published project case studies delivered by SAMAR SOLUTIONS INDIA PVT. LTD."
        />
        <Link
          href="/projects"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
        >
          View all projects
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-12">
        {featured && (
          <div className={rest.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <ProjectCard project={featured} />
          </div>
        )}
        {rest.length > 0 && (
          <div className="grid gap-5 lg:col-span-5">
            {rest.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
