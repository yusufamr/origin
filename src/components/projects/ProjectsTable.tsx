import { useNavigate } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { StatusBadge } from './StatusBadge'
import { PhoneCell } from '#/components/shared/PhoneCell'

interface Project {
  id: number
  name: string
  address: string
  city: string
  client: string
  clientPhone: string
  clientPhone2?: string | null
  status: 'sent' | 'done'
  windowCount: number
  createdAt: string
}

interface ProjectsTableProps {
  projects: Project[]
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-lg border border-[var(--line)] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Windows</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
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
              <TableCell className="text-[var(--sea-ink-soft)]">{project.client}</TableCell>
              <TableCell className="text-[var(--sea-ink-soft)]">
                <PhoneCell phone={project.clientPhone} phone2={project.clientPhone2} />
              </TableCell>
              <TableCell>
                <StatusBadge status={project.status} />
              </TableCell>
              <TableCell className="text-center text-[var(--sea-ink-soft)]">{project.windowCount}</TableCell>
              <TableCell className="text-[var(--sea-ink-soft)]">{project.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
