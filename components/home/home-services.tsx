import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Cable, Cog, Settings, Sun, Wrench, Zap } from 'lucide-react'
import { Section, SectionHeading } from '@/components/section'

const services = [
  {
    href: '/solar-solutions',
    title: 'Solar Rooftop Solutions',
    body: 'Survey, design, supply, installation, net-metering assistance, and maintenance for rooftop solar systems.',
    icon: Sun,
    image: '/images/hero-solar-rooftop.png',
    alt: 'Solar panels installed on a rooftop',
  },
  {
    href: '/ev-charging-solutions',
    title: 'EV Charging Infrastructure',
    body: 'AC and DC charging solutions with site assessment, electrical infrastructure, installation, and support.',
    icon: Zap,
    image: '/images/ev-charging.png',
    alt: 'Electric vehicle charging infrastructure',
  },
  {
    href: '/epc-services',
    title: 'EPC Services',
    body: 'Engineering, procurement, construction, commissioning, monitoring, and technical support under one partner.',
    icon: Cable,
    image: '/images/epc-engineering.png',
    alt: 'Engineers coordinating an EPC project',
  },
]

const capabilities = [
  { title: 'Engineering Design', icon: Cog, href: '/epc-services' },
  { title: 'Installation & Commissioning', icon: Wrench, href: '/epc-services' },
  { title: 'Operations & Maintenance', icon: Settings, href: '/solar-solutions' },
]

export function HomeServices() {
  return (
    <Section id="solutions" labelledBy="solutions-title" tone="soft" className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="solutions-title"
            eyebrow="Our Solutions"
            title="Integrated energy and mobility infrastructure, engineered end to end"
            intro="From rooftop solar and EV charging to full EPC execution, SAMAR delivers practical, future-ready infrastructure with a single accountable partner."
          />
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          {services.map((service, index) => (
            <Link
              key={service.href}
              href={service.href}
              className={`group relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/70 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.45)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_90px_-45px_rgba(15,23,42,0.5)] ${index === 0 ? 'lg:col-span-7' : 'lg:col-span-5'}`}
            >
              <div className={`relative ${index === 0 ? 'aspect-[16/11] lg:aspect-[16/10]' : 'aspect-[16/11]'}`}>
                <Image src={service.image} alt={service.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/12 text-white ring-1 ring-white/20 backdrop-blur">
                    <service.icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="mt-4 max-w-md text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">{service.title}</h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/78 md:text-[15px]">{service.body}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Explore service
                    <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <ul className="mt-5 grid gap-4 md:grid-cols-3">
          {capabilities.map((item) => (
            <li key={item.title}>
              <Link href={item.href} className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/80 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-background">
                <span className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon aria-hidden="true" className="size-4" />
                  </span>
                  <span className="font-heading text-base font-bold tracking-tight">{item.title}</span>
                </span>
                <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground transition-all group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">Images are representative and do not depict SAMAR projects.</p>
      </div>
    </Section>
  )
}
