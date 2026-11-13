import { adminGuard } from '@/lib/admin-route'
import { apiError, apiJson, readJson } from '@/lib/api'
import { isUniqueConstraintError } from '@/lib/db'
import {
  categoryExists,
  createProject,
  getAdminProjects,
  getProjectStatusCounts,
  projectSlugExists,
} from '@/lib/projects'
import { PROJECT_STATUSES, type ProjectStatus } from '@/lib/types'
import { parseProjectPayload } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response

  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? 1)
  const pageSize = Number(url.searchParams.get('pageSize') ?? 12)
  const search = url.searchParams.get('search') ?? undefined
  const statusParam = url.searchParams.get('status') ?? 'all'
  const status =
    statusParam === 'all' || PROJECT_STATUSES.includes(statusParam as ProjectStatus)
      ? (statusParam as ProjectStatus | 'all')
      : 'all'
  const categoryParam = url.searchParams.get('category')
  const categoryId = categoryParam ? Number(categoryParam) : null

  const result = getAdminProjects({
    search,
    status,
    categoryId:
      categoryId && Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null,
    page: Number.isFinite(page) ? page : 1,
    pageSize: Number.isFinite(pageSize) ? pageSize : 12,
  })

  return apiJson({ ...result, counts: getProjectStatusCounts() })
}

export async function POST(request: Request) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response

  const parsed = parseProjectPayload(await readJson(request))
  if (!parsed.ok) return apiError('Please check the project fields.', 400, parsed.errors)

  if (parsed.value.categoryId && !categoryExists(parsed.value.categoryId)) {
    return apiError('Please check the project fields.', 400, {
      categoryId: 'The selected category no longer exists.',
    })
  }

  if (projectSlugExists(parsed.value.slug)) {
    return apiError('A project with this slug already exists.', 409, {
      slug: 'This slug is already in use. Choose another.',
    })
  }

  try {
    const project = createProject(parsed.value)
    return apiJson({ project }, 201)
  } catch (error) {
    if (isUniqueConstraintError(error, 'projects.slug')) {
      return apiError('A project with this slug already exists.', 409, {
        slug: 'This slug is already in use. Choose another.',
      })
    }
    console.error('Failed to create project', error)
    return apiError('The project could not be created. Please try again.', 500)
  }
}
