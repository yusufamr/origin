import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { WindowsTable } from '#/components/windows/WindowsTable'
import { StatusBadge } from '#/components/projects/StatusBadge'
import { $getProjectById, $updateProjectStatus } from '#/server/projects'
import { $listWindowsByProject } from '#/server/windows'

export const Route = createFileRoute('/projects/$projectId')({
  loader: async ({ params }) => {
    const projectId = Number(params.projectId)
    const [project, windows] = await Promise.all([
      $getProjectById({ data: projectId }),
      $listWindowsByProject({ data: projectId }),
    ])
    return { project, windows }
  },
  component: ProjectPage,
})

function ProjectPage() {
  const { projectId } = Route.useParams()
  const { project, windows } = Route.useLoaderData()
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const [addingWindow, setAddingWindow] = useState(false)

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

  function handleWindowAdded() {
    setAddingWindow(false)
    router.invalidate()
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
          <Button onClick={() => setAddingWindow(true)} disabled={addingWindow}>
            Add Window
          </Button>
        </div>
      </div>

      {windows.length === 0 && !addingWindow ? (
        <p className="text-[var(--sea-ink-soft)]">
          No windows yet. Click <strong>Add Window</strong> to get started.
        </p>
      ) : (
        <WindowsTable
          windows={windows}
          projectId={Number(projectId)}
          isAdding={addingWindow}
          onCancel={() => setAddingWindow(false)}
          onWindowAdded={handleWindowAdded}
        />
      )}
    </main>
  )
}
