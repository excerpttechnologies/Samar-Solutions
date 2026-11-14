import type { Metadata } from 'next'
import Image from 'next/image'
import { ClipboardCheck, HardHat, MonitorCheck, ShieldCheck } from 'lucide-react'
import { CtaBand, JourneySteps, ScopeGrid } from '@/components/blocks'
import { CtaLink } from '@/components/cta-link'
import { PageHero } from '@/components/page-hero'
import { Section, SectionHeading } from '@/components/section'
import { epcScope } from '@/lib/site'

export const metadata: Metadata = {
  title: 'EPC Services',
  description:
    'Full-service renewable-energy EPC in India — engineering design, procurement management, project execution, testing and commissioning, monitoring, and technical support.',
}

const strengths = [
  { icon: ClipboardCheck, title: 'Engineering & Design', body: 'Technical planning and documentation that define how each project is built and commissioned.' },
  { icon: HardHat, title: 'Execution & Commissioning', body: 'On-site construction, installation, testing, and commissioning managed with clear responsibility.' },
  { icon: MonitorCheck, title: 'Project Monitoring', body: 'Progress, quality, and coordination tracked throughout the project lifecycle.' },
  { icon: ShieldCheck, title: 'Quality & Support', body: 'Quality assurance practices and after-handover technical support for reliable operation.' },
]

export default function EpcPage() {
  return (
    <>
      <PageHero
        eyebrow="EPC Services"
        title="Engineering, procurement, and construction for renewable-energy infrastructure"
        intro="As an engineering, procurement, and construction partner, SAMAR SOLUTIONS INDIA PVT. LTD. takes responsibility for projects from design to handover — and supports them after commissioning."
        image="/images/projects/04-rooftop-solar-mounting-structure.webp"
        imageAlt="Solar mounting structure under installation on a rooftop"
        imageNote={null}
      />

      <Section labelledBy="epc-strengths-title" className="bg-[linear-gradient(135deg,#ddebe1_0%,#cfe7e3_45%,#e8dcc4_100%)]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              id="epc-strengths-title"
              eyebrow="EPC Capabilities"
              title="Structured delivery for solar and EV infrastructure projects"
              intro="Our EPC approach combines engineering discipline, procurement coordination, on-site execution, and ongoing technical support."
            />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {strengths.map((item) => (
              <li key={item.title} className="rounded-[1.75rem] border border-white/40 bg-white/25 p-6 shadow-[0_20px_50px_-35px_rgba(6,45,36,0.35)] backdrop-blur-md">
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="soft" labelledBy="epc-scope-title" className="bg-[linear-gradient(135deg,#062d24_0%,#087f83_50%,#087a55_100%)]">
        <SectionHeading
          id="epc-scope-title"
          tone="ink"
          eyebrow="Capabilities"
          title="What our EPC services cover"
          intro="From engineering design to maintenance and technical support, we deliver across the project lifecycle."
          align="center"
        />
        <div className="mt-12">
          <ScopeGrid items={epcScope} />
        </div>
      </Section>

      <Section tone="ink" labelledBy="epc-lifecycle-title" className="overflow-hidden">
        <div className="relative">
          <SectionHeading
            id="epc-lifecycle-title"
            tone="ink"
            eyebrow="Project Lifecycle"
            title="A clear, step-by-step approach"
            intro="Timelines depend on project size, site conditions, and approvals, and are agreed with you during planning."
          />
          <div className="mt-14 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur md:p-10">
            <JourneySteps tone="ink" />
          </div>
        </div>
      </Section>

      <Section labelledBy="epc-apply-title" className="bg-[linear-gradient(180deg,#e8dcc4_0%,#ddebe1_100%)]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <figure className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted">
              <Image src="/images/projects/05-industrial-roof-solar-inspection.webp" alt="Technician inspecting a solar installation on an industrial roof" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </figure>
          <div className="lg:col-span-7">
            <SectionHeading
              id="epc-apply-title"
              eyebrow="Where We Apply It"
              title="EPC for solar rooftop and EV charging projects"
              intro="SAMAR SOLUTIONS INDIA PVT. LTD. applies EPC capabilities across renewable-energy and electric mobility infrastructure, delivering solutions that are engineered for site conditions and long-term use."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink href="/solar-solutions" variant="outline" arrow>
                Solar Rooftop Solutions
              </CtaLink>
              <CtaLink href="/ev-charging-solutions" variant="outline" arrow>
                EV Charging Infrastructure
              </CtaLink>
              <CtaLink href="/contact" arrow>
                Discuss an EPC Project
              </CtaLink>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand title="Need an EPC partner for your energy project?" body="Work with a team that can engineer, procure, execute, commission, and support your renewable-energy infrastructure." />
    </>
  )
}
