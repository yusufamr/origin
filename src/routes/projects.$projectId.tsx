import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { WindowsTable } from '#/components/windows/WindowsTable'
import { WindowsPDFExport } from '#/components/windows/WindowsPDFExport'
import { StatusBadge } from '#/components/projects/StatusBadge'
import { $getProjectById, $updateProjectStatus, $updateProjectFees } from '#/server/projects'
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
  const [transportationFees, setTransportationFees] = useState<string>(
    project?.transportationFees != null ? String(project.transportationFees) : ''
  )
  const [wireFees, setWireFees] = useState<string>(
    project?.wireFees != null ? String(project.wireFees) : ''
  )
  const [savingFees, setSavingFees] = useState(false)

  async function saveFees() {
    if (!project) return
    setSavingFees(true)
    try {
      await $updateProjectFees({
        data: {
          id: project.id,
          transportationFees: transportationFees !== '' ? Number(transportationFees) : null,
          wireFees: wireFees !== '' ? Number(wireFees) : null,
        },
      })
      router.invalidate()
    } finally {
      setSavingFees(false)
    }
  }

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
          {project && (
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--sea-ink-soft)]">
              {(project.clientFirstName || project.clientLastName) && (
                <span>
                  <span className="font-medium text-[var(--sea-ink)]">Client: </span>
                  {`${project.clientFirstName ?? ''} ${project.clientLastName ?? ''}`.trim()}
                </span>
              )}
              {project.clientPhone && (
                <span>
                  <span className="font-medium text-[var(--sea-ink)]">Phone: </span>
                  {project.clientPhone}
                  {project.clientPhone2 && ` / ${project.clientPhone2}`}
                </span>
              )}
              {project.city && (
                <span>
                  <span className="font-medium text-[var(--sea-ink)]">City: </span>
                  {project.city}
                </span>
              )}
              {project.address && (
                <span>
                  <span className="font-medium text-[var(--sea-ink)]">Address: </span>
                  {project.address}
                </span>
              )}
            </div>
          )}
          {project && (
            <div className="mt-3 flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[var(--sea-ink)]">Transportation Fees</label>
                <input
                  type="number"
                  min={0}
                  value={transportationFees}
                  onChange={(e) => setTransportationFees(e.target.value)}
                  className="w-36 rounded border border-[var(--sea-ink-soft)] bg-transparent px-2 py-1 text-sm text-[var(--sea-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--sea-ink)]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[var(--sea-ink)]">Wire Fees</label>
                <input
                  type="number"
                  min={0}
                  value={wireFees}
                  onChange={(e) => setWireFees(e.target.value)}
                  className="w-36 rounded border border-[var(--sea-ink-soft)] bg-transparent px-2 py-1 text-sm text-[var(--sea-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--sea-ink)]"
                />
              </div>
              <Button variant="outline" onClick={saveFees} disabled={savingFees}>
                {savingFees ? 'Saving…' : 'Save Fees'}
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {project && (
            <Button variant="outline" onClick={toggleStatus} disabled={updating}>
              Mark as {project.status === 'done' ? 'Sent' : 'Done'}
            </Button>
          )}
          {project && windows.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                const clientName = [project.clientFirstName, project.clientLastName]
                  .filter(Boolean)
                  .join(' ')
                const prev = document.title
                document.title = clientName || project.name
                window.print()
                document.title = prev
              }}
            >
              تحميل PDF
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

      {project && windows.length > 0 && (
        <WindowsPDFExport project={project} windows={windows} />
      )}
    </main>
  )
}
