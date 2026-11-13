import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { mainNav, serviceNav, site } from '@/lib/site'
import type { SiteSettings } from '@/lib/types'
import { Wordmark } from './wordmark'
import { PlaceholderNote } from './placeholder-note'

export function SiteFooter({ settings }: { settings?: SiteSettings }) {
  const { phone, email, address } = settings
    ? { phone: settings.phone, email: settings.email, address: settings.address }
    : site.contact
  const partnership = settings?.partnership ?? site.partnership
  const hasContact = phone || email || address

  return (
    <footer className="relative overflow-hidden bg-ink text-ink-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.18),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.12),transparent_40%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <Wordmark tone="light" />
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-foreground/75 md:text-base">
            Engineering, procurement, and construction for solar rooftop systems, EV charging
            infrastructure, and renewable-energy projects. Established in {site.established}.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-foreground/65">{partnership}</p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-ink-foreground/20 bg-white/5 px-5 py-3 text-sm font-semibold text-ink-foreground transition-colors hover:bg-white/10"
          >
            Start a conversation
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <nav aria-label="Solutions" className="lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Solutions</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {serviceNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-foreground/75 transition-colors hover:text-ink-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company" className="lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Company</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {mainNav
              .filter((i) => !['/', '/solar-solutions', '/ev-charging-solutions', '/epc-services', '/contact'].includes(i.href))
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-ink-foreground/75 transition-colors hover:text-ink-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            <li>
              <Link href="/contact" className="text-ink-foreground/75 transition-colors hover:text-ink-foreground">
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-2 lg:col-span-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Contact</h2>
          {hasContact ? (
            <address className="mt-5 space-y-2 text-sm not-italic leading-relaxed text-ink-foreground/75">
              {address && <p className="whitespace-pre-line">{address}</p>}
              {phone && <p>{phone}</p>}
              {email && <p>{email}</p>}
            </address>
          ) : (
            <PlaceholderNote tone="dark" className="mt-5">
              Official phone, email, and office address. Add these in Admin → Website Settings.
            </PlaceholderNote>
          )}
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-foreground/55">
            <li><span className="cursor-default">Privacy Policy</span></li>
            <li><span className="cursor-default">Terms</span></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-ink-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-ink-foreground/55 md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Solar • EV Charging • EPC • Sustainable Infrastructure</p>
        </div>
      </div>
    </footer>
  )
}
