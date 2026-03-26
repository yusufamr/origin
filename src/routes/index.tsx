import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { ProjectsTable } from '#/components/projects/ProjectsTable'
import { FilterPills } from '#/components/shared/FilterPills'
import { $listProjects } from '#/server/projects'
import { PERIOD_OPTIONS } from '#/lib/periods'
import { usePeriodFilter, MONTH_OPTIONS } from '#/lib/usePeriodFilter'

export const Route = createFileRoute('/')({
  loader: () => $listProjects(),
  component: HomePage,
})

function HomePage() {
  const raw = Route.useLoaderData()
  const [query, setQuery] = useState('')
  const { period, setPeriod, customYear, setCustomYear, customMonth, setCustomMonth, filterByPeriod } =
    usePeriodFilter({ defaultPeriod: 'all' })

  const q = query.trim().toLowerCase()

  const availableYears = [...new Set(
    raw.map((p) => p.createdAt ? new Date(p.createdAt).getFullYear() : null).filter(Boolean) as number[]
  )].sort((a, b) => b - a)

  const projects = filterByPeriod(raw, (p) => p.createdAt)
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

      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
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

          <FilterPills options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />

          {isFiltered && (
            <span className="text-sm text-[var(--sea-ink-soft)]">
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {period === 'custom' && (
          <div className="flex flex-wrap items-start gap-4 rounded-lg border border-[var(--line)] bg-[var(--sand)] px-4 py-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--sea-ink-soft)]">Year</span>
              <FilterPills
                options={availableYears.map((y) => ({ value: y, label: String(y) }))}
                value={customYear}
                onChange={setCustomYear}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--sea-ink-soft)]">Month</span>
              <FilterPills options={MONTH_OPTIONS} value={customMonth} onChange={setCustomMonth} />
            </div>
          </div>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="text-[var(--sea-ink-soft)]">
          {!isFiltered
            ? <><strong>No projects yet.</strong> Click New Project to get started.</>
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
