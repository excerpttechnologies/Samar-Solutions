import type {
  LifecycleStatus,
  ProjectInput,
  ProjectMedia,
  ProjectStatus,
  SiteSettings,
} from './types'
import { LIFECYCLE_STATUSES, PROJECT_STATUSES } from './types'
import { slugify } from './utils'

export type FieldErrors = Record<string, string>

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: FieldErrors }

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function optionalString(
  value: unknown,
  max: number,
  field: string,
  errors: FieldErrors,
): string | null {
  if (value === null || value === undefined) return null
  if (typeof value !== 'string') {
    errors[field] = 'Must be text.'
    return null
  }
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.length > max) {
    errors[field] = `Must be ${max} characters or fewer.`
    return null
  }
  return trimmed
}

function stringArray(
  value: unknown,
  field: string,
  errors: FieldErrors,
  maxItems = 40,
  maxLength = 300,
): string[] {
  if (value === null || value === undefined) return []
  if (!Array.isArray(value)) {
    errors[field] = 'Must be a list.'
    return []
  }
  if (value.length > maxItems) {
    errors[field] = `Add no more than ${maxItems} items.`
    return []
  }
  const items: string[] = []
  for (const item of value) {
    if (typeof item !== 'string') {
      errors[field] = 'Each item must be text.'
      return []
    }
    const trimmed = item.trim()
    if (!trimmed) continue
    if (trimmed.length > maxLength) {
      errors[field] = `Each item must be ${maxLength} characters or fewer.`
      return []
    }
    items.push(trimmed)
  }
  return items
}

function isSafeMediaUrl(value: string, allowExternal: boolean): boolean {
  if (value.startsWith('/uploads/')) {
    return !value.includes('..') && !value.includes('\\')
  }
  if (!allowExternal) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function mediaArray(
  value: unknown,
  kind: 'gallery' | 'document',
  field: string,
  errors: FieldErrors,
): ProjectMedia[] {
  if (value === null || value === undefined) return []
  if (!Array.isArray(value)) {
    errors[field] = 'Must be a list of media items.'
    return []
  }
  if (value.length > 60) {
    errors[field] = 'Add no more than 60 media items.'
    return []
  }

  const items: ProjectMedia[] = []
  for (const [index, raw] of value.entries()) {
    if (!isObject(raw)) {
      errors[field] = `Item ${index + 1} is invalid.`
      return []
    }
    const url = stringValue(raw.url)
    if (!url || !isSafeMediaUrl(url, kind === 'document')) {
      errors[field] = `Item ${index + 1} has an invalid file URL.`
      return []
    }
    const filename = optionalString(
      raw.filename,
      300,
      field,
      errors,
    )
    const altText = optionalString(raw.altText, 300, field, errors)
    const caption = optionalString(raw.caption, 500, field, errors)
    const mimeType = optionalString(raw.mimeType, 150, field, errors)
    const rawSize = raw.sizeBytes
    const sizeBytes =
      typeof rawSize === 'number' && Number.isFinite(rawSize) && rawSize >= 0
        ? Math.floor(rawSize)
        : null

    items.push({
      kind,
      url,
      filename,
      altText,
      caption,
      mimeType,
      sizeBytes,
      sortOrder: index,
    })
  }
  return items
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function parseProjectPayload(payload: unknown): ValidationResult<ProjectInput> {
  const errors: FieldErrors = {}
  if (!isObject(payload)) {
    return { ok: false, errors: { form: 'Invalid request body.' } }
  }

  const title = stringValue(payload.title)
  if (!title) errors.title = 'Project title is required.'
  else if (title.length < 2) errors.title = 'Project title is too short.'
  else if (title.length > 200) errors.title = 'Project title must be 200 characters or fewer.'

  const slugInput = stringValue(payload.slug)
  const slug = slugify(slugInput || title)
  if (!slug) errors.slug = 'Project slug is required.'
  else if (slug.length > 180) errors.slug = 'Slug must be 180 characters or fewer.'

  const shortDescription = stringValue(payload.shortDescription)
  if (!shortDescription) errors.shortDescription = 'Short description is required.'
  else if (shortDescription.length > 600) {
    errors.shortDescription = 'Short description must be 600 characters or fewer.'
  }

  const detailedDescription = optionalString(
    payload.detailedDescription,
    30000,
    'detailedDescription',
    errors,
  )
  const seoTitle = optionalString(payload.seoTitle, 200, 'seoTitle', errors)
  const seoDescription = optionalString(
    payload.seoDescription,
    500,
    'seoDescription',
    errors,
  )
  const seoKeywords = optionalString(payload.seoKeywords, 500, 'seoKeywords', errors)
  const clientName = optionalString(payload.clientName, 200, 'clientName', errors)
  const projectLocation = optionalString(
    payload.projectLocation,
    200,
    'projectLocation',
    errors,
  )
  const coverImageAlt = optionalString(
    payload.coverImageAlt,
    300,
    'coverImageAlt',
    errors,
  )

  const coverImageRaw = optionalString(payload.coverImage, 1000, 'coverImage', errors)
  if (coverImageRaw && !isSafeMediaUrl(coverImageRaw, false)) {
    errors.coverImage = 'Cover image must be an uploaded file.'
  }

  const videoUrlRaw = optionalString(payload.videoUrl, 1000, 'videoUrl', errors)
  if (videoUrlRaw && !isSafeMediaUrl(videoUrlRaw, true)) {
    errors.videoUrl = 'Enter a valid video URL or upload a video file.'
  }

  let categoryId: number | null = null
  if (payload.categoryId !== null && payload.categoryId !== undefined && payload.categoryId !== '') {
    const parsed = Number(payload.categoryId)
    if (!Number.isInteger(parsed) || parsed <= 0) {
      errors.categoryId = 'Choose a valid category.'
    } else {
      categoryId = parsed
    }
  }

  let startDate: string | null = null
  if (payload.startDate !== null && payload.startDate !== undefined && payload.startDate !== '') {
    const value = stringValue(payload.startDate)
    if (!isValidDate(value)) errors.startDate = 'Enter a valid date.'
    else startDate = value
  }

  let completionDate: string | null = null
  if (
    payload.completionDate !== null &&
    payload.completionDate !== undefined &&
    payload.completionDate !== ''
  ) {
    const value = stringValue(payload.completionDate)
    if (!isValidDate(value)) errors.completionDate = 'Enter a valid date.'
    else completionDate = value
  }

  if (startDate && completionDate && startDate > completionDate) {
    errors.completionDate = 'Completion date cannot be before the start date.'
  }

  const rawStatus = stringValue(payload.status) || 'draft'
  if (!PROJECT_STATUSES.includes(rawStatus as ProjectStatus)) {
    errors.status = 'Choose a valid publication status.'
  }
  const status = (PROJECT_STATUSES.includes(rawStatus as ProjectStatus)
    ? rawStatus
    : 'draft') as ProjectStatus

  const rawLifecycle = stringValue(payload.projectStatus) || 'Completed'
  if (!LIFECYCLE_STATUSES.includes(rawLifecycle as LifecycleStatus)) {
    errors.projectStatus = 'Choose a valid project status.'
  }
  const projectStatus = (LIFECYCLE_STATUSES.includes(rawLifecycle as LifecycleStatus)
    ? rawLifecycle
    : 'Completed') as LifecycleStatus

  const result: ProjectInput = {
    title,
    slug,
    shortDescription,
    detailedDescription,
    categoryId,
    clientName,
    projectLocation,
    startDate,
    completionDate,
    projectStatus,
    technologies: stringArray(payload.technologies, 'technologies', errors),
    features: stringArray(payload.features, 'features', errors, 40, 600),
    highlights: stringArray(payload.highlights, 'highlights', errors, 40, 600),
    tags: stringArray(payload.tags, 'tags', errors, 30, 80),
    seoTitle,
    seoDescription,
    seoKeywords,
    coverImage: coverImageRaw,
    coverImageAlt,
    videoUrl: videoUrlRaw,
    status,
    featured: payload.featured === true,
    gallery: mediaArray(payload.gallery, 'gallery', 'gallery', errors),
    documents: mediaArray(payload.documents, 'document', 'documents', errors),
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, value: result }
}

export type CategoryPayload = {
  name: string
  slug: string
  description: string | null
  sortOrder: number
}

export function parseCategoryPayload(payload: unknown): ValidationResult<CategoryPayload> {
  const errors: FieldErrors = {}
  if (!isObject(payload)) return { ok: false, errors: { form: 'Invalid request body.' } }

  const name = stringValue(payload.name)
  if (!name) errors.name = 'Category name is required.'
  else if (name.length < 2) errors.name = 'Category name is too short.'
  else if (name.length > 100) errors.name = 'Category name must be 100 characters or fewer.'

  const slug = slugify(stringValue(payload.slug) || name)
  if (!slug) errors.slug = 'Category slug is required.'
  else if (slug.length > 120) errors.slug = 'Slug must be 120 characters or fewer.'

  const description = optionalString(payload.description, 1000, 'description', errors)

  let sortOrder = 0
  if (payload.sortOrder !== undefined && payload.sortOrder !== null && payload.sortOrder !== '') {
    const parsed = Number(payload.sortOrder)
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 10000) {
      errors.sortOrder = 'Sort order must be a whole number between 0 and 10000.'
    } else {
      sortOrder = parsed
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, value: { name, slug, description, sortOrder } }
}

export function parseSettingsPayload(payload: unknown): ValidationResult<SiteSettings> {
  const errors: FieldErrors = {}
  if (!isObject(payload)) return { ok: false, errors: { form: 'Invalid request body.' } }

  const partnership = optionalString(payload.partnership, 300, 'partnership', errors)
  const phone = optionalString(payload.phone, 50, 'phone', errors)
  const email = optionalString(payload.email, 200, 'email', errors)
  const address = optionalString(payload.address, 500, 'address', errors)
  const hours = optionalString(payload.hours, 200, 'hours', errors)

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return {
    ok: true,
    value: { partnership, phone, email, address, hours },
  }
}

export function parseLoginPayload(payload: unknown): ValidationResult<{
  email: string
  password: string
}> {
  const errors: FieldErrors = {}
  if (!isObject(payload)) return { ok: false, errors: { form: 'Invalid request body.' } }

  const email = stringValue(payload.email)
  const password = typeof payload.password === 'string' ? payload.password : ''

  if (!email) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!password) errors.password = 'Password is required.'
  else if (password.length > 200) errors.password = 'Password is too long.'

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, value: { email, password } }
}

export function parsePasswordChangePayload(payload: unknown): ValidationResult<{
  currentPassword: string
  newPassword: string
}> {
  const errors: FieldErrors = {}
  if (!isObject(payload)) return { ok: false, errors: { form: 'Invalid request body.' } }

  const currentPassword =
    typeof payload.currentPassword === 'string' ? payload.currentPassword : ''
  const newPassword = typeof payload.newPassword === 'string' ? payload.newPassword : ''

  if (!currentPassword) errors.currentPassword = 'Current password is required.'
  if (!newPassword) errors.newPassword = 'New password is required.'
  else if (newPassword.length < 10) {
    errors.newPassword = 'Use at least 10 characters.'
  } else if (newPassword.length > 128) {
    errors.newPassword = 'Use 128 characters or fewer.'
  } else if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
    errors.newPassword = 'Include at least one letter and one number.'
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, value: { currentPassword, newPassword } }
}
