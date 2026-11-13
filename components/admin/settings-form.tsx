'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, ShieldCheck } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'
import { ApiRequestError, apiFetch } from '@/lib/api-client'
import {
  adminCardClass,
  adminErrorClass,
  adminHintClass,
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
} from './form-styles'
import { useToast } from './toast'

type SiteState = {
  partnership: string
  phone: string
  email: string
  address: string
  hours: string
}

type PasswordState = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function SettingsForm({
  settings,
  adminName,
  adminEmail,
  sessionHours,
}: {
  settings: SiteSettings
  adminName: string
  adminEmail: string
  sessionHours: number
}) {
  const router = useRouter()
  const toast = useToast()
  const [site, setSite] = useState<SiteState>({
    partnership: settings.partnership ?? '',
    phone: settings.phone ?? '',
    email: settings.email ?? '',
    address: settings.address ?? '',
    hours: settings.hours ?? '',
  })
  const [siteErrors, setSiteErrors] = useState<Record<string, string>>({})
  const [siteSaving, setSiteSaving] = useState(false)

  const [password, setPassword] = useState<PasswordState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [passwordSaving, setPasswordSaving] = useState(false)

  function updateSite<K extends keyof SiteState>(key: K, value: string) {
    setSite((current) => ({ ...current, [key]: value }))
    setSiteErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  async function saveSite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSiteErrors({})
    if (site.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email.trim())) {
      setSiteErrors({ email: 'Enter a valid email address.' })
      return
    }

    setSiteSaving(true)
    try {
      await apiFetch('/api/admin/settings', {
        method: 'PUT',
        body: {
          partnership: site.partnership.trim() || null,
          phone: site.phone.trim() || null,
          email: site.email.trim() || null,
          address: site.address.trim() || null,
          hours: site.hours.trim() || null,
        },
      })
      toast.success('Website settings saved.', 'Public contact details are up to date.')
      router.refresh()
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setSiteErrors(caught.fields)
        toast.error('Could not save settings', caught.message)
      } else {
        toast.error('Could not save settings', 'Please try again.')
      }
    } finally {
      setSiteSaving(false)
    }
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordErrors({})
    const next: Record<string, string> = {}
    if (!password.currentPassword) next.currentPassword = 'Current password is required.'
    if (password.newPassword.length < 10) {
      next.newPassword = 'Use at least 10 characters.'
    } else if (!/[A-Za-z]/.test(password.newPassword) || !/\d/.test(password.newPassword)) {
      next.newPassword = 'Include at least one letter and one number.'
    }
    if (password.newPassword !== password.confirmPassword) {
      next.confirmPassword = 'Passwords do not match.'
    }
    if (Object.keys(next).length > 0) {
      setPasswordErrors(next)
      return
    }

    setPasswordSaving(true)
    try {
      await apiFetch('/api/admin/auth/change-password', {
        method: 'POST',
        body: {
          currentPassword: password.currentPassword,
          newPassword: password.newPassword,
        },
      })
      toast.success('Password changed.', 'Please sign in again with your new password.')
      window.setTimeout(() => {
        router.replace('/admin/login')
        router.refresh()
      }, 900)
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setPasswordErrors(caught.fields)
        toast.error('Could not change password', caught.message)
      } else {
        toast.error('Could not change password', 'Please try again.')
      }
      setPasswordSaving(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className={`${adminCardClass} p-5 md:p-6 lg:col-span-2`}>
        <h2 className="text-lg font-bold">Website contact and branding</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          These details are shown in the website header, footer, and contact page.
        </p>
        <form onSubmit={saveSite} className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="settings-partnership" className={adminLabelClass}>
              Partnership line
            </label>
            <input
              id="settings-partnership"
              type="text"
              value={site.partnership}
              onChange={(event) => updateSite('partnership', event.target.value)}
              maxLength={300}
              className={adminInputClass}
              placeholder="Authorized Channel Partner of TATA Power Renewable Energy Ltd."
            />
            <p className={adminHintClass}>Shown in the top website bar and footer.</p>
            {siteErrors.partnership && (
              <p className={adminErrorClass}>{siteErrors.partnership}</p>
            )}
          </div>
          <div>
            <label htmlFor="settings-phone" className={adminLabelClass}>
              Phone
            </label>
            <input
              id="settings-phone"
              type="tel"
              value={site.phone}
              onChange={(event) => updateSite('phone', event.target.value)}
              maxLength={50}
              className={adminInputClass}
              placeholder="+91 …"
            />
            {siteErrors.phone && <p className={adminErrorClass}>{siteErrors.phone}</p>}
          </div>
          <div>
            <label htmlFor="settings-email" className={adminLabelClass}>
              Email
            </label>
            <input
              id="settings-email"
              type="email"
              value={site.email}
              onChange={(event) => updateSite('email', event.target.value)}
              maxLength={200}
              className={adminInputClass}
              placeholder="hello@example.com"
            />
            {siteErrors.email && <p className={adminErrorClass}>{siteErrors.email}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="settings-address" className={adminLabelClass}>
              Office address
            </label>
            <textarea
              id="settings-address"
              rows={3}
              value={site.address}
              onChange={(event) => updateSite('address', event.target.value)}
              maxLength={500}
              className={adminInputClass}
            />
            {siteErrors.address && <p className={adminErrorClass}>{siteErrors.address}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="settings-hours" className={adminLabelClass}>
              Business hours
            </label>
            <input
              id="settings-hours"
              type="text"
              value={site.hours}
              onChange={(event) => updateSite('hours', event.target.value)}
              maxLength={200}
              className={adminInputClass}
              placeholder="Monday–Saturday, 9:00 am – 6:00 pm"
            />
            {siteErrors.hours && <p className={adminErrorClass}>{siteErrors.hours}</p>}
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={siteSaving} className={adminPrimaryButtonClass}>
              {siteSaving ? (
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Save aria-hidden="true" className="size-4" />
              )}
              {siteSaving ? 'Saving…' : 'Save website settings'}
            </button>
          </div>
        </form>
      </section>

      <div className="space-y-6">
        <section className={`${adminCardClass} p-5 md:p-6`}>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Administrator</h2>
              <p className="text-xs text-muted-foreground">Single authorized account</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Name
              </dt>
              <dd className="mt-0.5 font-medium">{adminName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </dt>
              <dd className="mt-0.5 break-all font-medium">{adminEmail}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Session expiry
              </dt>
              <dd className="mt-0.5 font-medium">{sessionHours} hours of inactivity-safe expiry</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            There is no public registration or additional user management. Password resets
            outside the panel require server access.
          </p>
        </section>

        <section className={`${adminCardClass} p-5 md:p-6`}>
          <h2 className="text-lg font-bold">Change password</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All sessions will be signed out after a password change.
          </p>
          <form onSubmit={changePassword} className="mt-4 space-y-4">
            <div>
              <label htmlFor="current-password" className={adminLabelClass}>
                Current password
              </label>
              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={password.currentPassword}
                onChange={(event) =>
                  setPassword((current) => ({
                    ...current,
                    currentPassword: event.target.value,
                  }))
                }
                className={adminInputClass}
              />
              {passwordErrors.currentPassword && (
                <p className={adminErrorClass}>{passwordErrors.currentPassword}</p>
              )}
            </div>
            <div>
              <label htmlFor="new-password" className={adminLabelClass}>
                New password
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password.newPassword}
                onChange={(event) =>
                  setPassword((current) => ({
                    ...current,
                    newPassword: event.target.value,
                  }))
                }
                className={adminInputClass}
              />
              <p className={adminHintClass}>At least 10 characters with a letter and number.</p>
              {passwordErrors.newPassword && (
                <p className={adminErrorClass}>{passwordErrors.newPassword}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirm-password" className={adminLabelClass}>
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={password.confirmPassword}
                onChange={(event) =>
                  setPassword((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
                className={adminInputClass}
              />
              {passwordErrors.confirmPassword && (
                <p className={adminErrorClass}>{passwordErrors.confirmPassword}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={passwordSaving}
              className={`${adminPrimaryButtonClass} w-full`}
            >
              {passwordSaving ? (
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <ShieldCheck aria-hidden="true" className="size-4" />
              )}
              {passwordSaving ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
