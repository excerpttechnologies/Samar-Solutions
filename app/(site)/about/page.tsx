import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowUpRight, Handshake, Leaf, Lightbulb, ShieldCheck, Target, Users } from 'lucide-react'
import { CtaBand, JourneySteps } from '@/components/blocks'
import { CtaLink } from '@/components/cta-link'
import { PageHero } from '@/components/page-hero'
import { Eyebrow, Section, SectionHeading } from '@/components/section'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Established in 2013, SAMAR Solutions India Pvt. Ltd. provides renewable-energy and sustainable-infrastructure solutions across the full project lifecycle.',
}

const mission = [
  'Accelerate the adoption of renewable energy across India.',
  'Deliver high-quality EPC services with a focus on safety and excellence.',
  'Promote sustainable transportation through robust EV charging infrastructure.',
  'Create long-term value for customers through reliable and cost-effective solutions.',
  'Contribute towards a cleaner and energy-independent future.',
]

const values = [
  { icon: Lightbulb, title: 'Innovation', body: 'Practical, future-ready approaches to energy and mobility infrastructure.' },
  { icon: Target, title: 'Quality', body: 'Industry-approved products, engineering best practices, and disciplined controls.' },
  { icon: ShieldCheck, title: 'Safety', body: 'Safety prioritized across design, installation, commissioning, and maintenance.' },
  { icon: Leaf, title: 'Environmental Responsibility', body: 'Helping customers move toward cleaner energy and sustainable transport.' },
  { icon: Users, title: 'Customer-Focused Execution', body: 'Solutions shaped around each site, requirement, and long-term priority.' },
]

const strengths = [
  'End-to-end renewable energy and EV infrastructure delivery',
  'Engineering-led planning, procurement, and execution capability',
  'Authorized channel partnership with TATA Power Renewable Energy',
  'Focus on quality, safety, and long-term technical support',
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A trusted engineering partner for solar, EV charging, and sustainable infrastructure"
        intro={`Established in ${site.established}, SAMAR Solutions India Pvt. Ltd. delivers renewable-energy and electric mobility infrastructure through practical engineering, disciplined execution, and long-term support.`}
        image="/images/epc-engineering.png"
        imageAlt="Engineers coordinating renewable energy project work"
        ctaLabel="Get a Quote"
      />

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#e8dcc4_0%,#ddebe1_45%,#d2e7da_100%)] py-20 md:py-28">
        <div aria-hidden="true" className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#087a55]/10 blur-3xl" />
        <div aria-hidden="true" className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#f2a541]/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 md:px-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-45px_rgba(6,45,36,0.55)]">
                <Image src="/images/hero-solar-rooftop.png" alt="Solar infrastructure representing SAMAR's work" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#062d24]/55 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-2 rounded-2xl border border-white/30 bg-white/35 p-5 shadow-xl backdrop-blur-xl md:-right-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#062d24]">Established</p>
                <p className="mt-1 font-heading text-3xl font-extrabold text-[#062d24]">{site.established}</p>
                <p className="mt-1 text-sm text-[#062d24]/75">10+ years of experience</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <Eyebrow>About SAMAR</Eyebrow>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.06] tracking-tight text-[#062d24] md:text-4xl lg:text-5xl">
              Building cleaner energy and smarter mobility infrastructure with engineering credibility
            </h2>
            <div className="mt-7 space-y-5 text-base leading-relaxed text-[#1b3a31]/80 md:text-lg">
              <p>
                SAMAR Solutions India Pvt. Ltd. works with businesses, institutions, and communities to plan
                and deliver solar rooftop systems, EV charging infrastructure, and renewable-energy projects.
                As an EPC company, we bring engineering, procurement, and construction together under one
                accountable team.
              </p>
              <p>
                From site assessment and system design to installation, commissioning, and maintenance, our
                approach is shaped by quality, safety, and practical execution for long-term infrastructure
                performance.
              </p>
            </div>
            <div className="mt-8 flex items-start gap-3 rounded-3xl border border-[#087a55]/20 bg-gradient-to-r from-[#087a55]/12 to-[#087f83]/10 p-5">
              <Handshake aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#087a55]" />
              <p className="text-sm leading-relaxed text-[#062d24]/85">
                <span className="font-semibold">{site.partnership}.</span> SAMAR Solutions India Pvt. Ltd.
                is an independent company; this website is SAMAR’s own and is not a TATA Power website.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#062d24] py-20 text-white md:py-28">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,198,94,0.16),transparent_35%),radial-gradient(ellipse_at_bottom_left,rgba(8,127,131,0.22),transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-6 px-4 md:px-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#087a55]/35 to-[#062d24]/80 p-8 backdrop-blur md:p-10">
            <Eyebrow tone="ink">Vision</Eyebrow>
            <h2 className="mt-5 text-2xl font-bold leading-snug tracking-tight md:text-3xl">
              “To be a trusted leader in renewable energy and electric mobility solutions by enabling
              sustainable growth through innovative, efficient, and future-ready infrastructure.”
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/72 md:text-base">
              We aim to support a cleaner energy future through dependable engineering and infrastructure
              that serves people, businesses, and communities.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#087f83]/30 via-[#0b3a31]/70 to-[#151c1b] p-8 backdrop-blur md:p-10">
            <Eyebrow tone="ink">Mission</Eyebrow>
            <ol className="mt-6 space-y-4">
              {mission.map((item, i) => (
                <li key={item} className="flex gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#a6e65a]/15 font-mono text-xs font-semibold text-[#a6e65a]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="leading-relaxed text-white/82">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <Section labelledBy="strengths-title" className="bg-[linear-gradient(180deg,#ddebe1_0%,#e8dcc4_100%)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <SectionHeading
              id="strengths-title"
              eyebrow="Company Strengths"
              title="Engineering capability, trusted partnership, and end-to-end execution"
              intro="SAMAR combines technical planning, on-ground delivery, and lifecycle support to help customers adopt renewable energy and EV infrastructure with confidence."
            />
            <div className="mt-8 space-y-3">
              {strengths.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#087a55]/15 bg-white/30 px-4 py-4 backdrop-blur-sm">
                  <ArrowUpRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#087a55]" />
                  <p className="text-sm font-medium leading-snug text-[#062d24]">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[2rem]">
              <div className="relative aspect-[16/11]">
                <Image src="/images/ev-charging.png" alt="EV charging and renewable energy infrastructure" fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#062d24]/70 via-[#062d24]/20 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 grid gap-3 p-4 sm:grid-cols-3 sm:p-6">
                {[{ label: 'Established', value: String(site.established) }, { label: 'Experience', value: '10+ Years' }, { label: 'Delivery', value: 'End-to-End EPC' }].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/20 bg-white/12 p-4 backdrop-blur-md">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">{stat.label}</p>
                    <p className="mt-1 font-heading text-xl font-extrabold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#087a55_0%,#087f83_55%,#062d24_100%)] py-20 text-white md:py-28">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,198,94,0.18),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(166,230,90,0.14),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeading
            tone="ink"
            eyebrow="Our Values"
            title="Innovation, Quality, Safety, Environmental Responsibility, and Customer-Focused Execution"
            intro="These commitments guide how we plan, build, and support renewable energy and EV infrastructure projects."
            align="center"
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {values.map(({ icon: Icon, title, body }, index) => (
              <li
                key={title}
                className={`rounded-[1.75rem] border border-white/15 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 ${
                  index % 2 === 0 ? 'bg-white/10' : 'bg-[#062d24]/25'
                } ${index === 0 ? 'lg:col-span-1' : ''}`}
              >
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f4c65e]/30 to-[#a6e65a]/20 text-[#f4c65e] ring-1 ring-white/15">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold leading-snug">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section labelledBy="lifecycle-title" className="bg-[linear-gradient(180deg,#e8dcc4_0%,#ddebe1_100%)]">
        <SectionHeading
          id="lifecycle-title"
          eyebrow="How We Work"
          title="From site assessment to long-term maintenance"
          intro="A structured project journey helps keep engineering, execution, and support aligned at every stage."
        />
        <div className="mt-12 rounded-[2rem] border border-[#087a55]/15 bg-gradient-to-br from-white/35 to-[#087a55]/8 p-6 backdrop-blur-sm md:p-10">
          <JourneySteps />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink href="/contact" variant="accent" arrow>Get a Quote</CtaLink>
          <CtaLink href="/projects" variant="outline">View Projects</CtaLink>
        </div>
      </Section>

      <CtaBand title="Let’s build reliable, future-ready energy infrastructure" body="Discuss your solar, EV charging, or EPC requirements with a team focused on practical engineering and quality delivery." />
    </>
  )
}
