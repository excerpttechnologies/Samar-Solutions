import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { requireAdminPage } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | SAMAR Admin',
  },
  robots: { index: false, follow: false },
}

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAdminPage()
  return <AdminShell admin={session.admin}>{children}</AdminShell>
}
