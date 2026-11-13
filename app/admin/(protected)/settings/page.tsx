import type { Metadata } from 'next'
import { SettingsForm } from '@/components/admin/settings-form'
import { requireAdminPage } from '@/lib/auth'
import { getSiteSettings } from '@/lib/settings'

export const metadata: Metadata = { title: 'Website Settings' }

export default async function AdminSettingsPage() {
  const session = await requireAdminPage()
  const settings = getSiteSettings()

  return (
    <div>
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Configuration
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl">
          Website settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage public contact details, website branding, and the administrator password.
        </p>
      </div>
      <div className="mt-8">
        <SettingsForm
          settings={settings}
          adminName={session.admin.name}
          adminEmail={session.admin.email}
          sessionHours={session.sessionHours}
        />
      </div>
    </div>
  )
}
