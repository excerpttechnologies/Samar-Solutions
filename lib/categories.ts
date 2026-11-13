import { asNumber, db, nowIso } from './db'
import type { Category } from './types'
import { slugify } from './utils'

type Row = Record<string, unknown>

export type CategoryInput = {
  name: string
  slug: string
  description: string | null
  sortOrder: number
}

function mapCategory(row: Row): Category {
  return {
    id: asNumber(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: row.description ? String(row.description) : null,
    sortOrder: asNumber(row.sort_order),
    projectCount: asNumber(row.project_count),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

const CATEGORY_SELECT = `
  SELECT c.*, COUNT(p.id) AS project_count
  FROM categories c
  LEFT JOIN projects p ON p.category_id = c.id
`

export function getCategories(): Category[] {
  const rows = db
    .prepare(
      `${CATEGORY_SELECT}
       GROUP BY c.id
       ORDER BY c.sort_order ASC, c.name COLLATE NOCASE ASC`,
    )
    .all() as Row[]
  return rows.map(mapCategory)
}

export function getCategoryById(id: number): Category | null {
  const row = db
    .prepare(
      `${CATEGORY_SELECT}
       WHERE c.id = ?
       GROUP BY c.id`,
    )
    .get(id) as Row | undefined
  return row ? mapCategory(row) : null
}

export function getCategoryBySlug(slug: string): Category | null {
  const row = db
    .prepare(
      `${CATEGORY_SELECT}
       WHERE c.slug = ?
       GROUP BY c.id`,
    )
    .get(slug) as Row | undefined
  return row ? mapCategory(row) : null
}

export function createCategory(input: CategoryInput): Category {
  const timestamp = nowIso()
  const result = db
    .prepare(
      `INSERT INTO categories (name, slug, description, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.name,
      input.slug,
      input.description,
      input.sortOrder,
      timestamp,
      timestamp,
    )
  return getCategoryById(asNumber(result.lastInsertRowid))!
}

export function updateCategory(id: number, input: CategoryInput): Category | null {
  const result = db
    .prepare(
      `UPDATE categories
       SET name = ?, slug = ?, description = ?, sort_order = ?, updated_at = ?
       WHERE id = ?`,
    )
    .run(input.name, input.slug, input.description, input.sortOrder, nowIso(), id)
  if (Number(result.changes) === 0) return null
  return getCategoryById(id)
}

export function deleteCategory(id: number): boolean {
  // Referenced projects keep their data; category_id becomes NULL via ON DELETE SET NULL.
  const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id)
  return Number(result.changes) > 0
}

export function makeUniqueCategorySlug(base: string, exceptId?: number): string {
  const cleaned = slugify(base) || 'category'
  const exists = (candidate: string) =>
    Boolean(
      db
        .prepare(
          exceptId
            ? 'SELECT 1 AS found FROM categories WHERE slug = ? AND id <> ? LIMIT 1'
            : 'SELECT 1 AS found FROM categories WHERE slug = ? LIMIT 1',
        )
        .get(...(exceptId ? [candidate, exceptId] : [candidate])),
    )

  if (!exists(cleaned)) return cleaned
  let index = 1
  while (exists(`${cleaned}-${index}`)) index += 1
  return `${cleaned}-${index}`
}
