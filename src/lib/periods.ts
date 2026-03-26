export type Period = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom'

export const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom' },
]

export type ProjectStatus = 'sent' | 'done' | null

export const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'sent', label: 'Sent' },
  { value: 'done', label: 'Done' },
]

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function getPeriodRange(
  period: Period,
  customYear: number,
  customMonth: number | null,
): { from: Date; to: Date } {
  const now = new Date()
  if (period === 'all') return { from: new Date(2000, 0, 1), to: new Date(2100, 0, 1) }
  if (period === 'today') {
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return { from, to: new Date(from.getTime() + 86_400_000) }
  }
  if (period === 'week') {
    const from = new Date(now)
    from.setDate(now.getDate() - now.getDay())
    from.setHours(0, 0, 0, 0)
    return { from, to: new Date(from.getTime() + 7 * 86_400_000) }
  }
  if (period === 'month') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1)
    return { from, to: new Date(now.getFullYear(), now.getMonth() + 1, 1) }
  }
  if (period === 'year') {
    return {
      from: new Date(now.getFullYear(), 0, 1),
      to: new Date(now.getFullYear() + 1, 0, 1),
    }
  }
  // custom
  if (customMonth !== null) {
    return {
      from: new Date(customYear, customMonth - 1, 1),
      to: new Date(customYear, customMonth, 1),
    }
  }
  return {
    from: new Date(customYear, 0, 1),
    to: new Date(customYear + 1, 0, 1),
  }
}

export function isInPeriod(
  dateStr: string | null | undefined,
  period: Period,
  customYear = new Date().getFullYear(),
  customMonth: number | null = null,
): boolean {
  if (period === 'all') return true
  if (!dateStr) return false
  const { from, to } = getPeriodRange(period, customYear, customMonth)
  const date = new Date(dateStr)
  return date >= from && date < to
}

export function getPeriodLabel(
  period: Period,
  customYear: number,
  customMonth: number | null,
): string {
  const now = new Date()
  if (period === 'all') return 'All time'
  if (period === 'today')
    return `Today, ${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
  if (period === 'week') return 'This Week'
  if (period === 'month')
    return `This Month (${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`
  if (period === 'year') return `This Year (${now.getFullYear()})`
  return customMonth !== null ? `${MONTHS[customMonth - 1]} ${customYear}` : String(customYear)
}
