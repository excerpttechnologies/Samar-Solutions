'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { phones } from '@/lib/contact'
import { mainNav, site } from '@/lib/site'
import { cn } from '@/lib/utils'
import { BrandLogo } from './brand-logo'
import { SocialLinks } from './social-links'

export function SiteHeader({ partnership }: { partnership?: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const isHome = pathname === '/'
  const transparent = isHome && !scrolled && !open

  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const navItems = mainNav

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        transparent
          ? 'border-b border-[#00529b]/10 bg-white/90 text-[#243447] backdrop-blur-md'
          : 'border-b border-[#00529b]/10 bg-white/97 text-[#243447] shadow-[0_12px_30px_-24px_rgba(7,59,112,0.45)] backdrop-blur-xl',
      )}
    >
      <div
        className={cn(
          'hidden overflow-hidden border-b transition-colors md:block',
          transparent ? 'border-[#00529b]/10 bg-white' : 'border-[#00529b]/10 bg-[#f5f7fa]',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <p className="hidden min-w-0 items-center gap-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#073b70]/80 lg:flex">
            <span aria-hidden="true" className="inline-block size-1.5 shrink-0 rounded-full bg-[#239b68] shadow-[0_0_0_4px_rgba(35,155,104,0.15)]" />
            <span className="truncate">{partnership ?? site.partnership}</span>
          </p>
          <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:justify-end">
            <div className="flex items-center gap-3 text-[12px] font-semibold tracking-wide text-[#073b70]">
              {phones.map((phone) => (
                <a key={phone.href} href={phone.href} className="whitespace-nowrap transition-colors hover:text-[#00529b]">
                  {phone.label}
                </a>
              ))}
            </div>
            <SocialLinks iconClassName="size-8" />
          </div>
        </div>
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6 lg:h-[4.75rem]">
        <BrandLogo tone="dark" size="md" priority className="shrink-0" />

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-all hover:bg-[#00529b]/8 hover:text-[#00529b]',
                      active ? 'bg-[#00529b]/10 text-[#00529b]' : 'text-[#243447]/85',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-[#00529b]/20 bg-[#00529b]/5 text-[#073b70] transition-colors hover:bg-[#00529b]/10 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[#00529b]/10 bg-white pb-24 text-[#243447] xl:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col px-4 py-4 md:px-6">
            {mainNav.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <li key={item.href} className="border-b border-[#00529b]/10">
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block py-4 font-heading text-xl font-semibold tracking-tight',
                      active ? 'text-[#00529b]' : 'text-[#073b70]',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
            <li className="flex flex-wrap gap-x-5 gap-y-2 pt-6 text-sm font-semibold text-[#073b70]">
              {phones.map((phone) => (
                <a key={phone.href} href={phone.href} className="hover:text-[#00529b]">
                  {phone.label}
                </a>
              ))}
            </li>
            <li className="pt-2">
              <SocialLinks />
            </li>
            <li className="pt-5 text-xs leading-relaxed text-[#687789]">
              {partnership ?? site.partnership}
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
