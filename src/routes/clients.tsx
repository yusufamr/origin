import { createFileRoute } from '@tanstack/react-router'
import { ClientsTable } from '#/components/clients/ClientsTable'

export const Route = createFileRoute('/clients')({ component: ClientsPage })

// Placeholder until server functions are wired up
const mockClients = [
  { id: 1, firstName: 'Ahmed', lastName: 'Hassan', phone: '+201001234567' },
  { id: 2, firstName: 'Sara', lastName: 'Ali', phone: '+201112345678', phone2: '+201198765432' },
  { id: 3, firstName: 'Mohamed', lastName: 'Khaled', phone: '+201223456789' },
]

function ClientsPage() {
  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-[var(--sea-ink)]">Clients</h1>

      {mockClients.length === 0 ? (
        <p className="text-[var(--sea-ink-soft)]">
          No clients yet. Click <strong>New Client</strong> to get started.
        </p>
      ) : (
        <ClientsTable clients={mockClients} />
      )}
    </main>
  )
}
