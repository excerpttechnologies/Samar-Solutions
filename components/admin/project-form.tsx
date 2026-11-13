'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ExternalLink,
  FileText,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react'
import type {
  Category,
  LifecycleStatus,
  Project,
  ProjectStatus,
} from '@/lib/types'
import { LIFECYCLE_STATUSES } from '@/lib/types'
import { ApiRequestError, apiFetch, uploadAsset } from '@/lib/api-client'
import { formatBytes, formatDateTime, slugify } from '@/lib/utils'
import {
  adminCardClass,
  adminDangerButtonClass,
  adminErrorClass,
  adminHintClass,
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from './form-styles'
import { StatusBadge } from './status-badge'
import { useToast } from './toast'

type MediaDraft = {
  url: string
  filename: string | null
  altText: string | null
  caption: string | null
  mimeType: string | null
  sizeBytes: number | null
}

type FormState = {
  title: string
  slug: string
  shortDescription: string
  detailedDescription: string
  categoryId: string
  clientName: string
  projectLocation: string
  startDate: string
  completionDate: string
  projectStatus: LifecycleStatus
  technologies: string[]
  features: string[]
  highlights: string[]
  tags: string[]
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  coverImage: string
  coverImageAlt: string
  videoUrl: string
  status: ProjectStatus
  featured: boolean
  gallery: MediaDraft[]
  documents: MediaDraft[]
}

const statusOptions: { value: ProjectStatus; label: string; hint: string }[] = [
  { value: 'draft', label: 'Draft', hint: 'Visible only in the admin panel.' },
  {
    value: 'published',
    label: 'Published',
    hint: 'Visible on the public website and project pages.',
  },
  { value: 'archived', label: 'Archived', hint: 'Hidden from the public website.' },
]

const lifecycleLabels: Record<LifecycleStatus, string> = {
  Planned: 'Planned',
  'In Progress': 'In progress',
  Completed: 'Completed',
  'On Hold': 'On hold',
}

function toMediaDraft(media: {
  url: string
  filename?: string | null
  altText?: string | null
  caption?: string | null
  mimeType?: string | null
  sizeBytes?: number | null
}): MediaDraft {
  return {
    url: media.url,
    filename: media.filename ?? null,
    altText: media.altText ?? null,
    caption: media.caption ?? null,
    mimeType: media.mimeType ?? null,
    sizeBytes: media.sizeBytes ?? null,
  }
}

function initialForm(project?: Project): FormState {
  return {
    title: project?.title ?? '',
    slug: project?.slug ?? '',
    shortDescription: project?.shortDescription ?? '',
    detailedDescription: project?.detailedDescription ?? '',
    categoryId: project?.categoryId ? String(project.categoryId) : '',
    clientName: project?.clientName ?? '',
    projectLocation: project?.projectLocation ?? '',
    startDate: project?.startDate ?? '',
    completionDate: project?.completionDate ?? '',
    projectStatus: (LIFECYCLE_STATUSES as string[]).includes(project?.projectStatus ?? '')
      ? (project?.projectStatus as LifecycleStatus)
      : 'Completed',
    technologies: project?.technologies ?? [],
    features: project?.features ?? [],
    highlights: project?.highlights ?? [],
    tags: project?.tags ?? [],
    seoTitle: project?.seoTitle ?? '',
    seoDescription: project?.seoDescription ?? '',
    seoKeywords: project?.seoKeywords ?? '',
    coverImage: project?.coverImage ?? '',
    coverImageAlt: project?.coverImageAlt ?? '',
    videoUrl: project?.videoUrl ?? '',
    status: project?.status ?? 'draft',
    featured: project?.featured ?? false,
    gallery: project?.gallery.map(toMediaDraft) ?? [],
    documents: project?.documents.map(toMediaDraft) ?? [],
  }
}

function Card({
  title,
  description,
  children,
  actions,
}: {
  title: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <section className={`${adminCardClass} p-5 md:p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
        {actions}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className={adminErrorClass}>{message}</p>
}

function TagEditor({
  label,
  hint,
  placeholder,
  items,
  onChange,
  error,
}: {
  label: string
  hint: string
  placeholder: string
  items: string[]
  onChange: (items: string[]) => void
  error?: string
}) {
  const [value, setValue] = useState('')

  function add() {
    const trimmed = value.trim()
    if (!trimmed) return
    if (!items.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...items, trimmed])
    }
    setValue('')
  }

  return (
    <div>
      <p className={adminLabelClass}>{label}</p>
      <p className={adminHintClass}>{hint}</p>
      {items.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1.5 text-xs font-semibold text-secondary-foreground"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                className="rounded-full p-0.5 hover:bg-secondary-foreground/10"
                aria-label={`Remove ${item}`}
              >
                <X aria-hidden="true" className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              add()
            }
          }}
          className={`${adminInputClass} mt-0`}
        />
        <button type="button" onClick={add} className={`${adminSecondaryButtonClass} shrink-0`}>
          <Plus aria-hidden="true" className="size-4" />
          Add
        </button>
      </div>
      <FieldError message={error} />
    </div>
  )
}

function TextListEditor({
  label,
  hint,
  placeholder,
  items,
  onChange,
  error,
  textarea = false,
}: {
  label: string
  hint: string
  placeholder: string
  items: string[]
  onChange: (items: string[]) => void
  error?: string
  textarea?: boolean
}) {
  function update(index: number, value: string) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)))
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div>
      <p className={adminLabelClass}>{label}</p>
      <p className={adminHintClass}>{hint}</p>
      {items.length === 0 ? (
        <p className="mt-3 rounded-md border border-dashed border-border px-3 py-3 text-xs text-muted-foreground">
          No items added yet.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              {textarea ? (
                <textarea
                  rows={2}
                  value={item}
                  placeholder={placeholder}
                  onChange={(event) => update(index, event.target.value)}
                  className={`${adminInputClass} mt-0 flex-1`}
                />
              ) : (
                <input
                  type="text"
                  value={item}
                  placeholder={placeholder}
                  onChange={(event) => update(index, event.target.value)}
                  className={`${adminInputClass} mt-0 flex-1`}
                />
              )}
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="rounded border border-border p-1 text-muted-foreground hover:bg-muted disabled:opacity-40"
                  aria-label={`Move ${label} item up`}
                >
                  <ArrowUp aria-hidden="true" className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  className="rounded border border-border p-1 text-muted-foreground hover:bg-muted disabled:opacity-40"
                  aria-label={`Move ${label} item down`}
                >
                  <ArrowDown aria-hidden="true" className="size-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                className="mt-1 rounded border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label={`Remove ${label} item`}
              >
                <X aria-hidden="true" className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className={`${adminSecondaryButtonClass} mt-3 h-8 px-3 text-xs`}
      >
        <Plus aria-hidden="true" className="size-3.5" />
        Add item
      </button>
      <FieldError message={error} />
    </div>
  )
}

export function ProjectForm({
  categories,
  project,
}: {
  categories: Category[]
  project?: Project
}) {
  const router = useRouter()
  const toast = useToast()
  const [form, setForm] = useState<FormState>(() => initialForm(project))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [slugTouched, setSlugTouched] = useState(Boolean(project))
  const [coverUploading, setCoverUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [documentsUploading, setDocumentsUploading] = useState(false)
  const [videoUploading, setVideoUploading] = useState(false)

  const coverInput = useRef<HTMLInputElement>(null)
  const galleryInput = useRef<HTMLInputElement>(null)
  const documentsInput = useRef<HTMLInputElement>(null)
  const videoInput = useRef<HTMLInputElement>(null)

  const mediaBusy =
    coverUploading || galleryUploading || documentsUploading || videoUploading

  function clearError(key: string) {
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    clearError(String(key))
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugify(value),
    }))
    clearError('title')
    clearError('slug')
  }

  async function handleCoverUpload(file: File | undefined) {
    if (!file) return
    setCoverUploading(true)
    clearError('coverImage')
    try {
      const media = await uploadAsset(file, 'image')
      setForm((current) => ({
        ...current,
        coverImage: media.url,
        coverImageAlt:
          current.coverImageAlt ||
          media.originalName ||
          `${current.title || 'Project'} photograph`,
      }))
      toast.success('Cover image uploaded.')
    } catch (caught) {
      toast.error(
        'Cover image upload failed',
        caught instanceof ApiRequestError ? caught.message : 'Please try again.',
      )
    } finally {
      setCoverUploading(false)
      if (coverInput.current) coverInput.current.value = ''
    }
  }

  async function handleGalleryUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setGalleryUploading(true)
    clearError('gallery')
    const added: MediaDraft[] = []
    let failures = 0

    for (const file of Array.from(files)) {
      try {
        const media = await uploadAsset(file, 'image')
        added.push(
          toMediaDraft({
            ...media,
            altText: media.originalName ?? `${form.title || 'Project'} photograph`,
          }),
        )
      } catch {
        failures += 1
      }
    }

    if (added.length > 0) {
      setForm((current) => ({ ...current, gallery: [...current.gallery, ...added] }))
      toast.success(
        `${added.length} gallery image${added.length === 1 ? '' : 's'} uploaded.`,
      )
    }
    if (failures > 0) {
      toast.error(
        'Some images were not uploaded',
        `${failures} file${failures === 1 ? '' : 's'} could not be processed.`,
      )
    }
    setGalleryUploading(false)
    if (galleryInput.current) galleryInput.current.value = ''
  }

  async function handleDocumentUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setDocumentsUploading(true)
    clearError('documents')
    const added: MediaDraft[] = []
    let failures = 0

    for (const file of Array.from(files)) {
      try {
        added.push(toMediaDraft(await uploadAsset(file, 'document')))
      } catch {
        failures += 1
      }
    }

    if (added.length > 0) {
      setForm((current) => ({
        ...current,
        documents: [...current.documents, ...added],
      }))
      toast.success(
        `${added.length} document${added.length === 1 ? '' : 's'} uploaded.`,
      )
    }
    if (failures > 0) {
      toast.error(
        'Some documents were not uploaded',
        `${failures} file${failures === 1 ? '' : 's'} could not be processed.`,
      )
    }
    setDocumentsUploading(false)
    if (documentsInput.current) documentsInput.current.value = ''
  }

  async function handleVideoUpload(file: File | undefined) {
    if (!file) return
    setVideoUploading(true)
    clearError('videoUrl')
    try {
      const media = await uploadAsset(file, 'video')
      setForm((current) => ({ ...current, videoUrl: media.url }))
      toast.success('Video uploaded.')
    } catch (caught) {
      toast.error(
        'Video upload failed',
        caught instanceof ApiRequestError ? caught.message : 'Please try again.',
      )
    } finally {
      setVideoUploading(false)
      if (videoInput.current) videoInput.current.value = ''
    }
  }

  function moveGallery(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= form.gallery.length) return
    const next = [...form.gallery]
    ;[next[index], next[target]] = [next[target], next[index]]
    updateField('gallery', next)
  }

  function updateGallery(index: number, key: 'altText' | 'caption', value: string) {
    updateField(
      'gallery',
      form.gallery.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    )
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {}
    if (!form.title.trim()) next.title = 'Project title is required.'
    if (!form.slug.trim()) next.slug = 'Project slug is required.'
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) {
      next.slug = 'Use lowercase letters, numbers, and hyphens only.'
    }
    if (!form.shortDescription.trim()) {
      next.shortDescription = 'Short description is required.'
    }
    if (form.startDate && form.completionDate && form.startDate > form.completionDate) {
      next.completionDate = 'Completion date cannot be before the start date.'
    }
    return next
  }

  async function saveProject() {
    if (saving || mediaBusy) return
    setFormError(null)
    const clientErrors = validate()
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) {
      setFormError('Please correct the highlighted fields.')
      return
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim(),
      shortDescription: form.shortDescription.trim(),
      detailedDescription: form.detailedDescription.trim() || null,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      clientName: form.clientName.trim() || null,
      projectLocation: form.projectLocation.trim() || null,
      startDate: form.startDate || null,
      completionDate: form.completionDate || null,
      technologies: form.technologies.map((item) => item.trim()).filter(Boolean),
      features: form.features.map((item) => item.trim()).filter(Boolean),
      highlights: form.highlights.map((item) => item.trim()).filter(Boolean),
      tags: form.tags.map((item) => item.trim()).filter(Boolean),
      seoTitle: form.seoTitle.trim() || null,
      seoDescription: form.seoDescription.trim() || null,
      seoKeywords: form.seoKeywords.trim() || null,
      coverImage: form.coverImage || null,
      coverImageAlt: form.coverImageAlt.trim() || null,
      videoUrl: form.videoUrl.trim() || null,
      gallery: form.gallery.map((item, index) => ({
        ...item,
        altText: item.altText?.trim() || null,
        caption: item.caption?.trim() || null,
        sortOrder: index,
      })),
      documents: form.documents.map((item, index) => ({
        ...item,
        altText: item.altText?.trim() || null,
        caption: item.caption?.trim() || null,
        sortOrder: index,
      })),
    }

    setSaving(true)
    try {
      const endpoint = project
        ? `/api/admin/projects/${project.id}`
        : '/api/admin/projects'
      const result = await apiFetch<{ project: Project }>(endpoint, {
        method: project ? 'PUT' : 'POST',
        body: payload,
      })
      toast.success(project ? 'Project updated.' : 'Project created.')
      if (!project) {
        router.replace(`/admin/projects/${result.project.id}/edit`)
      }
      router.refresh()
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setFormError(caught.message)
        setErrors(caught.fields)
      } else {
        setFormError('The project could not be saved. Please try again.')
      }
      toast.error('Save failed', caught instanceof ApiRequestError ? caught.message : undefined)
    } finally {
      setSaving(false)
    }
  }

  const saveLabel = project ? 'Save changes' : 'Create project'
  const disabled = saving || mediaBusy

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            All projects
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
            {project ? 'Edit project' : 'Add new project'}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>
              {project
                ? 'Update the project content, media, and publishing details.'
                : 'Create a project record. You can keep it as a draft until it is ready.'}
            </span>
            {project && <StatusBadge status={form.status} />}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {project?.status === 'published' && (
            <a
              href={`/projects/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={adminSecondaryButtonClass}
            >
              <ExternalLink aria-hidden="true" className="size-4" />
              View public page
            </a>
          )}
          <button
            type="submit"
            form="project-form"
            disabled={disabled}
            className={adminPrimaryButtonClass}
          >
            {saving ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Save aria-hidden="true" className="size-4" />
            )}
            {saving ? 'Saving…' : saveLabel}
          </button>
        </div>
      </div>

      {formError && (
        <div
          role="alert"
          className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {formError}
        </div>
      )}

      <form
        id="project-form"
        onSubmit={(event) => {
          event.preventDefault()
          void saveProject()
        }}
        noValidate
        className="mt-6 grid gap-6 xl:grid-cols-3"
      >
        <div className="space-y-6 xl:col-span-2">
          <Card
            title="Project information"
            description="The primary content shown on the project listing and detail page."
          >
            <div className="grid gap-5">
              <div>
                <label htmlFor="project-title" className={adminLabelClass}>
                  Project title <span className="text-destructive">*</span>
                </label>
                <input
                  id="project-title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  maxLength={200}
                  aria-invalid={errors.title ? true : undefined}
                  aria-describedby={errors.title ? 'project-title-error' : undefined}
                  className={adminInputClass}
                  placeholder="e.g. 500 kW rooftop solar installation"
                />
                {errors.title && (
                  <p id="project-title-error" className={adminErrorClass}>
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="project-slug" className={adminLabelClass}>
                  Project slug <span className="text-destructive">*</span>
                </label>
                <div className="mt-2 flex items-center rounded-md border border-input bg-background focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
                  <span className="shrink-0 pl-3.5 font-mono text-xs text-muted-foreground">
                    /projects/
                  </span>
                  <input
                    id="project-slug"
                    name="slug"
                    type="text"
                    value={form.slug}
                    onChange={(event) => {
                      setSlugTouched(true)
                      updateField('slug', event.target.value)
                    }}
                    onBlur={() => {
                      if (form.slug) updateField('slug', slugify(form.slug))
                    }}
                    maxLength={180}
                    aria-invalid={errors.slug ? true : undefined}
                    aria-describedby={errors.slug ? 'project-slug-error' : 'project-slug-hint'}
                    className="block w-full bg-transparent px-1 py-2.5 font-mono text-sm outline-none"
                    placeholder="500-kw-rooftop-solar"
                  />
                </div>
                {errors.slug ? (
                  <p id="project-slug-error" className={adminErrorClass}>
                    {errors.slug}
                  </p>
                ) : (
                  <p id="project-slug-hint" className={adminHintClass}>
                    Generated from the title. Must be unique.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="project-category" className={adminLabelClass}>
                  Category
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    id="project-category"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={(event) => updateField('categoryId', event.target.value)}
                    className={`${adminInputClass} mt-0 flex-1`}
                  >
                    <option value="">No category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <Link
                    href="/admin/categories"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Manage categories
                  </Link>
                </div>
                <FieldError message={errors.categoryId} />
              </div>

              <div>
                <label htmlFor="project-short-description" className={adminLabelClass}>
                  Short description <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="project-short-description"
                  name="shortDescription"
                  rows={3}
                  value={form.shortDescription}
                  onChange={(event) => updateField('shortDescription', event.target.value)}
                  maxLength={600}
                  aria-invalid={errors.shortDescription ? true : undefined}
                  aria-describedby={
                    errors.shortDescription ? 'project-short-error' : undefined
                  }
                  className={adminInputClass}
                  placeholder="A concise summary used on project cards and previews."
                />
                <div className="flex items-center justify-between">
                  <FieldError message={errors.shortDescription} />
                  <p className="ml-auto mt-1 text-xs text-muted-foreground">
                    {form.shortDescription.length}/600
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="project-detailed-description" className={adminLabelClass}>
                  Detailed description
                </label>
                <textarea
                  id="project-detailed-description"
                  name="detailedDescription"
                  rows={12}
                  value={form.detailedDescription}
                  onChange={(event) => updateField('detailedDescription', event.target.value)}
                  className={adminInputClass}
                  placeholder="Describe the project scope, approach, and outcome. Separate paragraphs with a blank line."
                />
                <FieldError message={errors.detailedDescription} />
              </div>
            </div>
          </Card>

          <Card
            title="Project details"
            description="Client, location, dates, and delivery status."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="project-client" className={adminLabelClass}>
                  Client name
                </label>
                <input
                  id="project-client"
                  name="clientName"
                  type="text"
                  value={form.clientName}
                  onChange={(event) => updateField('clientName', event.target.value)}
                  maxLength={200}
                  className={adminInputClass}
                />
                <FieldError message={errors.clientName} />
              </div>
              <div>
                <label htmlFor="project-location" className={adminLabelClass}>
                  Project location
                </label>
                <input
                  id="project-location"
                  name="projectLocation"
                  type="text"
                  value={form.projectLocation}
                  onChange={(event) => updateField('projectLocation', event.target.value)}
                  maxLength={200}
                  className={adminInputClass}
                  placeholder="City, state"
                />
                <FieldError message={errors.projectLocation} />
              </div>
              <div>
                <label htmlFor="project-start-date" className={adminLabelClass}>
                  Start date
                </label>
                <input
                  id="project-start-date"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(event) => updateField('startDate', event.target.value)}
                  className={adminInputClass}
                />
                <FieldError message={errors.startDate} />
              </div>
              <div>
                <label htmlFor="project-completion-date" className={adminLabelClass}>
                  Completion date
                </label>
                <input
                  id="project-completion-date"
                  name="completionDate"
                  type="date"
                  value={form.completionDate}
                  onChange={(event) => updateField('completionDate', event.target.value)}
                  className={adminInputClass}
                />
                <FieldError message={errors.completionDate} />
              </div>
              <div>
                <label htmlFor="project-lifecycle" className={adminLabelClass}>
                  Project status
                </label>
                <select
                  id="project-lifecycle"
                  name="projectStatus"
                  value={form.projectStatus}
                  onChange={(event) =>
                    updateField('projectStatus', event.target.value as LifecycleStatus)
                  }
                  className={adminInputClass}
                >
                  {LIFECYCLE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {lifecycleLabels[status]}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.projectStatus} />
              </div>
            </div>
          </Card>

          <Card
            title="Project content"
            description="Structured details displayed on the public project page."
          >
            <div className="space-y-7">
              <TagEditor
                label="Technologies used"
                hint="Add the key technologies, equipment, or systems. Press Enter or Add."
                placeholder="e.g. Rooftop solar modules"
                items={form.technologies}
                onChange={(items) => updateField('technologies', items)}
                error={errors.technologies}
              />
              <TextListEditor
                label="Project features"
                hint="Add the specific scope items delivered for this project."
                placeholder="e.g. Design, supply, installation, and commissioning"
                items={form.features}
                onChange={(items) => updateField('features', items)}
                error={errors.features}
                textarea
              />
              <TextListEditor
                label="Project highlights"
                hint="Short, outcome-focused points shown as highlight cards."
                placeholder="e.g. Reduced daytime energy costs"
                items={form.highlights}
                onChange={(items) => updateField('highlights', items)}
                error={errors.highlights}
                textarea
              />
              <TagEditor
                label="Project tags"
                hint="Optional labels used for context, such as “Rooftop” or “Commercial”."
                placeholder="e.g. Commercial"
                items={form.tags}
                onChange={(items) => updateField('tags', items)}
                error={errors.tags}
              />
            </div>
          </Card>

          <Card
            title="Media"
            description="Upload a cover image, gallery photos, documents, and video. Images are optimised automatically."
          >
            <div className="space-y-8">
              <div>
                <p className={adminLabelClass}>Cover image</p>
                <p className={adminHintClass}>
                  JPG, JPEG, PNG, or WEBP up to 12 MB. Images are resized and converted to WEBP.
                </p>
                <input
                  ref={coverInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => void handleCoverUpload(event.target.files?.[0])}
                />
                {form.coverImage ? (
                  <div className="mt-3 max-w-md">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-muted">
                      <Image
                        src={form.coverImage}
                        alt={form.coverImageAlt || 'Project cover image'}
                        fill
                        sizes="(min-width: 768px) 28rem, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => coverInput.current?.click()}
                        disabled={coverUploading || saving}
                        className={`${adminSecondaryButtonClass} h-8 px-3 text-xs`}
                      >
                        {coverUploading ? (
                          <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
                        ) : (
                          <Upload aria-hidden="true" className="size-3.5" />
                        )}
                        {coverUploading ? 'Uploading…' : 'Replace image'}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('coverImage', '')}
                        disabled={saving}
                        className={`${adminDangerButtonClass} h-8 px-3 text-xs`}
                      >
                        <Trash2 aria-hidden="true" className="size-3.5" />
                        Remove
                      </button>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="project-cover-alt" className="text-xs font-semibold">
                        Cover image alt text
                      </label>
                      <input
                        id="project-cover-alt"
                        type="text"
                        value={form.coverImageAlt}
                        onChange={(event) => updateField('coverImageAlt', event.target.value)}
                        maxLength={300}
                        className={`${adminInputClass} mt-1`}
                        placeholder="Describe the image for accessibility"
                      />
                      <FieldError message={errors.coverImageAlt} />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverInput.current?.click()}
                    disabled={coverUploading || saving}
                    className="mt-3 flex w-full max-w-md flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-6 py-10 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-60"
                  >
                    {coverUploading ? (
                      <Loader2 aria-hidden="true" className="size-6 animate-spin" />
                    ) : (
                      <ImagePlus aria-hidden="true" className="size-6" />
                    )}
                    {coverUploading ? 'Uploading image…' : 'Upload cover image'}
                  </button>
                )}
                <FieldError message={errors.coverImage} />
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className={adminLabelClass}>Gallery images</p>
                    <p className={adminHintClass}>
                      Upload multiple photos. Drag-free ordering uses the arrow buttons.
                    </p>
                  </div>
                  <input
                    ref={galleryInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(event) => void handleGalleryUpload(event.target.files)}
                  />
                  <button
                    type="button"
                    onClick={() => galleryInput.current?.click()}
                    disabled={galleryUploading || saving}
                    className={adminSecondaryButtonClass}
                  >
                    {galleryUploading ? (
                      <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                    ) : (
                      <ImagePlus aria-hidden="true" className="size-4" />
                    )}
                    {galleryUploading ? 'Uploading…' : 'Add gallery images'}
                  </button>
                </div>
                <FieldError message={errors.gallery} />
                {form.gallery.length === 0 ? (
                  <p className="mt-3 rounded-md border border-dashed border-border px-3 py-4 text-xs text-muted-foreground">
                    No gallery images yet.
                  </p>
                ) : (
                  <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                    {form.gallery.map((image, index) => (
                      <li
                        key={`${image.url}-${index}`}
                        className="rounded-md border border-border bg-muted/20 p-2"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded bg-muted">
                          <Image
                            src={image.url}
                            alt={image.altText || `Gallery image ${index + 1}`}
                            fill
                            sizes="(min-width: 640px) 20rem, 100vw"
                            className="object-cover"
                          />
                          <div className="absolute right-1.5 top-1.5 flex gap-1">
                            <button
                              type="button"
                              onClick={() => moveGallery(index, -1)}
                              disabled={index === 0}
                              className="rounded bg-background/95 p-1.5 text-muted-foreground shadow-sm hover:text-foreground disabled:opacity-40"
                              aria-label="Move image up"
                            >
                              <ArrowUp aria-hidden="true" className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveGallery(index, 1)}
                              disabled={index === form.gallery.length - 1}
                              className="rounded bg-background/95 p-1.5 text-muted-foreground shadow-sm hover:text-foreground disabled:opacity-40"
                              aria-label="Move image down"
                            >
                              <ArrowDown aria-hidden="true" className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateField(
                                  'gallery',
                                  form.gallery.filter(
                                    (_, itemIndex) => itemIndex !== index,
                                  ),
                                )
                              }
                              className="rounded bg-background/95 p-1.5 text-muted-foreground shadow-sm hover:text-destructive"
                              aria-label="Remove image"
                            >
                              <X aria-hidden="true" className="size-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 space-y-1.5">
                          <input
                            type="text"
                            value={image.altText ?? ''}
                            onChange={(event) =>
                              updateGallery(index, 'altText', event.target.value)
                            }
                            className={`${adminInputClass} mt-0 text-xs`}
                            placeholder="Alt text"
                            aria-label={`Alt text for gallery image ${index + 1}`}
                          />
                          <input
                            type="text"
                            value={image.caption ?? ''}
                            onChange={(event) =>
                              updateGallery(index, 'caption', event.target.value)
                            }
                            className={`${adminInputClass} mt-0 text-xs`}
                            placeholder="Caption (optional)"
                            aria-label={`Caption for gallery image ${index + 1}`}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className={adminLabelClass}>Documents</p>
                    <p className={adminHintClass}>
                      PDF, Word, Excel, PowerPoint, TXT, or CSV up to 25 MB.
                    </p>
                  </div>
                  <input
                    ref={documentsInput}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                    multiple
                    className="hidden"
                    onChange={(event) => void handleDocumentUpload(event.target.files)}
                  />
                  <button
                    type="button"
                    onClick={() => documentsInput.current?.click()}
                    disabled={documentsUploading || saving}
                    className={adminSecondaryButtonClass}
                  >
                    {documentsUploading ? (
                      <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                    ) : (
                      <Upload aria-hidden="true" className="size-4" />
                    )}
                    {documentsUploading ? 'Uploading…' : 'Add documents'}
                  </button>
                </div>
                <FieldError message={errors.documents} />
                {form.documents.length === 0 ? (
                  <p className="mt-3 rounded-md border border-dashed border-border px-3 py-4 text-xs text-muted-foreground">
                    No documents attached.
                  </p>
                ) : (
                  <ul className="mt-3 divide-y divide-border rounded-md border border-border">
                    {form.documents.map((document, index) => (
                      <li
                        key={`${document.url}-${index}`}
                        className="flex items-center gap-3 px-3 py-2.5"
                      >
                        <FileText
                          aria-hidden="true"
                          className="size-4 shrink-0 text-muted-foreground"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {document.filename ?? `Document ${index + 1}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatBytes(document.sizeBytes)}
                          </p>
                        </div>
                        <a
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="Open document"
                        >
                          <ExternalLink aria-hidden="true" className="size-4" />
                          <span className="sr-only">Open document</span>
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            updateField(
                              'documents',
                              form.documents.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            )
                          }
                          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                          title="Remove document"
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                          <span className="sr-only">Remove document</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-border pt-6">
                <p className={adminLabelClass}>Project video</p>
                <p className={adminHintClass}>
                  Paste a YouTube or Vimeo URL, a direct MP4/WEBM URL, or upload a video file up
                  to 80 MB.
                </p>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    id="project-video-url"
                    type="url"
                    value={form.videoUrl}
                    onChange={(event) => updateField('videoUrl', event.target.value)}
                    className={`${adminInputClass} mt-0 flex-1`}
                    placeholder="https://www.youtube.com/watch?v=…"
                  />
                  <input
                    ref={videoInput}
                    type="file"
                    accept="video/mp4,video/webm"
                    className="hidden"
                    onChange={(event) => void handleVideoUpload(event.target.files?.[0])}
                  />
                  <button
                    type="button"
                    onClick={() => videoInput.current?.click()}
                    disabled={videoUploading || saving}
                    className={`${adminSecondaryButtonClass} shrink-0`}
                  >
                    {videoUploading ? (
                      <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                    ) : (
                      <Video aria-hidden="true" className="size-4" />
                    )}
                    {videoUploading ? 'Uploading…' : 'Upload video'}
                  </button>
                </div>
                <FieldError message={errors.videoUrl} />
              </div>
            </div>
          </Card>

          <Card
            title="SEO"
            description="Optional metadata for search engines and social previews."
          >
            <div className="grid gap-5">
              <div>
                <label htmlFor="project-seo-title" className={adminLabelClass}>
                  SEO title
                </label>
                <input
                  id="project-seo-title"
                  type="text"
                  value={form.seoTitle}
                  onChange={(event) => updateField('seoTitle', event.target.value)}
                  maxLength={200}
                  className={adminInputClass}
                  placeholder="Defaults to the project title"
                />
                <div className="flex items-center justify-between">
                  <FieldError message={errors.seoTitle} />
                  <p className="ml-auto mt-1 text-xs text-muted-foreground">
                    {form.seoTitle.length}/200
                  </p>
                </div>
              </div>
              <div>
                <label htmlFor="project-seo-description" className={adminLabelClass}>
                  SEO description
                </label>
                <textarea
                  id="project-seo-description"
                  rows={3}
                  value={form.seoDescription}
                  onChange={(event) => updateField('seoDescription', event.target.value)}
                  maxLength={500}
                  className={adminInputClass}
                  placeholder="Defaults to the short description"
                />
                <div className="flex items-center justify-between">
                  <FieldError message={errors.seoDescription} />
                  <p className="ml-auto mt-1 text-xs text-muted-foreground">
                    {form.seoDescription.length}/500
                  </p>
                </div>
              </div>
              <div>
                <label htmlFor="project-seo-keywords" className={adminLabelClass}>
                  SEO keywords
                </label>
                <input
                  id="project-seo-keywords"
                  type="text"
                  value={form.seoKeywords}
                  onChange={(event) => updateField('seoKeywords', event.target.value)}
                  maxLength={500}
                  className={adminInputClass}
                  placeholder="solar rooftop, commercial solar, EPC"
                />
                <FieldError message={errors.seoKeywords} />
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card title="Publishing" description="Control where this project is visible.">
            <div className="space-y-4">
              <div>
                <label htmlFor="project-status" className={adminLabelClass}>
                  Publication status
                </label>
                <select
                  id="project-status"
                  value={form.status}
                  onChange={(event) =>
                    updateField('status', event.target.value as ProjectStatus)
                  }
                  className={adminInputClass}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className={adminHintClass}>
                  {statusOptions.find((option) => option.value === form.status)?.hint}
                </p>
              </div>

              <label className="flex items-start gap-3 rounded-md border border-border p-3">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => updateField('featured', event.target.checked)}
                  className="mt-0.5 size-4 accent-[var(--primary)]"
                />
                <span>
                  <span className="block text-sm font-semibold">Feature this project</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    Featured projects appear first on the public projects listing.
                  </span>
                </span>
              </label>

              {project && (
                <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                  <p>
                    Current public URL:{' '}
                    <span className="break-all font-mono">/projects/{project.slug}</span>
                  </p>
                  <p className="mt-1">
                    Last updated: {formatDateTime(project.updatedAt)}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={disabled}
                className={`${adminPrimaryButtonClass} w-full`}
              >
                {saving ? (
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                ) : (
                  <Save aria-hidden="true" className="size-4" />
                )}
                {saving ? 'Saving…' : saveLabel}
              </button>
              {mediaBusy && (
                <p className="text-center text-xs text-muted-foreground">
                  Finish uploading media before saving.
                </p>
              )}
            </div>
          </Card>

          <Card title="Publishing checklist">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                Add a clear title and short description.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                Upload a cover image and gallery photos where available.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                Set the publication status to Published.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                Use “View public page” to verify the result.
              </li>
            </ul>
          </Card>
        </aside>
      </form>
    </div>
  )
}
