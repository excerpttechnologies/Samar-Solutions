import { getAdminSession } from '@/lib/auth'
import { apiJson, unauthorized } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  return apiJson({
    admin: session.admin,
    expiresAt: session.expiresAt,
    sessionHours: session.sessionHours,
  })
}
