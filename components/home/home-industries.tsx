import {
  Building,
  Building2,
  Factory,
  Fuel,
  GraduationCap,
  Home,
  Hospital,
  Landmark,
  Truck,
  Warehouse,
} from 'lucide-react'
import { Section, SectionHeading } from '@/components/section'

const industries = [
  { icon: Home, label: 'Residential', detail: 'Housing societies and residential communities' },
  { icon: Building2, label: 'Commercial', detail: 'Buildings, offices, and business facilities' },
  { icon: Factory, label: 'Industrial', detail: 'Manufacturing and production environments' },
  { icon: Warehouse, label: 'Warehousing', detail: 'Warehouses and logistics parks' },
  { icon: GraduationCap, label: 'Educational', detail: 'Institutions and campuses' },
  { icon: Hospital, label: 'Healthcare', detail: 'Hospitals and healthcare facilities' },
  { icon: Landmark, label: 'Government', detail: 'Public-sector and government organizations' },
  { icon: Building, label: 'Real Estate', detail: 'Developers and multi-site properties' },
  { icon: Truck, label: 'Fleet & Mobility', detail: 'Fleet operators and mobility infrastructure' },
  { icon: Fuel, label: 'Public Charging', detail: 'Commercial complexes, fuel stations, and public sites' },
]

export function HomeIndustries() {
  return (
    <Section tone="soft" labelledBy="industries-title" className="overflow-hidden">
      <SectionHeading
        id="industries-title"
        eyebrow="Industries We Serve"
        title="Built for the sites where energy and mobility matter"
        intro="We work across sectors and building types, tailoring each solar, EV charging, or EPC solution to the site, users, and operational requirements."
        align="center"
      />
      <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {industries.map(({ icon: Icon, label, detail }) => (
          <li
            key={label}
            className="group rounded-[1.75rem] border border-border/70 bg-card/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_25px_60px_-40px_rgba(15,23,42,0.4)]"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <h3 className="mt-4 font-heading text-base font-bold tracking-tight">{label}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{detail}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
