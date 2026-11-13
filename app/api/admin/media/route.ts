import { adminGuard } from '@/lib/admin-route'
import { apiError, apiJson } from '@/lib/api'
import { listMedia, saveUpload, UploadError } from '@/lib/uploads'
import type { MediaAsset } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response

  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? 1)
  const pageSize = Number(url.searchParams.get('pageSize') ?? 24)
  const kindParam = url.searchParams.get('kind') ?? 'all'
  const kind = ['image', 'document', 'video'].includes(kindParam)
    ? (kindParam as MediaAsset['kind'])
    : 'all'

  return apiJson(
    listMedia({
      kind,
      page: Number.isFinite(page) ? page : 1,
      pageSize: Number.isFinite(pageSize) ? pageSize : 24,
    }),
  )
}

export async function POST(request: Request) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return apiError('The upload could not be read.', 400)
  }

  const file = formData.get('file')
  const kind = String(formData.get('kind') ?? 'image')
  if (!['image', 'document', 'video'].includes(kind)) {
    return apiError('Unsupported upload type.', 400)
  }

  try {
    const media = await saveUpload(file, kind)
    return apiJson({ media }, 201)
  } catch (error) {
    if (error instanceof UploadError) {
      return apiError(error.message, error.status)
    }
    console.error('Upload failed', error)
    return apiError('The file could not be uploaded. Please try again.', 500)
  }
}
