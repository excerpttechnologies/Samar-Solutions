import type { Metadata } from 'next'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { Eyebrow, Section } from '@/components/section'
import { PlaceholderNote } from '@/components/placeholder-note'
import { getSiteSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Request a consultation with SAMAR Solutions India for solar rooftop, EV charging, or renewable-energy EPC projects.',
}

export const dynamic = 'force-dynamic'

export default function ContactPage() {
  const { phone, email, address, hours } = getSiteSettings()
  const details = [
    { label: 'Phone', value: phone, icon: Phone },
    { label: 'Email', value: email, icon: Mail },
    { label: 'Office address', value: address, icon: MapPin },
    { label: 'Business hours', value: hours, icon: Clock },
  ]

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink pt-28 text-ink-foreground md:pt-32 lg:pt-36">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.22),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.14),transparent_40%)]" />
        <div className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-20">
          <Eyebrow tone="ink">Contact Us</Eyebrow>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.03] tracking-tight md:text-5xl lg:text-6xl">
            Let’s discuss your solar, EV charging, or EPC project
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-foreground/78 md:text-xl">
            Share your site details and requirements. We’ll use them to understand your project and plan the
            right next steps.
          </p>
        </div>
      </section>

      <Section className="bg-[linear-gradient(180deg,#ddebe1_0%,#e8dcc4_100%)] pt-16 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Get in touch</h2>
            <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
              Reach out for consultations, site assessments, and project discussions across solar, EV
              charging, and EPC services.
            </p>

            <dl className="mt-8 space-y-4">
              {details.map((d) => (
                <div key={d.label} className="rounded-2xl border border-border/70 bg-card/70 p-5">
                  <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <d.icon aria-hidden="true" className="size-4 text-primary" />
                    {d.label}
                  </dt>
                  <dd className="mt-2">
                    {d.value ? (
                      <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-foreground">{d.value}</p>
                    ) : (
                      <PlaceholderNote label={`${d.label} — to be provided`} className="p-3" />
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 rounded-[1.75rem] bg-gradient-to-br from-primary to-emerald p-6 text-primary-foreground">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Project Enquiry</p>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/85">
                Tell us about your site, goals, and timeline. Our team can help you identify the right
                solution and next steps.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)] md:p-10">
              <h2 className="text-2xl font-extrabold tracking-tight">Request a Consultation</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fields marked <span aria-hidden="true">*</span>
                <span className="sr-only">with an asterisk</span> are required.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
