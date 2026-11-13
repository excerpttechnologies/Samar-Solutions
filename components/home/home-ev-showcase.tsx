import Image from 'next/image'
import { BatteryCharging, Building2, CarFront, PlugZap, Truck } from 'lucide-react'
import { CtaLink } from '@/components/cta-link'
import { Section, SectionHeading } from '@/components/section'

const capabilities = [
  { icon: PlugZap, label: 'AC charging solutions' },
  { icon: BatteryCharging, label: 'DC fast charging' },
  { icon: Building2, label: 'Commercial EV infrastructure' },
  { icon: CarFront, label: 'Residential charging' },
  { icon: Truck, label: 'Fleet charging infrastructure' },
]

export function HomeEvShowcase() {
  return (
    <Section tone="ink" labelledBy="ev-showcase-title" className="overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(245,158,11,0.14),transparent_35%),radial-gradient(ellipse_at_left_bottom,rgba(16,185,129,0.16),transparent_40%)]" />
      <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <div className="relative">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
              <Image src="/images/ev-charging.png" alt="EV charging station infrastructure" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Infrastructure</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-foreground/75">Site assessment, electrical planning, safe installation, and commissioning support.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Support</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-foreground/75">Maintenance and technical support to help keep charging infrastructure reliable.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-6">
          <SectionHeading
            id="ev-showcase-title"
            tone="ink"
            eyebrow="EV Charging"
            title="Modern EV charging infrastructure for everyday mobility"
            intro="SAMAR helps organizations plan, install, and maintain EV charging systems with the right mix of chargers, electrical infrastructure, and long-term support."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {capabilities.map((item) => (
              <li key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-medium text-ink-foreground/90">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <item.icon aria-hidden="true" className="size-4" />
                </span>
                {item.label}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <CtaLink href="/ev-charging-solutions" variant="accent" arrow>
              Explore EV Charging
            </CtaLink>
            <CtaLink href="/contact" variant="outline-light">
              Discuss Your Site
            </CtaLink>
          </div>
        </div>
      </div>
    </Section>
  )
}
