import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getSiteSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <>
      <SiteHeader partnership={settings.partnership ?? undefined} />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <SiteFooter settings={settings} />
    </>
  )
}
