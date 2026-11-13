import { compare } from 'bcryptjs'
import {
  destroyAllSessions,
  getAdminByEmail,
  SESSION_COOKIE_NAME,
  updateAdminPassword,
} from '@/lib/auth'
import { adminGuard } from '@/lib/admin-route'
import { apiError, apiJson, readJson } from '@/lib/api'
import { parsePasswordChangePayload } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response

  const parsed = parsePasswordChangePayload(await readJson(request))
  if (!parsed.ok) {
    return apiError('Please check the password fields.', 400, parsed.errors)
  }

  const admin = getAdminByEmail(guard.session.admin.email)
  if (!admin) return apiError('Admin account not found.', 404)

  const validCurrent = await compare(parsed.value.currentPassword, admin.passwordHash)
  if (!validCurrent) {
    return apiError('Current password is incorrect.', 400, {
      currentPassword: 'Current password is incorrect.',
    })
  }

  await updateAdminPassword(admin.id, parsed.value.newPassword)
  destroyAllSessions()

  const response = apiJson({
    success: true,
    message: 'Password updated. Please sign in again.',
  })
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  })
  return response
}
