import { adminGuard } from '@/lib/admin-route'
import { apiError, apiJson, parseId } from '@/lib/api'
import { setProjectStatus } from '@/lib/projects'

export const dynamic = 'force-dynamic'
type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: Request, context: RouteContext) {
  const guard = await adminGuard(request)
  if (!guard.ok) return guard.response
  const id = parseId((await context.params).id)
  if (!id) return apiError('Invalid project ID.', 400)

  const project = setProjectStatus(id, 'published')
  if (!project) return apiError('Project not found.', 404)
  return apiJson({ project })
}
