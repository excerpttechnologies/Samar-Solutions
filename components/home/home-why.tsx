import { Award, CalendarRange, Handshake, Layers, ShieldCheck, Users } from 'lucide-react'
import { Section, SectionHeading } from '@/components/section'

const differentiators = [
  {
    icon: CalendarRange,
    title: 'Established engineering experience',
    body: 'Established in 2013, SAMAR brings more than a decade of experience in renewable energy and sustainable infrastructure.',
  },
  {
    icon: Handshake,
    title: 'Authorized TATA Power Renewable Energy partnership',
    body: 'SAMAR SOLUTIONS INDIA PVT. LTD. is an Authorized Channel Partner of TATA Power Renewable Energy Ltd.',
  },
  {
    icon: Layers,
    title: 'End-to-end execution capabilities',
    body: 'One accountable partner from assessment and design through procurement, installation, commissioning, and support.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality-focused project delivery',
    body: 'Industry-approved products, engineering best practices, and disciplined execution across each project stage.',
  },
  {
    icon: Users,
    title: 'Customer-oriented solutions',
    body: 'Solutions shaped around site conditions, operational needs, and long-term performance priorities.',
  },
  {
    icon: Award,
    title: 'Technical support and maintenance',
    body: 'After-handover support to help installed solar and EV infrastructure continue performing reliably.',
  },
]

export function HomeWhy() {
  return (
    <Section tone="muted" labelledBy="why-title" className="overflow-hidden">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <SectionHeading
          id="why-title"
          eyebrow="Why Choose SAMAR"
          title="A dependable partner for long-term energy and mobility infrastructure"
          intro="Renewable-energy and charging systems are long-term investments. We focus on practical engineering, quality execution, and support you can rely on."
          className="lg:col-span-4"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {differentiators.map((item, index) => (
            <li
              key={item.title}
              className={`group rounded-[1.75rem] border border-border/70 bg-card/80 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_25px_60px_-40px_rgba(15,23,42,0.4)] ${index === 0 ? 'sm:col-span-2' : ''}`}
            >
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-5 text-xl font-bold leading-snug tracking-tight">{item.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
