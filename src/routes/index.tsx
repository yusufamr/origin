import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'

export const Route = createFileRoute('/')({ component: HomePage })

// Placeholder until server functions are wired up
const mockProjects = [
  { id: 1, name: 'Villa North Wing', address: '12 Nile St, Cairo', user: 'Ahmed Hassan', windowCount: 4, createdAt: '2026-01-10', status: 'done', city: 'Cairo' },
  { id: 2, name: 'Office Block B', address: '5 Tahrir Sq, Cairo', user: 'Sara Ali', windowCount: 7, createdAt: '2026-02-03', status: 'sent', city: 'Cairo' },
  { id: 3, name: 'Compound Unit 3', address: '88 Maadi Rd, Giza', user: 'Mohamed Khaled', windowCount: 2, createdAt: '2026-03-01', status: 'sent', city: 'Giza' },
]

function HomePage() {
  const navigate = useNavigate()

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-[var(--sea-ink)]">Projects</h1>

      {mockProjects.length === 0 ? (
        <p className="text-[var(--sea-ink-soft)]">
          No projects yet. Click <strong>New Project</strong> to get started.
        </p>
      ) : (
        <div className="rounded-lg border border-[var(--line)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Windows</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className="cursor-pointer"
                  onDoubleClick={() =>
                    navigate({ to: '/projects/$projectId', params: { projectId: String(project.id) } })
                  }
                >
                  <TableCell className="text-[var(--sea-ink-soft)]">{project.id}</TableCell>
                  <TableCell className="font-medium text-[var(--sea-ink)]">{project.name}</TableCell>
                  <TableCell className="text-[var(--sea-ink-soft)]">{project.address}</TableCell>
                  <TableCell className="text-[var(--sea-ink-soft)]">{project.city}</TableCell>
                  <TableCell className="text-[var(--sea-ink-soft)]">{project.user}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      project.status === 'done'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {project.status === 'done' ? 'Done' : 'Sent'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-[var(--sea-ink-soft)]">{project.windowCount}</TableCell>
                  <TableCell className="text-[var(--sea-ink-soft)]">{project.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="mt-4 text-xs text-[var(--sea-ink-soft)]">
        Double-click a row to view its windows.
      </p>
    </main>
  )
}
