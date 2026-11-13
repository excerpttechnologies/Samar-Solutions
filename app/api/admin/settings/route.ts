import { adminGuard } from '@/lib/admin-route'
import { apiError, apiJson, readJson } from '@/lib/api'
import { getSiteSettings, updateSiteSettings } from '@/lib/settings'
import { parseSettingsPayload } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response
  return apiJson({ settings: getSiteSettings() })
}

export async function PUT(request: Request) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response

  const parsed = parseSettingsPayload(await readJson(request))
  if (!parsed.ok) return apiError('Please check the settings fields.', 400, parsed.errors)

  const settings = updateSiteSettings(parsed.value)
  return apiJson({ settings })
}
