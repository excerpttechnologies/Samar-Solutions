import { createHash } from 'node:crypto'
import { cookies } from 'next/headers'
import { destroySession, SESSION_COOKIE_NAME } from '@/lib/auth'
import { apiJson, csrfError, sameOrigin } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return csrfError()

  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (token) {
    destroySession(createHash('sha256').update(token).digest('hex'))
  }

  const response = apiJson({ success: true })
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
