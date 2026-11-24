import Link from 'next/link'
import { Phone } from 'lucide-react'
import { phones } from '@/lib/contact'
import { mainNav, serviceNav, site } from '@/lib/site'
import type { SiteSettings } from '@/lib/types'
import { BrandLogo } from './brand-logo'
import { PlaceholderNote } from './placeholder-note'
import { SocialLinks } from './social-links'

export function SiteFooter({ settings }: { settings?: SiteSettings }) {
  const { email, address } = settings
    ? { email: settings.email, address: settings.address }
    : site.contact
  const partnership = settings?.partnership ?? site.partnership
  const hasContact = Boolean(email || address)

  return (
    <footer className="relative overflow-hidden border-t border-[#00529b]/10 bg-[#f5f7fa] text-[#243447]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,82,155,0.06),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(35,155,104,0.07),transparent_40%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <BrandLogo tone="dark" size="lg" />
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[#243447]/80 md:text-base">
            Engineering, procurement, and construction for solar rooftop systems, EV charging
            infrastructure, and renewable-energy projects. Established in {site.established}.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{partnership}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {phones.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-full border border-[#00529b]/15 bg-white px-5 py-3 text-sm font-semibold text-[#073b70] shadow-sm transition-colors hover:border-[#00529b]/30 hover:text-[#00529b]"
              >
                <Phone aria-hidden="true" className="size-4 text-[#239b68]" />
                {item.label}
              </a>
            ))}
          </div>
          <SocialLinks className="mt-4 -ml-2" />
        </div>

        <nav aria-label="Solutions" className="lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00529b]">Solutions</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {serviceNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-[#243447]/80 transition-colors hover:text-[#00529b]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company" className="lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00529b]">Company</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {mainNav
              .filter((i) => !['/', '/solar-solutions', '/ev-charging-solutions', '/epc-services'].includes(i.href))
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[#243447]/80 transition-colors hover:text-[#00529b]">
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className="md:col-span-2 lg:col-span-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00529b]">Contact</h2>
          <address className="mt-5 space-y-2 text-sm not-italic leading-relaxed text-[#243447]/80">
            {phones.map((item) => (
              <p key={item.href}>
                <a href={item.href} className="font-semibold text-[#073b70] transition-colors hover:text-[#00529b]">
                  {item.label}
                </a>
              </p>
            ))}
            {address && <p className="whitespace-pre-line">{address}</p>}
            {email && <p>{email}</p>}
          </address>
          {!hasContact && (
            <PlaceholderNote className="mt-4">
              Office address and email to be added in Admin → Website Settings.
            </PlaceholderNote>
          )}
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <li><span className="cursor-default">Privacy Policy</span></li>
            <li><span className="cursor-default">Terms</span></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-[#00529b]/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} {site.legalName} All Rights Reserved.</p>
          <p>Solar • EV Charging • EPC • Sustainable Infrastructure</p>
        </div>
      </div>
    </footer>
  )
}
