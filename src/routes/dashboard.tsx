import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { getSession } from '#/lib/auth'
import { $getProjectStats } from '#/server/projects'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    const session = getSession()
    if (!session || session.role !== 'admin') throw redirect({ to: '/' })
  },
  loader: () => {
    const year = new Date().getFullYear()
    return $getProjectStats({ data: { year, month: null, status: null } })
  },
  component: DashboardPage,
})

function DashboardPage() {
  const initial = Route.useLoaderData()
  const currentYear = new Date().getFullYear()

  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState<number | null>(null)
  const [status, setStatus] = useState<'sent' | 'done' | null>(null)
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(false)

  // Available years: always include current year even if no projects yet
  const years = data.years.length > 0
    ? data.years.includes(currentYear) ? data.years : [currentYear, ...data.years]
    : [currentYear]

  async function fetchStats(nextYear: number, nextMonth: number | null, nextStatus: 'sent' | 'done' | null) {
    setLoading(true)
    try {
      const result = await $getProjectStats({ data: { year: nextYear, month: nextMonth, status: nextStatus } })
      setData(result)
    } finally {
      setLoading(false)
    }
  }

  function handleYearChange(y: number) {
    setYear(y)
    fetchStats(y, month, status)
  }

  function handleMonthChange(m: number | null) {
    setMonth(m)
    fetchStats(year, m, status)
  }

  function handleStatusChange(s: 'sent' | 'done' | null) {
    setStatus(s)
    fetchStats(year, month, s)
  }

  const stats = data.stats
  const total = stats.reduce((sum, row) => sum + row.count, 0)
  const maxCount = Math.max(...stats.map((r) => r.count), 1)

  const periodLabel = [
    month !== null ? `${MONTHS[month - 1]} ${year}` : `${year}`,
    status !== null ? `· ${status}` : '',
  ].filter(Boolean).join(' ')

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-6">Dashboard</h1>

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* Year */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">Year</label>
          <div className="flex gap-1">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => handleYearChange(y)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors"
                style={{
                  background: year === y ? 'var(--lagoon)' : 'transparent',
                  color: year === y ? '#fff' : 'var(--sea-ink)',
                  borderColor: year === y ? 'var(--lagoon)' : 'var(--line)',
                }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Month */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">Month</label>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => handleMonthChange(null)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors"
              style={{
                background: month === null ? 'var(--lagoon)' : 'transparent',
                color: month === null ? '#fff' : 'var(--sea-ink)',
                borderColor: month === null ? 'var(--lagoon)' : 'var(--line)',
              }}
            >
              All
            </button>
            {MONTHS.map((name, i) => {
              const m = i + 1
              return (
                <button
                  key={m}
                  onClick={() => handleMonthChange(m)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors"
                  style={{
                    background: month === m ? 'var(--lagoon)' : 'transparent',
                    color: month === m ? '#fff' : 'var(--sea-ink)',
                    borderColor: month === m ? 'var(--lagoon)' : 'var(--line)',
                  }}
                >
                  {name.slice(0, 3)}
                </button>
              )
            })}
          </div>
        </div>
        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">Status</label>
          <div className="flex gap-1">
            {([null, 'sent', 'done'] as const).map((s) => (
              <button
                key={s ?? 'all'}
                onClick={() => handleStatusChange(s)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize"
                style={{
                  background: status === s ? 'var(--lagoon)' : 'transparent',
                  color: status === s ? '#fff' : 'var(--sea-ink)',
                  borderColor: status === s ? 'var(--lagoon)' : 'var(--line)',
                }}
              >
                {s === null ? 'All' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Summary card ────────────────────────────────────────────────── */}
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

      {/* ── Per-user bar chart ───────────────────────────────────────────── */}
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
                  {/* Name */}
                  <span
                    className="w-36 shrink-0 text-sm font-medium truncate"
                    style={{ color: 'var(--sea-ink)' }}
                  >
                    {row.userName ?? 'Unknown'}
                  </span>

                  {/* Bar */}
                  <div className="flex-1 rounded-full overflow-hidden h-4" style={{ background: 'var(--sand)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: 'var(--lagoon)' }}
                    />
                  </div>

                  {/* Count */}
                  <span
                    className="w-8 shrink-0 text-right text-sm font-bold"
                    style={{ color: 'var(--lagoon-deep)' }}
                  >
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
