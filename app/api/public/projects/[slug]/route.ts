import { apiError, apiJson } from '@/lib/api'
import { getPublishedProjectBySlug } from '@/lib/projects'

export const dynamic = 'force-dynamic'
type RouteContext = { params: Promise<{ slug: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params
  const project = getPublishedProjectBySlug(slug)
  if (!project) return apiError('Project not found.', 404)
  return apiJson({ project })
}
