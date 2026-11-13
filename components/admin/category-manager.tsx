'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import type { Category } from '@/lib/types'
import { ApiRequestError, apiFetch } from '@/lib/api-client'
import { slugify } from '@/lib/utils'
import { ConfirmDialog } from './confirm-dialog'
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
import { useToast } from './toast'

type FormState = {
  name: string
  slug: string
  description: string
  sortOrder: string
}

const emptyForm: FormState = { name: '', slug: '', description: '', sortOrder: '0' }

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const toast = useToast()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editing, setEditing] = useState<Category | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  function resetForm() {
    setForm(emptyForm)
    setEditing(null)
    setSlugTouched(false)
    setErrors({})
  }

  function startEdit(category: Category) {
    setEditing(category)
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
      sortOrder: String(category.sortOrder),
    })
    setSlugTouched(true)
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateName(name: string) {
    setForm((current) => ({
      ...current,
      name,
      slug: slugTouched ? current.slug : slugify(name),
    }))
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors({})

    if (!form.name.trim()) {
      setErrors({ name: 'Category name is required.' })
      return
    }

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
      description: form.description.trim() || null,
      sortOrder: Number(form.sortOrder) || 0,
    }

    setSaving(true)
    try {
      if (editing) {
        await apiFetch(`/api/admin/categories/${editing.id}`, {
          method: 'PUT',
          body: payload,
        })
        toast.success('Category updated.')
      } else {
        await apiFetch('/api/admin/categories', {
          method: 'POST',
          body: payload,
        })
        toast.success('Category created.')
      }
      resetForm()
      router.refresh()
    } catch (caught) {
      if (caught instanceof ApiRequestError) {
        setErrors(caught.fields)
        toast.error('Could not save category', caught.message)
      } else {
        toast.error('Could not save category', 'Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeleteBusy(true)
    try {
      await apiFetch(`/api/admin/categories/${deleting.id}`, { method: 'DELETE' })
      toast.success('Category deleted.')
      if (editing?.id === deleting.id) resetForm()
      setDeleting(null)
      router.refresh()
    } catch (caught) {
      toast.error(
        'Could not delete category',
        caught instanceof ApiRequestError ? caught.message : 'Please try again.',
      )
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className={`${adminCardClass} h-fit p-5 md:p-6`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">
              {editing ? 'Edit category' : 'Add category'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Categories group projects across the public site.
            </p>
          </div>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded p-1.5 text-muted-foreground hover:bg-muted"
              aria-label="Cancel editing"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          )}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="category-name" className={adminLabelClass}>
              Name <span className="text-destructive">*</span>
            </label>
            <input
              id="category-name"
              type="text"
              value={form.name}
              onChange={(event) => updateName(event.target.value)}
              maxLength={100}
              className={adminInputClass}
              placeholder="e.g. Solar"
              aria-invalid={errors.name ? true : undefined}
            />
            {errors.name && <p className={adminErrorClass}>{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="category-slug" className={adminLabelClass}>
              Slug <span className="text-destructive">*</span>
            </label>
            <input
              id="category-slug"
              type="text"
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true)
                setForm((current) => ({ ...current, slug: event.target.value }))
              }}
              onBlur={() =>
                setForm((current) => ({ ...current, slug: slugify(current.slug) }))
              }
              maxLength={120}
              className={`${adminInputClass} font-mono`}
              placeholder="solar"
              aria-invalid={errors.slug ? true : undefined}
            />
            {errors.slug && <p className={adminErrorClass}>{errors.slug}</p>}
          </div>
          <div>
            <label htmlFor="category-description" className={adminLabelClass}>
              Description
            </label>
            <textarea
              id="category-description"
              rows={3}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              maxLength={1000}
              className={adminInputClass}
              placeholder="Optional context for this category."
            />
            {errors.description && <p className={adminErrorClass}>{errors.description}</p>}
          </div>
          <div>
            <label htmlFor="category-sort" className={adminLabelClass}>
              Sort order
            </label>
            <input
              id="category-sort"
              type="number"
              min={0}
              max={10000}
              value={form.sortOrder}
              onChange={(event) =>
                setForm((current) => ({ ...current, sortOrder: event.target.value }))
              }
              className={adminInputClass}
            />
            <p className={adminHintClass}>Lower numbers appear first.</p>
            {errors.sortOrder && <p className={adminErrorClass}>{errors.sortOrder}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={saving} className={adminPrimaryButtonClass}>
              {saving ? (
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              ) : editing ? (
                <Save aria-hidden="true" className="size-4" />
              ) : (
                <Plus aria-hidden="true" className="size-4" />
              )}
              {saving ? 'Saving…' : editing ? 'Save category' : 'Add category'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className={adminSecondaryButtonClass}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className={`${adminCardClass} overflow-hidden lg:col-span-2`}>
        {categories.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-heading text-xl font-bold">No categories yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a category using the form to start organising projects.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <caption className="sr-only">Project categories</caption>
              <thead className="border-b border-border bg-muted/50 text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Projects
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Order
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{category.name}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        {category.slug}
                      </p>
                      {category.description && (
                        <p className="mt-1 line-clamp-2 max-w-md text-xs text-muted-foreground">
                          {category.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold tabular-nums">
                        {category.projectCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums text-muted-foreground">
                      {category.sortOrder}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(category)}
                          className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="Edit category"
                        >
                          <Pencil aria-hidden="true" className="size-4" />
                          <span className="sr-only">Edit {category.name}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(category)}
                          className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          title="Delete category"
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                          <span className="sr-only">Delete {category.name}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-border px-4 py-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Deleting a category does not delete its projects. Affected projects become
            uncategorised and can be reassigned at any time.
          </p>
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete “${deleting?.name ?? ''}”?`}
        description="Projects in this category will remain, but will no longer be assigned to a category. This cannot be undone."
        confirmLabel="Delete category"
        destructive
        busy={deleteBusy}
        onClose={() => setDeleting(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  )
}
