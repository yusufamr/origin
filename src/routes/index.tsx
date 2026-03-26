import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { ProjectsTable } from '#/components/projects/ProjectsTable'
import { $listProjects } from '#/server/projects'

type Period = 'all' | 'today' | 'week' | 'month' | 'year'

const PERIODS: { value: Period; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
]

function isInPeriod(dateStr: string | null | undefined, period: Period): boolean {
  if (period === 'all') return true
  if (!dateStr) return false
  const date = new Date(dateStr)
  const now = new Date()
  if (period === 'today') {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    )
  }
  if (period === 'week') {
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    return date >= startOfWeek
  }
  if (period === 'month') {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
  }
  if (period === 'year') {
    return date.getFullYear() === now.getFullYear()
  }
  return true
}

export const Route = createFileRoute('/')({
  loader: () => $listProjects(),
  component: HomePage,
})

function HomePage() {
  const raw = Route.useLoaderData()
  const [period, setPeriod] = useState<Period>('all')
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()

  const projects = raw
    .filter((p) => isInPeriod(p.createdAt, period))
    .map((p) => ({
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
      createdBy: p.createdBy ?? '',
    }))
    .filter((p) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.clientPhone.includes(q) ||
      p.createdBy.toLowerCase().includes(q)
    )

  const isFiltered = period !== 'all' || q !== ''

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-[var(--sea-ink)]">Projects</h1>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" />
          <input
            type="text"
            placeholder="Search projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-64 rounded-full border border-[var(--line)] bg-transparent pl-9 pr-4 text-sm text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)] outline-none focus:border-[var(--lagoon)]"
          />
        </div>

        <div className="flex items-center gap-2">
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                period === value
                  ? 'border-[var(--lagoon)] bg-[var(--lagoon)] text-white'
                  : 'border-[var(--line)] bg-transparent text-[var(--sea-ink-soft)] hover:border-[var(--lagoon)] hover:text-[var(--lagoon)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isFiltered && (
          <span className="text-sm text-[var(--sea-ink-soft)]">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="text-[var(--sea-ink-soft)]">
          {!isFiltered
            ? <>No projects yet. Click <strong>New Project</strong> to get started.</>
            : 'No projects match your search.'}
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
