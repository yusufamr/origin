import { createFileRoute } from '@tanstack/react-router'
import { ProjectsTable } from '#/components/projects/ProjectsTable'
import { $listProjects } from '#/server/projects'

export const Route = createFileRoute('/')({
  loader: () => $listProjects(),
  component: HomePage,
})

function HomePage() {
  const raw = Route.useLoaderData()

  const projects = raw.map((p) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    city: p.city ?? '',
    client: `${p.clientFirstName ?? ''} ${p.clientLastName ?? ''}`.trim(),
    clientPhone: p.clientPhone ?? '',
    clientPhone2: p.clientPhone2,
    status: (p.status ?? 'sent') as 'sent' | 'done',
    windowCount: p.windowCount,
    createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
  }))

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-[var(--sea-ink)]">Projects</h1>

      {projects.length === 0 ? (
        <p className="text-[var(--sea-ink-soft)]">
          No projects yet. Click <strong>New Project</strong> to get started.
        </p>
      ) : (
        <ProjectsTable projects={projects} />
      )}

      <p className="mt-4 text-xs text-[var(--sea-ink-soft)]">
        Double-click a row to view its windows.
      </p>
    </main>
  )
}
