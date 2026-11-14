import Image from 'next/image'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { CtaLink } from '@/components/cta-link'
import { site } from '@/lib/site'

export function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate min-h-[94svh] overflow-hidden bg-[#062d24] text-ink-foreground">
      <Image
        src="/images/projects/02-elevated-commercial-solar-array.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover animate-slow-zoom"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#062d24] via-[#062d24]/88 to-[#087f83]/25" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(244,198,94,0.22),transparent_38%),radial-gradient(ellipse_at_70%_80%,rgba(166,230,90,0.14),transparent_32%),radial-gradient(ellipse_at_bottom_right,rgba(8,127,131,0.25),transparent_40%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="mx-auto grid min-h-[92svh] max-w-7xl items-end gap-10 px-4 pb-16 pt-36 md:px-6 md:pb-20 md:pt-40 lg:grid-cols-12 lg:pb-24">
        <div className="lg:col-span-7 xl:col-span-8">
          <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-[#a6e65a] shadow-[0_0_0_4px_rgba(166,230,90,0.16)]" />
            Solar Energy • EV Infrastructure • EPC
          </p>
          <h1
            id="hero-title"
            className="mt-7 max-w-4xl animate-fade-up text-[2.65rem] font-extrabold leading-[1.02] tracking-tight [animation-delay:80ms] sm:text-5xl md:text-6xl lg:text-[4.2rem] xl:text-[4.8rem]"
          >
            Powering a Sustainable Future with
            <span className="block text-gradient-gold">Smarter Solar Solutions.</span>
          </h1>
          <p className="mt-7 max-w-2xl animate-fade-up text-pretty text-lg leading-relaxed text-white/82 [animation-delay:160ms] md:text-xl">
            SAMAR SOLUTIONS INDIA PVT. LTD. is committed to delivering professional solar energy
            solutions through quality installations, reliable engineering, and sustainable energy
            practices.
          </p>
          <div className="mt-10 flex animate-fade-up flex-wrap gap-3 [animation-delay:240ms]">
            <CtaLink href="/contact" variant="accent" arrow>
              Get a Quote
            </CtaLink>
            <CtaLink href="#solutions" variant="outline-light" arrow>
              Explore Solutions
            </CtaLink>
          </div>

          <dl className="mt-12 grid animate-fade-up gap-4 border-t border-white/12 pt-8 [animation-delay:320ms] sm:grid-cols-3">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-white/55">Established</dt>
              <dd className="mt-1 font-heading text-xl font-bold text-white">{site.established}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-white/55">Experience</dt>
              <dd className="mt-1 font-heading text-xl font-bold text-white">10+ Years</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-white/55">Delivery</dt>
              <dd className="mt-1 font-heading text-xl font-bold text-white">End-to-End EPC</dd>
            </div>
          </dl>
        </div>

        <div className="hidden lg:col-span-5 lg:block xl:col-span-4">
          <div className="animate-fade-up animate-float-soft rounded-3xl border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(166,230,90,0.08))] p-6 shadow-2xl backdrop-blur-xl [animation-delay:220ms]">
            <div className="flex items-center justify-between gap-4">
              <BrandLogo tone="light" size="sm" linked={false} />
              <span className="shrink-0 rounded-full border border-[#f4c65e]/25 bg-[#f4c65e]/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#f4c65e]">
                Trusted Partner
              </span>
            </div>
            <p className="mt-6 text-lg font-semibold leading-snug text-white">
              {site.partnership}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              SAMAR SOLUTIONS INDIA PVT. LTD. is an independent company delivering solar, EV charging, and
              renewable-energy infrastructure projects across India.
            </p>
            <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm text-white/80">
              <div className="flex items-center justify-between gap-4">
                <span>Solar Rooftop Solutions</span>
                <ArrowUpRight aria-hidden="true" className="size-4 text-accent" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>EV Charging Infrastructure</span>
                <ArrowUpRight aria-hidden="true" className="size-4 text-accent" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Engineering, Procurement & Construction</span>
                <ArrowUpRight aria-hidden="true" className="size-4 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#trust"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur transition-colors hover:bg-white/10 md:inline-flex"
      >
        Scroll to explore
        <ArrowDown aria-hidden="true" className="size-4 animate-bounce" />
      </a>
    </section>
  )
}
