import { adminGuard } from '@/lib/admin-route'
import { apiError, apiJson, readJson } from '@/lib/api'
import { createCategory, getCategories } from '@/lib/categories'
import { isUniqueConstraintError } from '@/lib/db'
import { parseCategoryPayload } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response
  return apiJson({ categories: getCategories() })
}

export async function POST(request: Request) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response

  const parsed = parseCategoryPayload(await readJson(request))
  if (!parsed.ok) return apiError('Please check the category fields.', 400, parsed.errors)

  try {
    const category = createCategory(parsed.value)
    return apiJson({ category }, 201)
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const message = isUniqueConstraintError(error, 'categories.name')
        ? 'A category with this name already exists.'
        : 'A category with this slug already exists.'
      return apiError(message, 409, {
        name: isUniqueConstraintError(error, 'categories.name')
          ? message
          : '',
        slug: isUniqueConstraintError(error, 'categories.slug') ? message : '',
      })
    }
    console.error('Failed to create category', error)
    return apiError('The category could not be created. Please try again.', 500)
  }
}
