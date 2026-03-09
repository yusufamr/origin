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
  { id: 1, name: 'Villa North Wing', address: '12 Nile St, Cairo', user: 'Ahmed Hassan', windowCount: 4, createdAt: '2026-01-10' },
  { id: 2, name: 'Office Block B', address: '5 Tahrir Sq, Cairo', user: 'Sara Ali', windowCount: 7, createdAt: '2026-02-03' },
  { id: 3, name: 'Compound Unit 3', address: '88 Maadi Rd, Giza', user: 'Mohamed Khaled', windowCount: 2, createdAt: '2026-03-01' },
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
                <TableHead>Client</TableHead>
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
                  <TableCell className="text-[var(--sea-ink-soft)]">{project.user}</TableCell>
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
