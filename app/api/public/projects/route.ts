import { apiJson, apiError } from '@/lib/api'
import { getPublishedProjects } from '@/lib/projects'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? 1)
  const pageSize = Number(url.searchParams.get('pageSize') ?? 12)
  const category = url.searchParams.get('category') ?? undefined

  if (!Number.isFinite(page) || page < 1) return apiError('Invalid page.', 400)
  if (!Number.isFinite(pageSize) || pageSize < 1) {
    return apiError('Invalid page size.', 400)
  }

  const result = getPublishedProjects({
    categorySlug: category,
    page,
    pageSize,
  })

  return apiJson(result)
}
