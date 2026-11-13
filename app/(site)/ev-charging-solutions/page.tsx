import type { Metadata } from 'next'
import Image from 'next/image'
import { BatteryCharging, Building2, CarFront, PlugZap, ShieldCheck, Truck } from 'lucide-react'
import { AudienceList, CtaBand, Disclaimer, ScopeGrid } from '@/components/blocks'
import { CtaLink } from '@/components/cta-link'
import { PageHero } from '@/components/page-hero'
import { Section, SectionHeading } from '@/components/section'
import { evAudiences, evScope } from '@/lib/site'

export const metadata: Metadata = {
  title: 'EV Charging Solutions',
  description:
    'EV charging infrastructure in India — AC chargers, DC fast chargers, site assessment, electrical infrastructure, installation, and annual maintenance from SAMAR Solutions.',
}

const chargingTypes = [
  { icon: PlugZap, title: 'AC Charging', body: 'Suited for homes, offices, and locations where vehicles are parked for longer durations.' },
  { icon: BatteryCharging, title: 'DC Fast Charging', body: 'For sites where shorter charging stops matter, such as fleets, commercial locations, and public use.' },
  { icon: CarFront, title: 'Residential & Workplace', body: 'Convenient charging infrastructure for communities, employees, and daily vehicle users.' },
  { icon: Truck, title: 'Fleet & Commercial', body: 'Planned charging solutions for fleet depots, commercial complexes, and mobility operations.' },
]

export default function EvPage() {
  return (
    <>
      <PageHero
        eyebrow="EV Charging Solutions"
        title="EV charging infrastructure designed for reliability, safety, and everyday use"
        intro="SAMAR helps organizations plan, install, and maintain EV charging — covering charger selection, electrical infrastructure, installation, commissioning, and ongoing support."
        image="/images/ev-charging.png"
        imageAlt="Electric vehicle charging infrastructure"
      />

      <Section labelledBy="ev-types-title" className="bg-[linear-gradient(180deg,#151c1b_0%,#0f2420_55%,#062d24_100%)] text-white">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              id="ev-types-title"
              tone="ink"
              eyebrow="Charging Solutions"
              title="AC, DC, residential, commercial, and fleet charging infrastructure"
              intro="We assess site conditions, electrical capacity, and expected usage to recommend a practical EV charging solution."
            />
            <div className="mt-8 rounded-2xl border border-[#a6e65a]/25 bg-[#a6e65a]/8 p-5 shadow-[0_0_0_1px_rgba(166,230,90,0.08),0_20px_50px_-30px_rgba(166,230,90,0.35)]">
              <div className="flex items-center gap-3">
                <Building2 aria-hidden="true" className="size-5 text-[#a6e65a]" />
                <h3 className="font-heading font-bold">Site-first planning</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/72">Charger type, quantity, and infrastructure are planned around your location, users, and available electrical capacity.</p>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {chargingTypes.map((item) => (
              <li key={item.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#a6e65a]/30 hover:bg-white/8">
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#a6e65a]/15 text-[#a6e65a] shadow-[0_0_24px_-8px_rgba(166,230,90,0.7)]">
                  <item.icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/72">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="soft" labelledBy="ev-scope-title" className="bg-[linear-gradient(135deg,#062d24_0%,#087f83_45%,#151c1b_100%)]">
        <SectionHeading
          id="ev-scope-title"
          tone="ink"
          eyebrow="What We Offer"
          title="Chargers, electrical infrastructure, and ongoing support"
          intro="From choosing the right charger to keeping it in working order, we support the full lifecycle."
          align="center"
        />
        <div className="mt-12">
          <ScopeGrid items={evScope} />
        </div>
      </Section>

      <Section labelledBy="ev-who-title" className="bg-[linear-gradient(180deg,#ddebe1_0%,#cfe5d8_100%)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <SectionHeading
            id="ev-who-title"
            eyebrow="Who It’s For"
            title="Charging for residents, employees, fleets, and the public"
            intro="EV charging infrastructure can serve a wide range of users and site types depending on location and demand."
            className="lg:col-span-4"
          />
          <div className="lg:col-span-8">
            <AudienceList items={evAudiences} columns={2} />
          </div>
        </div>
      </Section>

      <Section tone="ink" labelledBy="ev-install-title" className="overflow-hidden">
        <div className="relative grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              id="ev-install-title"
              tone="ink"
              eyebrow="Installation & Support"
              title="Planned, installed, and maintained with technical care"
              intro="We support site assessment, electrical infrastructure development, installation, commissioning, and annual maintenance services."
            />
            <ul className="mt-8 space-y-3">
              {['Site assessment and capacity review', 'Electrical infrastructure development', 'Installation and commissioning', 'Maintenance and technical support'].map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-ink-foreground/85">
                  <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <figure className="lg:col-span-6">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <Image src="/images/ev-charging.png" alt="EV charger installation" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </figure>
        </div>
      </Section>

      <Section labelledBy="ev-expect-title" className="bg-[linear-gradient(135deg,#e8dcc4_0%,#ddebe1_100%)]">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <SectionHeading id="ev-expect-title" eyebrow="Planning Your Site" title="Start with a site assessment" />
          <div className="space-y-6">
            <Disclaimer>
              Suitable charger types, connector standards, charging speeds, and the number of charging points
              depend on your site’s electrical capacity, vehicle mix, and usage. Please discuss your specific
              requirements with our team to confirm which equipment is available for your project.
            </Disclaimer>
            <div className="flex flex-wrap gap-3">
              <CtaLink href="/contact" arrow>
                Discuss Your Project
              </CtaLink>
              <CtaLink href="/epc-services" variant="outline">
                How We Deliver Projects
              </CtaLink>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand title="Planning EV charging for your site?" body="Discuss your location, usage, and infrastructure needs to plan the right EV charging solution." />
    </>
  )
}
