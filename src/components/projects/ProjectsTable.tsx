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
import { getSession } from '#/lib/auth'
import { Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'

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
  createdBy: string
}

interface ProjectsTableProps {
  projects: Project[]
  onDelete?: (id: number) => void
}

export function ProjectsTable({ projects, onDelete }: ProjectsTableProps) {
  const navigate = useNavigate()
  const isAdmin = getSession()?.role === 'admin'

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
            <TableHead>Created By</TableHead>
            {isAdmin && <TableHead />}
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
              <TableCell className="text-[var(--sea-ink-soft)]">{project.createdBy}</TableCell>
              {isAdmin && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete?.(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
