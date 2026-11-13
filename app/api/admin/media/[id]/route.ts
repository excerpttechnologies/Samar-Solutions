import { adminGuard } from '@/lib/admin-route'
import { apiError, apiJson, parseId } from '@/lib/api'
import { deleteMediaAsset, UploadError } from '@/lib/uploads'

export const dynamic = 'force-dynamic'
type RouteContext = { params: Promise<{ id: string }> }

export async function DELETE(request: Request, context: RouteContext) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response

  const id = parseId((await context.params).id)
  if (!id) return apiError('Invalid media ID.', 400)

  try {
    deleteMediaAsset(id)
    return apiJson({ success: true })
  } catch (error) {
    if (error instanceof UploadError) return apiError(error.message, error.status)
    console.error('Failed to delete media', error)
    return apiError('The media file could not be deleted. Please try again.', 500)
  }
}
