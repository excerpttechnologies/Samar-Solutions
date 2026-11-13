import { adminGuard } from '@/lib/admin-route'
import { apiError, apiJson, parseId, readJson } from '@/lib/api'
import { isUniqueConstraintError } from '@/lib/db'
import {
  categoryExists,
  deleteProject,
  getAdminProject,
  projectSlugExists,
  updateProject,
} from '@/lib/projects'
import { parseProjectPayload } from '@/lib/validation'

export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response

  const id = parseId((await context.params).id)
  if (!id) return apiError('Invalid project ID.', 400)

  const project = getAdminProject(id)
  if (!project) return apiError('Project not found.', 404)
  return apiJson({ project })
}

export async function PUT(request: Request, context: RouteContext) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response

  const id = parseId((await context.params).id)
  if (!id) return apiError('Invalid project ID.', 400)
  if (!getAdminProject(id)) return apiError('Project not found.', 404)

  const parsed = parseProjectPayload(await readJson(request))
  if (!parsed.ok) return apiError('Please check the project fields.', 400, parsed.errors)

  if (parsed.value.categoryId && !categoryExists(parsed.value.categoryId)) {
    return apiError('Please check the project fields.', 400, {
      categoryId: 'The selected category no longer exists.',
    })
  }

  if (projectSlugExists(parsed.value.slug, id)) {
    return apiError('A project with this slug already exists.', 409, {
      slug: 'This slug is already in use. Choose another.',
    })
  }

  try {
    const project = updateProject(id, parsed.value)
    if (!project) return apiError('Project not found.', 404)
    return apiJson({ project })
  } catch (error) {
    if (isUniqueConstraintError(error, 'projects.slug')) {
      return apiError('A project with this slug already exists.', 409, {
        slug: 'This slug is already in use. Choose another.',
      })
    }
    console.error('Failed to update project', error)
    return apiError('The project could not be updated. Please try again.', 500)
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response

  const id = parseId((await context.params).id)
  if (!id) return apiError('Invalid project ID.', 400)

  if (!deleteProject(id)) return apiError('Project not found.', 404)
  return apiJson({ success: true })
}
