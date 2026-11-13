import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectForm } from '@/components/admin/project-form'
import { getCategories } from '@/lib/categories'
import { getAdminProject } from '@/lib/projects'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const id = Number((await params).id)
  if (!Number.isInteger(id) || id <= 0) return { title: 'Edit Project' }
  const project = getAdminProject(id)
  return { title: project ? `Edit: ${project.title}` : 'Edit Project' }
}

export default async function EditProjectPage({ params }: { params: Params }) {
  const id = Number((await params).id)
  if (!Number.isInteger(id) || id <= 0) notFound()

  const project = getAdminProject(id)
  if (!project) notFound()

  const categories = getCategories()
  return <ProjectForm categories={categories} project={project} />
}
