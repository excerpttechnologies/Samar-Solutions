import Image from 'next/image'
import { Building2, Factory, GraduationCap, Home, Warehouse } from 'lucide-react'
import { CtaLink } from '@/components/cta-link'
import { Section, SectionHeading } from '@/components/section'

const applications = [
  { icon: Home, label: 'Residential solar rooftops' },
  { icon: Building2, label: 'Commercial solar installations' },
  { icon: Factory, label: 'Industrial solar infrastructure' },
  { icon: GraduationCap, label: 'Institutional solar projects' },
  { icon: Warehouse, label: 'Large-scale rooftop installations' },
]

export function HomeSolarShowcase() {
  return (
    <Section labelledBy="solar-showcase-title" className="overflow-hidden">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <SectionHeading
            id="solar-showcase-title"
            eyebrow="Solar Solutions"
            title="Rooftop and on-site solar systems designed around real operating needs"
            intro="From feasibility and engineering to installation, net-metering assistance, and maintenance, SAMAR delivers solar solutions tailored to each site."
          />
          <ul className="mt-8 space-y-3">
            {applications.map((item) => (
              <li key={item.label} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 px-4 py-3.5 text-sm font-medium">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon aria-hidden="true" className="size-4" />
                </span>
                {item.label}
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <CtaLink href="/solar-solutions" arrow>
              Explore Solar Solutions
            </CtaLink>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted shadow-[0_35px_80px_-45px_rgba(15,23,42,0.5)]">
              <Image src="/images/projects/10-long-commercial-rooftop-solar.webp" alt="Long solar array installed across a commercial rooftop" fill sizes="(min-width: 1024px) 35vw, 50vw" className="object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent" />
            </div>
            <div className="grid gap-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-muted">
                <Image src="/images/projects/19-commercial-solar-service-walkway.webp" alt="Commercial rooftop solar array with a service walkway" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-primary to-emerald p-6 text-primary-foreground">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">What we deliver</p>
                <p className="mt-3 text-lg font-bold leading-snug">Assessment, design, procurement, installation, and ongoing maintenance.</p>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">Each solution is planned around site conditions, energy needs, and applicable technical requirements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
