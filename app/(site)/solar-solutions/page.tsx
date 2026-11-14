import type { Metadata } from 'next'
import Image from 'next/image'
import { Building2, Factory, GraduationCap, Home, ShieldCheck, Wrench } from 'lucide-react'
import { AudienceList, CtaBand, Disclaimer, ScopeGrid } from '@/components/blocks'
import { CtaLink } from '@/components/cta-link'
import { PageHero } from '@/components/page-hero'
import { Section, SectionHeading } from '@/components/section'
import { solarAudiences, solarScope } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Solar Rooftop Solutions',
  description:
    'Comprehensive solar rooftop solutions in India — site survey, system design, quality components, installation, net-metering assistance, and O&M from SAMAR SOLUTIONS INDIA PVT. LTD.',
}

const applications = [
  { icon: Home, title: 'Residential', body: 'Rooftop solar systems for homes and housing communities, planned around available space and usage.' },
  { icon: Building2, title: 'Commercial', body: 'Solar installations for offices, commercial buildings, and multi-use properties.' },
  { icon: Factory, title: 'Industrial', body: 'On-site solar infrastructure for manufacturing, warehousing, and operational facilities.' },
  { icon: GraduationCap, title: 'Institutional', body: 'Solar projects for campuses, healthcare, and public or institutional buildings.' },
]

export default function SolarPage() {
  return (
    <>
      <PageHero
        eyebrow="Solar Solutions"
        title="Solar rooftop solutions engineered for performance, reliability, and long-term value"
        intro="SAMAR SOLUTIONS INDIA PVT. LTD. provides comprehensive solar rooftop solutions — from site survey and system design to supply, installation, net-metering assistance, and ongoing maintenance."
        image="/images/projects/03-elevated-rooftop-solar-urban.webp"
        imageAlt="Elevated rooftop solar installation above an urban neighbourhood"
        imageNote={null}
      />

      <Section labelledBy="solar-intro-title" className="bg-[linear-gradient(135deg,#e8dcc4_0%,#ddebe1_50%,#f6e7b8_100%)]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              id="solar-intro-title"
              eyebrow="Solar Applications"
              title="Designed for residential, commercial, industrial, and institutional sites"
              intro="Every rooftop is different. We assess site conditions, energy needs, and technical requirements before recommending a practical solar solution."
            />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {applications.map((item) => (
              <li key={item.title} className="rounded-[1.75rem] border border-border/70 bg-card/70 p-6 transition-all hover:-translate-y-0.5 hover:border-primary/20">
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

      <Section tone="soft" labelledBy="solar-scope-title" className="bg-[linear-gradient(135deg,#062d24_0%,#087a55_50%,#0d7a6a_100%)]">
        <SectionHeading
          id="solar-scope-title"
          tone="ink"
          eyebrow="Service Scope"
          title="Everything a rooftop solar project needs"
          intro="We handle each stage of the project so you have a single point of responsibility."
          align="center"
        />
        <div className="mt-12">
          <ScopeGrid items={solarScope} />
        </div>
      </Section>

      <Section labelledBy="solar-who-title" className="overflow-hidden bg-[linear-gradient(180deg,#f2e6c9_0%,#ddebe1_100%)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              id="solar-who-title"
              eyebrow="Who It’s For"
              title="Solar for a wide range of buildings and operating environments"
              intro="Rooftop solar can suit many building types. A site survey helps determine what is practical for your location."
            />
            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl border border-border/70 bg-secondary/30 p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
                  <h3 className="font-heading font-bold">Quality & Reliability</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Industry-approved products and engineering best practices across design and execution.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-secondary/30 p-5">
                <div className="flex items-center gap-3">
                  <Wrench aria-hidden="true" className="size-5 text-primary" />
                  <h3 className="font-heading font-bold">Ongoing Support</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Operations and maintenance support to help systems perform as designed over time.</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <AudienceList items={solarAudiences} columns={2} />
          </div>
        </div>
      </Section>

      <Section tone="muted" labelledBy="solar-expect-title" className="bg-[linear-gradient(135deg,#dcefe2_0%,#e8dcc4_60%,#f4dba0_100%)]">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <SectionHeading
            id="solar-expect-title"
            eyebrow="Planning & Expectations"
            title="Every site is different"
            intro="System design, generation, and approvals depend on site conditions, utility requirements, and project scope."
          />
          <div className="space-y-6">
            <Disclaimer>
              Energy generation, savings, payback periods, incentives, and net-metering approvals depend on
              site conditions, system design, utility rules, and other factors. We assess these during the
              site survey and feasibility analysis, and do not guarantee specific outcomes in advance.
            </Disclaimer>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-muted">
              <Image src="/images/projects/20-rooftop-solar-residential-view.webp" alt="Solar panels installed on a rooftop overlooking a residential area" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-wrap gap-3">
              <CtaLink href="/contact" arrow>
                Request a Site Survey
              </CtaLink>
              <CtaLink href="/ev-charging-solutions" variant="outline">
                Pair Solar with EV Charging
              </CtaLink>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand title="Planning a solar rooftop project?" body="Share your site details and requirements to start a practical, engineering-led solar consultation." />
    </>
  )
}
