import {
  asNumber,
  db,
  nowIso,
  parseStringArray,
  transaction,
} from './db'
import type {
  DashboardData,
  Paginated,
  Project,
  ProjectInput,
  ProjectMedia,
  ProjectStatus,
  ProjectSummary,
} from './types'
import { slugify } from './utils'

type Row = Record<string, unknown>

const PROJECT_SELECT = `
  SELECT
    p.id, p.title, p.slug, p.short_description, p.detailed_description,
    p.category_id, p.client_name, p.project_location, p.start_date, p.completion_date,
    p.project_status, p.technologies, p.features, p.highlights, p.tags,
    p.seo_title, p.seo_description, p.seo_keywords,
    p.cover_image, p.cover_image_alt, p.video_url, p.status, p.featured,
    p.published_at, p.created_at, p.updated_at,
    c.name AS category_name, c.slug AS category_slug,
    COALESCE(p.cover_image, (
      SELECT pm.url FROM project_media pm
      WHERE pm.project_id = p.id AND pm.kind = 'gallery'
      ORDER BY pm.sort_order ASC, pm.id ASC LIMIT 1
    )) AS display_image
  FROM projects p
  LEFT JOIN categories c ON c.id = p.category_id
`

function text(value: unknown): string | null {
  if (value === null || value === undefined) return null
  const result = String(value)
  return result.length > 0 ? result : null
}

function mapSummary(row: Row): ProjectSummary {
  return {
    id: asNumber(row.id),
    title: String(row.title),
    slug: String(row.slug),
    shortDescription: String(row.short_description),
    categoryId: row.category_id === null ? null : asNumber(row.category_id),
    categoryName: text(row.category_name),
    categorySlug: text(row.category_slug),
    projectLocation: text(row.project_location),
    completionDate: text(row.completion_date),
    projectStatus: String(row.project_status),
    displayImage: text(row.display_image),
    coverImageAlt: text(row.cover_image_alt),
    tags: parseStringArray(row.tags),
    status: String(row.status) as ProjectStatus,
    featured: Boolean(asNumber(row.featured)),
    publishedAt: text(row.published_at),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

function mapProject(row: Row, media: Row[]): Project {
  return {
    ...mapSummary(row),
    detailedDescription: text(row.detailed_description),
    clientName: text(row.client_name),
    startDate: text(row.start_date),
    technologies: parseStringArray(row.technologies),
    features: parseStringArray(row.features),
    highlights: parseStringArray(row.highlights),
    seoTitle: text(row.seo_title),
    seoDescription: text(row.seo_description),
    seoKeywords: text(row.seo_keywords),
    coverImage: text(row.cover_image),
    videoUrl: text(row.video_url),
    gallery: media
      .filter((item) => item.kind === 'gallery')
      .map(mapProjectMedia),
    documents: media
      .filter((item) => item.kind === 'document')
      .map(mapProjectMedia),
  }
}

function mapProjectMedia(row: Row): ProjectMedia {
  return {
    id: asNumber(row.id),
    kind: String(row.kind) as 'gallery' | 'document',
    url: String(row.url),
    filename: text(row.filename),
    altText: text(row.alt_text),
    caption: text(row.caption),
    mimeType: text(row.mime_type),
    sizeBytes: row.size_bytes === null ? null : asNumber(row.size_bytes),
    sortOrder: asNumber(row.sort_order),
  }
}

function mediaForProject(projectId: number): Row[] {
  return db
    .prepare(
      `SELECT * FROM project_media
       WHERE project_id = ?
       ORDER BY kind ASC, sort_order ASC, id ASC`,
    )
    .all(projectId) as Row[]
}

function pageMeta(total: number, page: number, pageSize: number) {
  return {
    total,
    page,
    pageSize,
    totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
  }
}

/* ------------------------------------------------------------------ */
/* Public project queries                                              */
/* ------------------------------------------------------------------ */

export function getPublishedProjects({
  categorySlug,
  page = 1,
  pageSize = 9,
}: {
  categorySlug?: string
  page?: number
  pageSize?: number
} = {}): Paginated<ProjectSummary> {
  const safePage = Math.max(1, Math.floor(page))
  const safeSize = Math.min(48, Math.max(1, Math.floor(pageSize)))
  const where = [`p.status = 'published'`]
  const params: (string | number)[] = []

  if (categorySlug) {
    where.push('c.slug = ?')
    params.push(categorySlug)
  }

  const whereSql = `WHERE ${where.join(' AND ')}`
  const count = db
    .prepare(
      `SELECT COUNT(*) AS count FROM projects p
       LEFT JOIN categories c ON c.id = p.category_id
       ${whereSql}`,
    )
    .get(...params) as Row

  const rows = db
    .prepare(
      `${PROJECT_SELECT}
       ${whereSql}
       ORDER BY p.featured DESC, COALESCE(p.published_at, p.created_at) DESC, p.id DESC
       LIMIT ? OFFSET ?`,
    )
    .all(...params, safeSize, (safePage - 1) * safeSize) as Row[]

  return {
    items: rows.map(mapSummary),
    ...pageMeta(asNumber(count.count), safePage, safeSize),
  }
}

export function getPublishedProjectBySlug(slug: string): Project | null {
  const row = db
    .prepare(`${PROJECT_SELECT} WHERE p.slug = ? AND p.status = 'published' LIMIT 1`)
    .get(slug) as Row | undefined
  if (!row) return null
  return mapProject(row, mediaForProject(asNumber(row.id)))
}

export function getPublishedGalleryImages(limit = 60) {
  return db
    .prepare(
      `SELECT pm.*, p.title AS project_title, p.slug AS project_slug
       FROM project_media pm
       JOIN projects p ON p.id = pm.project_id
       WHERE p.status = 'published' AND pm.kind = 'gallery'
       ORDER BY COALESCE(p.published_at, p.created_at) DESC, pm.sort_order ASC, pm.id ASC
       LIMIT ?`,
    )
    .all(Math.min(120, Math.max(1, limit)))
    .map((raw) => {
      const row = raw as Row
      return {
        ...mapProjectMedia(row),
        projectTitle: String(row.project_title),
        projectSlug: String(row.project_slug),
      }
    })
}

/* ------------------------------------------------------------------ */
/* Admin project queries                                               */
/* ------------------------------------------------------------------ */

export type AdminProjectFilters = {
  search?: string
  status?: ProjectStatus | 'all'
  categoryId?: number | null
  page?: number
  pageSize?: number
}

export function getAdminProjects({
  search,
  status,
  categoryId,
  page = 1,
  pageSize = 12,
}: AdminProjectFilters = {}): Paginated<ProjectSummary> {
  const safePage = Math.max(1, Math.floor(page))
  const safeSize = Math.min(100, Math.max(1, Math.floor(pageSize)))
  const where: string[] = []
  const params: (string | number)[] = []

  if (status && status !== 'all') {
    where.push('p.status = ?')
    params.push(status)
  }

  if (categoryId) {
    where.push('p.category_id = ?')
    params.push(categoryId)
  }

  if (search?.trim()) {
    const term = `%${search.trim()}%`
    where.push(
      '(p.title LIKE ? OR p.slug LIKE ? OR p.client_name LIKE ? OR p.project_location LIKE ?)',
    )
    params.push(term, term, term, term)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const count = db
    .prepare(`SELECT COUNT(*) AS count FROM projects p ${whereSql}`)
    .get(...params) as Row

  const rows = db
    .prepare(
      `${PROJECT_SELECT}
       ${whereSql}
       ORDER BY p.updated_at DESC, p.id DESC
       LIMIT ? OFFSET ?`,
    )
    .all(...params, safeSize, (safePage - 1) * safeSize) as Row[]

  return {
    items: rows.map(mapSummary),
    ...pageMeta(asNumber(count.count), safePage, safeSize),
  }
}

export function getAdminProject(id: number): Project | null {
  const row = db.prepare(`${PROJECT_SELECT} WHERE p.id = ? LIMIT 1`).get(id) as
    | Row
    | undefined
  if (!row) return null
  return mapProject(row, mediaForProject(id))
}

export function getProjectStatusCounts(): {
  all: number
  draft: number
  published: number
  archived: number
} {
  const counts = { all: 0, draft: 0, published: 0, archived: 0 }
  const rows = db
    .prepare('SELECT status, COUNT(*) AS count FROM projects GROUP BY status')
    .all() as Row[]
  for (const row of rows) {
    const value = asNumber(row.count)
    counts.all += value
    const status = String(row.status) as ProjectStatus
    if (status in counts) counts[status] += value
  }
  return counts
}

export function getDashboardData(): DashboardData {
  const counts = getProjectStatusCounts()
  const categoryCount = db
    .prepare('SELECT COUNT(*) AS count FROM categories')
    .get() as Row
  const mediaCount = db.prepare('SELECT COUNT(*) AS count FROM media').get() as Row

  const recentAdded = db
    .prepare(
      `${PROJECT_SELECT} ORDER BY p.created_at DESC, p.id DESC LIMIT 5`,
    )
    .all() as Row[]
  const recentUpdated = db
    .prepare(
      `${PROJECT_SELECT} ORDER BY p.updated_at DESC, p.id DESC LIMIT 5`,
    )
    .all() as Row[]

  return {
    counts: {
      total: counts.all,
      published: counts.published,
      draft: counts.draft,
      archived: counts.archived,
    },
    categories: asNumber(categoryCount.count),
    media: asNumber(mediaCount.count),
    recentAdded: recentAdded.map(mapSummary),
    recentUpdated: recentUpdated.map(mapSummary),
  }
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

function insertProjectRecord(input: ProjectInput, slug: string): number {
  const timestamp = nowIso()
  const result = db
    .prepare(
      `INSERT INTO projects (
        title, slug, short_description, detailed_description, category_id,
        client_name, project_location, start_date, completion_date, project_status,
        technologies, features, highlights, tags,
        seo_title, seo_description, seo_keywords,
        cover_image, cover_image_alt, video_url,
        status, featured, published_at, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?
      )`,
    )
    .run(
      input.title,
      slug,
      input.shortDescription,
      input.detailedDescription,
      input.categoryId,
      input.clientName,
      input.projectLocation,
      input.startDate,
      input.completionDate,
      input.projectStatus,
      JSON.stringify(input.technologies),
      JSON.stringify(input.features),
      JSON.stringify(input.highlights),
      JSON.stringify(input.tags),
      input.seoTitle,
      input.seoDescription,
      input.seoKeywords,
      input.coverImage,
      input.coverImageAlt,
      input.videoUrl,
      input.status,
      input.featured ? 1 : 0,
      input.status === 'published' ? timestamp : null,
      timestamp,
      timestamp,
    )

  const projectId = asNumber(result.lastInsertRowid)
  replaceProjectMedia(projectId, input.gallery, input.documents)
  return projectId
}

function replaceProjectMedia(
  projectId: number,
  gallery: ProjectMedia[],
  documents: ProjectMedia[],
) {
  db.prepare('DELETE FROM project_media WHERE project_id = ?').run(projectId)
  const insert = db.prepare(
    `INSERT INTO project_media
      (project_id, kind, url, filename, alt_text, caption, mime_type, size_bytes, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
  const timestamp = nowIso()

  gallery.forEach((item, index) => {
    insert.run(
      projectId,
      'gallery',
      item.url,
      item.filename,
      item.altText,
      item.caption,
      item.mimeType,
      item.sizeBytes,
      index,
      timestamp,
    )
  })

  documents.forEach((item, index) => {
    insert.run(
      projectId,
      'document',
      item.url,
      item.filename,
      item.altText,
      item.caption,
      item.mimeType,
      item.sizeBytes,
      index,
      timestamp,
    )
  })
}

export function createProject(input: ProjectInput): Project {
  const id = transaction(() => insertProjectRecord(input, input.slug))
  return getAdminProject(id)!
}

export function updateProject(id: number, input: ProjectInput): Project | null {
  const existing = db
    .prepare('SELECT status, published_at FROM projects WHERE id = ?')
    .get(id) as Row | undefined
  if (!existing) return null

  transaction(() => {
    const timestamp = nowIso()
    const publishedAt =
      input.status === 'published'
        ? (existing.published_at as string | null) ?? timestamp
        : null

    db.prepare(
      `UPDATE projects SET
        title = ?, slug = ?, short_description = ?, detailed_description = ?,
        category_id = ?, client_name = ?, project_location = ?,
        start_date = ?, completion_date = ?, project_status = ?,
        technologies = ?, features = ?, highlights = ?, tags = ?,
        seo_title = ?, seo_description = ?, seo_keywords = ?,
        cover_image = ?, cover_image_alt = ?, video_url = ?,
        status = ?, featured = ?, published_at = ?, updated_at = ?
       WHERE id = ?`,
    ).run(
      input.title,
      input.slug,
      input.shortDescription,
      input.detailedDescription,
      input.categoryId,
      input.clientName,
      input.projectLocation,
      input.startDate,
      input.completionDate,
      input.projectStatus,
      JSON.stringify(input.technologies),
      JSON.stringify(input.features),
      JSON.stringify(input.highlights),
      JSON.stringify(input.tags),
      input.seoTitle,
      input.seoDescription,
      input.seoKeywords,
      input.coverImage,
      input.coverImageAlt,
      input.videoUrl,
      input.status,
      input.featured ? 1 : 0,
      publishedAt,
      timestamp,
      id,
    )
    replaceProjectMedia(id, input.gallery, input.documents)
  })

  return getAdminProject(id)
}

export function deleteProject(id: number): boolean {
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id)
  return Number(result.changes) > 0
}

export function setProjectStatus(id: number, status: ProjectStatus): Project | null {
  const existing = db
    .prepare('SELECT published_at FROM projects WHERE id = ?')
    .get(id) as Row | undefined
  if (!existing) return null

  const timestamp = nowIso()
  const publishedAt =
    status === 'published'
      ? (existing.published_at as string | null) ?? timestamp
      : null

  db.prepare(
    'UPDATE projects SET status = ?, published_at = ?, updated_at = ? WHERE id = ?',
  ).run(status, publishedAt, timestamp, id)

  return getAdminProject(id)
}

export function duplicateProject(id: number): Project | null {
  const source = getAdminProject(id)
  if (!source) return null

  const copySlug = makeUniqueSlug(source.slug)
  const input: ProjectInput = {
    title: `${source.title} (Copy)`,
    slug: copySlug,
    shortDescription: source.shortDescription,
    detailedDescription: source.detailedDescription,
    categoryId: source.categoryId,
    clientName: source.clientName,
    projectLocation: source.projectLocation,
    startDate: source.startDate,
    completionDate: source.completionDate,
    projectStatus: source.projectStatus as ProjectInput['projectStatus'],
    technologies: source.technologies,
    features: source.features,
    highlights: source.highlights,
    tags: source.tags,
    seoTitle: source.seoTitle,
    seoDescription: source.seoDescription,
    seoKeywords: source.seoKeywords,
    coverImage: source.coverImage,
    coverImageAlt: source.coverImageAlt,
    videoUrl: source.videoUrl,
    status: 'draft',
    featured: false,
    gallery: source.gallery,
    documents: source.documents,
  }

  const newId = transaction(() => insertProjectRecord(input, copySlug))
  return getAdminProject(newId)
}

export function makeUniqueSlug(base: string): string {
  const cleaned = slugify(base) || 'project'
  const exists = (candidate: string) =>
    Boolean(
      db.prepare('SELECT 1 AS found FROM projects WHERE slug = ? LIMIT 1').get(candidate),
    )

  if (!exists(cleaned)) return cleaned
  let index = 1
  while (exists(`${cleaned}-${index}`)) index += 1
  return `${cleaned}-${index}`
}

export function projectSlugExists(slug: string, exceptId?: number): boolean {
  const row = exceptId
    ? db
        .prepare('SELECT 1 AS found FROM projects WHERE slug = ? AND id <> ? LIMIT 1')
        .get(slug, exceptId)
    : db.prepare('SELECT 1 AS found FROM projects WHERE slug = ? LIMIT 1').get(slug)
  return Boolean(row)
}

export function categoryExists(id: number): boolean {
  return Boolean(db.prepare('SELECT 1 AS found FROM categories WHERE id = ?').get(id))
}
