import { FilterPills } from './FilterPills'
import { STATUS_OPTIONS, type ProjectStatus } from '#/lib/periods'

interface StatusFilterProps {
  value: ProjectStatus
  onChange: (value: ProjectStatus) => void
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return <FilterPills options={STATUS_OPTIONS} value={value} onChange={onChange} />
}
