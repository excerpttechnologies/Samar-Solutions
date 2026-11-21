import { Award, CalendarRange, Handshake, Layers } from 'lucide-react'
import { site } from '@/lib/site'

const stats = [
  {
    icon: CalendarRange,
    label: 'Established',
    value: String(site.established),
    detail: 'Building renewable energy and infrastructure capability since 2013.',
  },
  {
    icon: Award,
    label: 'Experience',
    value: '10+ Years',
    detail: 'A decade of engineering, execution, and on-ground project delivery.',
  },
  {
    icon: Handshake,
    label: 'Partnership',
    value: 'TATA Power Renewable Energy',
    detail: 'Authorized Channel Partner for renewable energy solutions.',
  },
  {
    icon: Layers,
    label: 'Capability',
    value: 'End-to-End EPC',
    detail: 'From assessment and design to installation, commissioning, and maintenance.',
  },
]

export function HomeTrust() {
  return (
    <section id="trust" aria-label="Company trust and capabilities" className="relative -mt-10 bg-[linear-gradient(180deg,#062d24_0%,#ddebe1_100%)] pb-4 md:-mt-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,122,85,0.92),rgba(6,45,36,0.96))] p-4 text-white shadow-[0_40px_90px_-45px_rgba(6,45,36,0.8)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:-translate-y-0.5 hover:bg-white/10">
              <item.icon aria-hidden="true" className="size-5 text-[#a6e65a]" />
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">{item.label}</p>
              <p className="mt-2 font-heading text-xl font-extrabold leading-tight tracking-tight text-white">{item.value}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/72">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
