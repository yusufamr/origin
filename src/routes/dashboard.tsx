import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { getSession } from '#/lib/auth'
import { $getProjectStats } from '#/server/projects'
import { FilterPills } from '#/components/shared/FilterPills'
import { StatusFilter } from '#/components/shared/StatusFilter'
import { type ProjectStatus, PERIOD_OPTIONS, getPeriodRange, getPeriodLabel } from '#/lib/periods'
import { usePeriodFilter, MONTH_OPTIONS } from '#/lib/usePeriodFilter'

// ── Route ─────────────────────────────────────────────────────────────────────

const _now = new Date()
const _defaultRange = getPeriodRange('year', _now.getFullYear(), null)

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    const session = getSession()
    if (!session || session.role !== 'admin') throw redirect({ to: '/' })
  },
  loader: () =>
    $getProjectStats({
      data: {
        from: _defaultRange.from.toISOString(),
        to: _defaultRange.to.toISOString(),
        status: null,
      },
    }),
  component: DashboardPage,
})

// ── Page ──────────────────────────────────────────────────────────────────────

function DashboardPage() {
  const initial = Route.useLoaderData()
  const currentYear = new Date().getFullYear()

  const [status, setStatus] = useState<ProjectStatus>(null)
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(false)

  async function fetchStats({ from, to }: { from: Date; to: Date }, s = status) {
    setLoading(true)
    try {
      const result = await $getProjectStats({
        data: { from: from.toISOString(), to: to.toISOString(), status: s },
      })
      setData(result)
    } finally {
      setLoading(false)
    }
  }

  const { period, setPeriod, customYear, setCustomYear, customMonth, setCustomMonth } =
    usePeriodFilter({ defaultPeriod: 'year', defaultYear: currentYear, onRangeChange: fetchStats })

  const years = data.years.includes(currentYear) ? data.years : [currentYear, ...data.years]

  function handleStatus(s: ProjectStatus) {
    setStatus(s)
    fetchStats(getPeriodRange(period, customYear, customMonth), s)
  }

  const stats = data.stats
  const total = stats.reduce((sum, row) => sum + row.count, 0)
  const maxCount = Math.max(...stats.map((r) => r.count), 1)
  const periodLabel = getPeriodLabel(period, customYear, customMonth)

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-6">Dashboard</h1>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="mb-8 space-y-3">

        <div className="flex flex-wrap items-center gap-3">
          <span className="w-14 shrink-0 text-xs font-medium text-[var(--sea-ink-soft)]">Period</span>
          <FilterPills options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
        </div>

        {period === 'custom' && (
          <div className="ml-[4.25rem] flex flex-wrap items-start gap-4 rounded-lg border border-[var(--line)] bg-[var(--sand)] px-4 py-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--sea-ink-soft)]">Year</span>
              <FilterPills
                options={years.map((y) => ({ value: y, label: String(y) }))}
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

        <div className="flex flex-wrap items-center gap-3">
          <span className="w-14 shrink-0 text-xs font-medium text-[var(--sea-ink-soft)]">Status</span>
          <StatusFilter value={status} onChange={handleStatus} />
        </div>
      </div>

      {/* ── Summary card ─────────────────────────────────────────────────── */}
      <div
        className="inline-flex flex-col gap-0.5 rounded-xl px-6 py-4 mb-8 border"
        style={{ background: 'var(--sand)', borderColor: 'var(--line)' }}
      >
        <span className="text-xs text-[var(--sea-ink-soft)] font-medium uppercase tracking-wide">
          Total projects — {periodLabel}
        </span>
        <span className="text-4xl font-bold text-[var(--sea-ink)]">
          {loading ? '…' : total}
        </span>
      </div>

      {/* ── Per-user bar chart ────────────────────────────────────────────── */}
      {stats.length === 0 ? (
        <p className="text-[var(--sea-ink-soft)]">No projects found for this period.</p>
      ) : (
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: 'var(--line)', opacity: loading ? 0.5 : 1, transition: 'opacity 0.15s' }}
        >
          <div
            className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide border-b"
            style={{ background: 'var(--sand)', borderColor: 'var(--line)', color: 'var(--sea-ink-soft)' }}
          >
            Projects per employee — {periodLabel}
          </div>

          <div className="flex flex-col divide-y" style={{ '--divide-color': 'var(--line)' } as React.CSSProperties}>
            {stats.map((row) => {
              const pct = Math.round((row.count / maxCount) * 100)
              return (
                <div key={row.userId ?? 'unknown'} className="flex items-center gap-4 px-4 py-3">
                  <span className="w-36 shrink-0 text-sm font-medium truncate" style={{ color: 'var(--sea-ink)' }}>
                    {row.userName ?? 'Unknown'}
                  </span>
                  <div className="flex-1 rounded-full overflow-hidden h-4" style={{ background: 'var(--sand)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: 'var(--lagoon)' }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-sm font-bold" style={{ color: 'var(--lagoon-deep)' }}>
                    {row.count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}
