import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { WindowGrid } from '#/components/windows/WindowGrid'
import { StatusBadge } from '#/components/projects/StatusBadge'
import { $getProjectById, $updateProjectStatus } from '#/server/projects'

export const Route = createFileRoute('/projects/$projectId')({
  loader: async ({ params }) => {
    return await $getProjectById({ data: Number(params.projectId) })
  },
  component: ProjectPage,
})

// Placeholder until server functions are wired up
const mockWindows = [
  { id: 1, type: 'Sliding', subtype: 'Double', category: 'Residential', width: 1.2, totalHeight: 1.5, count: 3, color: 'White', totalPrice: 4500 },
  { id: 2, type: 'Fixed', subtype: 'Single', category: 'Commercial', width: 0.9, totalHeight: 1.2, count: 2, color: 'Black', totalPrice: 2800 },
]

function ProjectPage() {
  const { projectId } = Route.useParams()
  const project = Route.useLoaderData()
  const router = useRouter()
  const [updating, setUpdating] = useState(false)

  async function toggleStatus() {
    if (!project) return
    const newStatus = project.status === 'done' ? 'sent' : 'done'
    setUpdating(true)
    try {
      await $updateProjectStatus({ data: { id: project.id, status: newStatus } })
      router.invalidate()
    } finally {
      setUpdating(false)
    }
  }

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/">
            <Button variant="ghost" className="mb-1 pl-0 text-[var(--sea-ink-soft)]">
              ← Back to Projects
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--sea-ink)]">
              {project?.name ?? `Project #${projectId}`}
            </h1>
            {project && <StatusBadge status={project.status} />}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {project && (
            <Button variant="outline" onClick={toggleStatus} disabled={updating}>
              Mark as {project.status === 'done' ? 'Sent' : 'Done'}
            </Button>
          )}
          <Button>Add Window</Button>
        </div>
      </div>

      {mockWindows.length === 0 ? (
        <p className="text-[var(--sea-ink-soft)]">
          No windows yet. Click <strong>Add Window</strong> to get started.
        </p>
      ) : (
        <WindowGrid windows={mockWindows} />
      )}
    </main>
  )
}
