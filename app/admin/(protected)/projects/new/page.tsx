import type { Metadata } from 'next'
import { ProjectForm } from '@/components/admin/project-form'
import { getCategories } from '@/lib/categories'

export const metadata: Metadata = { title: 'Add New Project' }

export default function NewProjectPage() {
  const categories = getCategories()
  return <ProjectForm categories={categories} />
}
