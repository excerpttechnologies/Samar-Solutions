import type { Metadata } from 'next'
import { BriefcaseBusiness, HardHat, Leaf, Users } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { PlaceholderNote } from '@/components/placeholder-note'
import { Section, SectionHeading } from '@/components/section'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Build a career in renewable energy and EV infrastructure with SAMAR Solutions India.',
}

const areas = [
  'Engineering & design',
  'Project execution & site work',
  'Procurement',
  'Operations & maintenance',
  'Sales & customer support',
]

const reasons = [
  { icon: Leaf, title: 'Meaningful work', body: 'Contribute to renewable energy and electric mobility infrastructure.' },
  { icon: HardHat, title: 'On-ground impact', body: 'Be part of projects that move from engineering plans to real installations.' },
  { icon: Users, title: 'Team-driven delivery', body: 'Work across disciplines focused on quality, safety, and execution.' },
  { icon: BriefcaseBusiness, title: 'Growing sector', body: 'Build experience in solar, EV charging, and sustainable infrastructure.' },
]

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Help build India’s clean-energy and mobility infrastructure"
        intro="We value people who care about quality, safety, and doing the job right. If you’re interested in renewable energy and electric mobility, we’d like to hear from you."
        cta={false}
      />
      <Section labelledBy="careers-why-title" className="bg-[linear-gradient(135deg,#e8dcc4_0%,#ddebe1_50%,#d4e8dc_100%)]">
        <SectionHeading
          id="careers-why-title"
          eyebrow="Why Work With SAMAR"
          title="Build practical expertise in renewable energy and infrastructure delivery"
          intro="Our work spans engineering, procurement, execution, commissioning, and long-term support across solar and EV charging projects."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item) => (
            <li key={item.title} className="rounded-[1.75rem] border border-border/70 bg-card/70 p-6">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="soft" labelledBy="careers-areas-title" className="bg-[linear-gradient(135deg,#062d24_0%,#087a55_55%,#087f83_100%)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <SectionHeading
              id="careers-areas-title"
              tone="ink"
              eyebrow="Areas of Work"
              title="Functions involved in our project lifecycle"
              intro="These are the kinds of functions involved in our work — not a list of current openings."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {areas.map((area) => (
                <li key={area} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-sm font-semibold text-white backdrop-blur">
                  {area}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 text-white backdrop-blur md:p-8">
              <h2 className="text-2xl font-extrabold tracking-tight">Open roles & applications</h2>
              <p className="mt-3 leading-relaxed text-white/75">
                Current openings and the application process will be published here when available.
              </p>
              <PlaceholderNote tone="dark" className="mt-6">
                Add open roles and the approved application method (e.g. careers email or application form).
                No application inbox is configured yet.
              </PlaceholderNote>
              <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-white/5 p-5 text-sm leading-relaxed text-white/75">
                <p className="font-semibold text-white">Interested in working with SAMAR?</p>
                <p className="mt-2">Verified job opportunities and application instructions will be shared here. Please do not assume current vacancies unless published.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
