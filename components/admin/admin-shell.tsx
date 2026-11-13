'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ExternalLink,
  FolderKanban,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  Tags,
  X,
} from 'lucide-react'
import { Wordmark } from '@/components/wordmark'
import { cn } from '@/lib/utils'
import { ToastProvider, useToast } from './toast'

type AdminInfo = {
  name: string
  email: string
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'All Projects', icon: FolderKanban },
  { href: '/admin/projects/new', label: 'Add New Project', icon: PlusCircle },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/media', label: 'Media Library', icon: Images },
  { href: '/admin/settings', label: 'Website Settings', icon: Settings },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/admin/dashboard') return pathname === href
  if (href === '/admin/projects/new') return pathname === href
  if (href === '/admin/projects') {
    return pathname === '/admin/projects' || (pathname.startsWith('/admin/projects/') && pathname !== '/admin/projects/new')
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Admin" className="mt-8 flex-1">
      <p className="px-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink-foreground/40">
        Manage
      </p>
      <ul className="mt-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href)
          const Icon = item.icon
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-ink-foreground/70 hover:bg-ink-foreground/10 hover:text-ink-foreground',
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function SignOutButton({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const router = useRouter()
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  async function signOut() {
    setBusy(true)
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      })
      if (!response.ok) throw new Error('Sign out failed')
      router.replace('/admin/login')
      router.refresh()
    } catch {
      toast.error('Could not sign out', 'Please try again.')
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className={cn(
        'inline-flex items-center gap-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-60',
        className,
      )}
    >
      <LogOut aria-hidden="true" className="size-4 shrink-0" />
      {!compact && (busy ? 'Signing out…' : 'Logout')}
      {compact && <span className="sr-only">Logout</span>}
    </button>
  )
}

function AdminShellInner({
  admin,
  children,
}: {
  admin: AdminInfo
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const initials =
    admin.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('') || 'A'

  return (
    <div className="min-h-dvh bg-muted/40">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        id="admin-sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-ink px-4 py-6 text-ink-foreground transition-transform duration-200 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between gap-3 px-2">
          <Wordmark tone="light" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-2 text-ink-foreground/70 hover:bg-ink-foreground/10 lg:hidden"
            aria-label="Close navigation"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <p className="mt-6 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-accent">
          Website administration
        </p>

        <NavLinks onNavigate={() => setMobileOpen(false)} />

        <div className="mt-6 space-y-2 border-t border-ink-foreground/10 pt-5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink-foreground/70 transition-colors hover:bg-ink-foreground/10 hover:text-ink-foreground"
          >
            <ExternalLink aria-hidden="true" className="size-4" />
            View website
          </Link>
          <SignOutButton className="w-full px-3 py-2.5 text-ink-foreground/70 hover:bg-destructive/20 hover:text-ink-foreground" />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
          <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-card lg:hidden"
                aria-label="Open admin navigation"
                aria-expanded={mobileOpen}
                aria-controls="admin-sidebar"
              >
                <Menu aria-hidden="true" className="size-5" />
              </button>
              <div>
                <p className="text-sm font-bold">Admin Panel</p>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  SAMAR Solutions India
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-tight">{admin.name}</p>
                <p className="text-xs text-muted-foreground">{admin.email}</p>
              </div>
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
              >
                {initials}
              </span>
              <button
                type="button"
                onClick={async () => {
                  setLoggingOut(true)
                  try {
                    const response = await fetch('/api/admin/auth/logout', {
                      method: 'POST',
                      credentials: 'same-origin',
                    })
                    if (!response.ok) throw new Error('Logout failed')
                    window.location.assign('/admin/login')
                  } catch {
                    setLoggingOut(false)
                  }
                }}
                disabled={loggingOut}
                className="hidden size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
                title="Logout"
              >
                <LogOut aria-hidden="true" className="size-4" />
                <span className="sr-only">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  )
}

export function AdminShell({
  admin,
  children,
}: {
  admin: AdminInfo
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <AdminShellInner admin={admin}>{children}</AdminShellInner>
    </ToastProvider>
  )
}
