import { createFileRoute } from '@tanstack/react-router'
import { ProjectsTable } from '#/components/projects/ProjectsTable'

export const Route = createFileRoute('/')({ component: HomePage })

// Placeholder until server functions are wired up
const mockProjects = [
  { id: 1, name: 'Villa North Wing', address: '12 Nile St, Cairo', user: 'Ahmed Hassan', windowCount: 4, createdAt: '2026-01-10', status: 'done' as const, city: 'Cairo' },
  { id: 2, name: 'Office Block B', address: '5 Tahrir Sq, Cairo', user: 'Sara Ali', windowCount: 7, createdAt: '2026-02-03', status: 'sent' as const, city: 'Cairo' },
  { id: 3, name: 'Compound Unit 3', address: '88 Maadi Rd, Giza', user: 'Mohamed Khaled', windowCount: 2, createdAt: '2026-03-01', status: 'sent' as const, city: 'Giza' },
]

function HomePage() {
  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-[var(--sea-ink)]">Projects</h1>

      {mockProjects.length === 0 ? (
        <p className="text-[var(--sea-ink-soft)]">
          No projects yet. Click <strong>New Project</strong> to get started.
        </p>
      ) : (
        <ProjectsTable projects={mockProjects} />
      )}

      <p className="mt-4 text-xs text-[var(--sea-ink-soft)]">
        Double-click a row to view its windows.
      </p>
    </main>
  )
}
