import { adminGuard } from '@/lib/admin-route'
import { apiError, apiJson, parseId, readJson } from '@/lib/api'
import { deleteCategory, getCategoryById, updateCategory } from '@/lib/categories'
import { isUniqueConstraintError } from '@/lib/db'
import { parseCategoryPayload } from '@/lib/validation'

export const dynamic = 'force-dynamic'
type RouteContext = { params: Promise<{ id: string }> }

export async function PUT(request: Request, context: RouteContext) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response

  const id = parseId((await context.params).id)
  if (!id) return apiError('Invalid category ID.', 400)
  if (!getCategoryById(id)) return apiError('Category not found.', 404)

  const parsed = parseCategoryPayload(await readJson(request))
  if (!parsed.ok) return apiError('Please check the category fields.', 400, parsed.errors)

  try {
    const category = updateCategory(id, parsed.value)
    if (!category) return apiError('Category not found.', 404)
    return apiJson({ category })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return apiError('A category with this name or slug already exists.', 409)
    }
    console.error('Failed to update category', error)
    return apiError('The category could not be updated. Please try again.', 500)
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response

  const id = parseId((await context.params).id)
  if (!id) return apiError('Invalid category ID.', 400)

  if (!deleteCategory(id)) return apiError('Category not found.', 404)
  return apiJson({ success: true })
}
