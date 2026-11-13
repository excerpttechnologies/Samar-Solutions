import type { MediaAsset } from './types'

export class ApiRequestError extends Error {
  status: number
  fields: Record<string, string>

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.fields = fields ?? {}
  }
}

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function apiFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options
  const isBodyObject = body !== undefined && !(body instanceof FormData)

  const response = await fetch(url, {
    ...rest,
    credentials: 'same-origin',
    headers: {
      ...(isBodyObject ? { 'Content-Type': 'application/json' } : {}),
      ...(headers ?? {}),
    },
    body: isBodyObject ? JSON.stringify(body) : (body as BodyInit | undefined),
  })

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    // Some responses (e.g. 204) have no JSON body.
  }

  if (!response.ok) {
    const errorData =
      typeof data === 'object' && data !== null
        ? (data as { error?: unknown; fields?: unknown })
        : {}
    throw new ApiRequestError(
      typeof errorData.error === 'string' ? errorData.error : 'Something went wrong.',
      response.status,
      typeof errorData.fields === 'object' && errorData.fields !== null
        ? (errorData.fields as Record<string, string>)
        : undefined,
    )
  }

  return data as T
}

export async function uploadAsset(
  file: File,
  kind: 'image' | 'document' | 'video',
): Promise<MediaAsset> {
  const formData = new FormData()
  formData.set('file', file)
  formData.set('kind', kind)
  const result = await apiFetch<{ media: MediaAsset }>('/api/admin/media', {
    method: 'POST',
    body: formData,
  })
  return result.media
}
