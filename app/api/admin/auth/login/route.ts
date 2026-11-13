import { createSession, getSessionCookieOptions, verifyAdminCredentials } from '@/lib/auth'
import { apiError, apiJson, csrfError, readJson, sameOrigin } from '@/lib/api'
import { checkRateLimit, clearRateLimit, getClientIp } from '@/lib/rate-limit'
import { parseLoginPayload } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return csrfError()

  const parsed = parseLoginPayload(await readJson(request))
  if (!parsed.ok) {
    return apiError('Please check the login details.', 400, parsed.errors)
  }

  const ip = getClientIp(request)
  const email = parsed.value.email.toLowerCase()
  const ipKey = `login:ip:${ip}`
  const accountKey = `login:account:${ip}:${email}`

  const ipLimit = checkRateLimit(ipKey, 10, 15 * 60 * 1000)
  const accountLimit = checkRateLimit(accountKey, 5, 15 * 60 * 1000)

  if (!ipLimit.allowed || !accountLimit.allowed) {
    const retryAfter = Math.max(ipLimit.retryAfterSeconds, accountLimit.retryAfterSeconds)
    const response = apiError(
      'Too many sign-in attempts. Please wait and try again.',
      429,
    )
    response.headers.set('Retry-After', String(retryAfter))
    return response
  }

  const admin = await verifyAdminCredentials(parsed.value.email, parsed.value.password)
  if (!admin) {
    return apiError('Invalid email or password.', 401)
  }

  clearRateLimit(ipKey, accountKey)
  const session = createSession(admin.id)
  const response = apiJson({
    admin,
    expiresAt: session.expiresAt,
  })
  response.cookies.set({
    ...getSessionCookieOptions(session.expiresAt),
    value: session.token,
  })
  return response
}
