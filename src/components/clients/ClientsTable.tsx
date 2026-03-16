import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { PhoneCell } from '#/components/shared/PhoneCell'

interface Client {
  id: number
  firstName: string
  lastName: string
  phone: string
  phone2?: string | null
}

interface ClientsTableProps {
  clients: Client[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
  return (
    <div className="rounded-lg border border-[var(--line)] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="text-[var(--sea-ink-soft)]">{client.id}</TableCell>
              <TableCell className="font-medium text-[var(--sea-ink)]">{client.firstName}</TableCell>
              <TableCell className="text-[var(--sea-ink-soft)]">{client.lastName}</TableCell>
              <TableCell className="text-[var(--sea-ink-soft)]">
                <PhoneCell phone={client.phone} phone2={client.phone2} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
