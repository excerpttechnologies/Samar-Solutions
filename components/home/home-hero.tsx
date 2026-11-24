import { CtaLink } from '@/components/cta-link'
import { CONTACT } from '@/lib/contact'

export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-white text-foreground"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,82,155,0.08),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(35,155,104,0.10),transparent_45%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(to_right,#073b70_1px,transparent_1px),linear-gradient(to_bottom,#073b70_1px,transparent_1px)] [background-size:72px_72px]"
      />

      <div className="mx-auto flex min-h-[70svh] max-w-7xl flex-col items-center justify-center px-4 pb-20 pt-32 text-center md:px-6 md:pb-28 md:pt-44">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#239b68]/25 bg-[#239b68]/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#239b68]">
          Authorised TATA Power Solaroof Channel Partner
        </p>
        <h1
          id="hero-title"
          className="max-w-[900px] text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.28] tracking-tight text-[#073b70]"
        >
          The Future of Energy
          <span className="block text-primary">Is Solar.</span>
        </h1>
        <p className="mt-6 max-w-[900px] text-pretty text-[clamp(1rem,2vw,1.375rem)] font-medium leading-[1.4] text-[#243447]/80">
          Powering a Sustainable Future with SAMAR Solutions.
        </p>

        <div className="mt-10 max-w-2xl">
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            SAMAR SOLUTIONS INDIA PVT. LTD. is an independent company delivering solar, EV charging, and
            renewable-energy infrastructure projects across India.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#239b68]">
            Solar Rooftop, EV Charging Stations
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <CtaLink href={`tel:${CONTACT.primary.tel}`} variant="primary" arrow>
            Get Free Quote
          </CtaLink>
          <CtaLink href="/solar-solutions" variant="outline">
            Explore Solar Rooftop
          </CtaLink>
        </div>
      </div>
    </section>
  )
}
