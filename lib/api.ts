import { NextResponse } from 'next/server'

export type ApiFieldErrors = Record<string, string>

export function apiJson<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export function apiError(
  message: string,
  status = 400,
  fields?: ApiFieldErrors,
): NextResponse {
  return apiJson({ error: message, ...(fields ? { fields } : {}) }, status)
}

export function unauthorized(): NextResponse {
  return apiError('Authentication required.', 401)
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    return null
  }
}

/**
 * Basic CSRF defence for cookie-authenticated admin endpoints.
 * Browsers send Origin on cross-site and same-site POST/PUT/DELETE requests.
 */
export function sameOrigin(request: Request): boolean {
  const method = request.method.toUpperCase()
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return true

  const origin = request.headers.get('origin')
  if (!origin) return true

  const configured = (process.env.ADMIN_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  if (configured.includes(origin)) return true

  try {
    const originHost = new URL(origin).host
    const host = request.headers.get('host')
    return Boolean(host && originHost === host)
  } catch {
    return false
  }
}

export function csrfError(): NextResponse {
  return apiError('Request origin could not be verified.', 403)
}

export function parseId(value: string | undefined): number | null {
  if (!value) return null
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
