import { createFileRoute } from '@tanstack/react-router'
import { ClientsTable } from '#/components/clients/ClientsTable'
import { $listClients } from '#/server/clients'

export const Route = createFileRoute('/clients')({
  loader: () => $listClients(),
  component: ClientsPage,
})

function ClientsPage() {
  const clients = Route.useLoaderData()

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-[var(--sea-ink)]">Clients</h1>

      {clients.length === 0 ? (
        <p className="text-[var(--sea-ink-soft)]">
          No clients yet. Click <strong>New Client</strong> to get started.
        </p>
      ) : (
        <ClientsTable clients={clients} />
      )}
    </main>
  )
}
