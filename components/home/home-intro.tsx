import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { CtaLink } from '@/components/cta-link'
import { Eyebrow } from '@/components/section'
import { site } from '@/lib/site'

const highlights = [
  'Site assessment and feasibility planning',
  'Engineering design and procurement coordination',
  'Installation, commissioning, and technical support',
  'Authorized channel partnership with TATA Power Renewable Energy',
]

export function HomeIntro() {
  return (
    <section aria-labelledby="intro-title" className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      <div aria-hidden="true" className="absolute right-0 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-6 lg:grid-cols-12 lg:gap-16">
        <figure className="relative lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted shadow-[0_40px_90px_-50px_rgba(15,23,42,0.55)]">
            <Image
              src="/images/projects/05-industrial-roof-solar-inspection.webp"
              alt="Technician inspecting a solar array installed on an industrial rooftop"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 -right-2 max-w-[16rem] rounded-2xl border border-border/70 bg-card/95 p-5 shadow-xl backdrop-blur md:-right-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Established {site.established}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Trusted engineering partner for solar, EV charging, and sustainable infrastructure delivery.
            </p>
          </div>
        </figure>

        <div className="lg:col-span-7">
          <BrandLogo tone="dark" size="md" className="mb-7" />
          <Eyebrow>About SAMAR</Eyebrow>
          <h2 id="intro-title" className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-tight md:text-4xl lg:text-5xl">
            Engineering credibility, practical execution, and long-term energy value.
          </h2>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            SAMAR SOLUTIONS INDIA PVT. LTD. helps businesses, institutions, and communities adopt clean
            energy and electric mobility. We manage the full project lifecycle as one accountable partner
            from site assessment to long-term maintenance and technical support.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/50 px-4 py-4 text-sm font-medium leading-snug">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <CtaLink href="/about" arrow>
              Discover Our Company
            </CtaLink>
            <CtaLink href="/contact" variant="outline">
              Discuss Your Project
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  )
}
