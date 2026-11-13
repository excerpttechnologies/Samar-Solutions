export type ProjectStatus = 'draft' | 'published' | 'archived'

export type LifecycleStatus = 'Planned' | 'In Progress' | 'Completed' | 'On Hold'

export const PROJECT_STATUSES: ProjectStatus[] = ['draft', 'published', 'archived']

export const LIFECYCLE_STATUSES: LifecycleStatus[] = [
  'Planned',
  'In Progress',
  'Completed',
  'On Hold',
]

export type Category = {
  id: number
  name: string
  slug: string
  description: string | null
  sortOrder: number
  projectCount: number
  createdAt: string
  updatedAt: string
}

export type MediaAsset = {
  id: number
  url: string
  filename: string
  originalName: string | null
  mimeType: string
  sizeBytes: number
  width: number | null
  height: number | null
  kind: 'image' | 'document' | 'video'
  createdAt: string
}

export type ProjectMedia = {
  id?: number
  kind: 'gallery' | 'document'
  url: string
  filename: string | null
  altText: string | null
  caption: string | null
  mimeType: string | null
  sizeBytes: number | null
  sortOrder: number
}

export type ProjectSummary = {
  id: number
  title: string
  slug: string
  shortDescription: string
  categoryId: number | null
  categoryName: string | null
  categorySlug: string | null
  projectLocation: string | null
  completionDate: string | null
  projectStatus: string
  displayImage: string | null
  coverImageAlt: string | null
  tags: string[]
  status: ProjectStatus
  featured: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type Project = ProjectSummary & {
  detailedDescription: string | null
  clientName: string | null
  startDate: string | null
  technologies: string[]
  features: string[]
  highlights: string[]
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  coverImage: string | null
  videoUrl: string | null
  gallery: ProjectMedia[]
  documents: ProjectMedia[]
}

export type AdminUser = {
  id: number
  email: string
  name: string
  createdAt: string
}

export type SiteSettings = {
  partnership: string | null
  phone: string | null
  email: string | null
  address: string | null
  hours: string | null
}

export type ProjectInput = {
  title: string
  slug: string
  shortDescription: string
  detailedDescription: string | null
  categoryId: number | null
  clientName: string | null
  projectLocation: string | null
  startDate: string | null
  completionDate: string | null
  projectStatus: LifecycleStatus
  technologies: string[]
  features: string[]
  highlights: string[]
  tags: string[]
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  coverImage: string | null
  coverImageAlt: string | null
  videoUrl: string | null
  status: ProjectStatus
  featured: boolean
  gallery: ProjectMedia[]
  documents: ProjectMedia[]
}

export type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type DashboardData = {
  counts: { total: number; published: number; draft: number; archived: number }
  categories: number
  media: number
  recentAdded: ProjectSummary[]
  recentUpdated: ProjectSummary[]
}
