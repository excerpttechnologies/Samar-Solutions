import type { Metadata } from 'next'
import { CategoryManager } from '@/components/admin/category-manager'
import { getCategories } from '@/lib/categories'

export const metadata: Metadata = { title: 'Categories' }

export default function AdminCategoriesPage() {
  const categories = getCategories()
  return (
    <div>
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Content structure
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl">
          Project categories
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create and organise the categories used to group projects on the public website.
        </p>
      </div>
      <div className="mt-8">
        <CategoryManager categories={categories} />
      </div>
    </div>
  )
}
