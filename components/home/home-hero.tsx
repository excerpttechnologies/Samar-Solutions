export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-[#062d24] text-ink-foreground"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(244,198,94,0.16),transparent_42%),radial-gradient(ellipse_at_bottom_right,rgba(8,127,131,0.22),transparent_45%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:72px_72px]"
      />

      <div className="mx-auto flex min-h-[70svh] max-w-7xl flex-col items-center justify-center px-4 pb-20 pt-32 text-center md:px-6 md:pb-28 md:pt-44">
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a6e65a]">
          Solar Roof top, EV charging Station, Solar pumps, Solar lights
        </p>
        <h1
          id="hero-title"
          className="max-w-[900px] text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.3] tracking-tight text-white"
        >
          The Future of Energy
          <span className="block text-accent">Is Solar.</span>
        </h1>
        <p className="mt-6 max-w-[900px] text-pretty text-[clamp(1rem,2vw,1.375rem)] font-medium leading-[1.3] text-white/85">
          Powering a Sustainable Future with SAMAR Solutions.
        </p>

        <div className="mt-10 max-w-2xl">
          <p className="text-pretty text-sm leading-relaxed text-white/72 md:text-base">
            SAMAR SOLUTIONS INDIA PVT. LTD. is an independent company delivering solar, EV charging, and
            renewable-energy infrastructure projects across India.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#a6e65a]">
            Solar Rooftop, EV Charging Stations
          </p>
        </div>
      </div>
    </section>
  )
}
