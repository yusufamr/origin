import { useState, useRef } from 'react'
import { type Period, MONTHS, isInPeriod, getPeriodRange } from './periods'

export const MONTH_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: 'All' },
  ...MONTHS.map((name, i) => ({ value: i + 1, label: name.slice(0, 3) })),
]

interface UsePeriodFilterOptions {
  defaultPeriod?: Period
  defaultYear?: number
  /** Called whenever the selected range changes. Not needed for client-side filtering. */
  onRangeChange?: (range: { from: Date; to: Date }) => void
}

export function usePeriodFilter({
  defaultPeriod = 'all',
  defaultYear = new Date().getFullYear(),
  onRangeChange,
}: UsePeriodFilterOptions = {}) {
  const [period, _setPeriod] = useState<Period>(defaultPeriod)
  const [customYear, _setCustomYear] = useState(defaultYear)
  const [customMonth, _setCustomMonth] = useState<number | null>(null)

  // Ref so handlers always call the latest callback without stale closures
  const onRangeChangeRef = useRef(onRangeChange)
  onRangeChangeRef.current = onRangeChange

  function setPeriod(p: Period) {
    _setPeriod(p)
    if (p !== 'custom') {
      onRangeChangeRef.current?.(getPeriodRange(p, customYear, customMonth))
    }
  }

  function setCustomYear(y: number) {
    _setCustomYear(y)
    _setPeriod('custom')
    onRangeChangeRef.current?.(getPeriodRange('custom', y, customMonth))
  }

  function setCustomMonth(m: number | null) {
    _setCustomMonth(m)
    _setPeriod('custom')
    onRangeChangeRef.current?.(getPeriodRange('custom', customYear, m))
  }

  function filterByPeriod<T>(
    items: T[],
    getDate: (item: T) => string | null | undefined,
  ): T[] {
    return items.filter((item) => isInPeriod(getDate(item), period, customYear, customMonth))
  }

  return { period, setPeriod, customYear, setCustomYear, customMonth, setCustomMonth, filterByPeriod }
}
