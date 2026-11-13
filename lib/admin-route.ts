import type { NextResponse } from 'next/server'
import { getAdminSession, type AdminSession } from './auth'
import { csrfError, sameOrigin, unauthorized } from './api'

export type AdminGuardResult =
  | { ok: true; session: AdminSession }
  | { ok: false; response: NextResponse }

export async function adminGuard(request: Request): Promise<AdminGuardResult> {
  if (!sameOrigin(request)) return { ok: false, response: csrfError() }
  const session = await getAdminSession()
  if (!session) return { ok: false, response: unauthorized() }
  return { ok: true, session }
}
