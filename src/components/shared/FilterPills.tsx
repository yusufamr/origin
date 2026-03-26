interface Option<T> {
  value: T
  label: string
}

interface FilterPillsProps<T> {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

export function FilterPills<T>({ options, value, onChange }: FilterPillsProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={String(opt.value ?? '__null__')}
            onClick={() => onChange(opt.value)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? 'border-[var(--lagoon)] bg-[var(--lagoon)] text-white'
                : 'border-[var(--line)] bg-transparent text-[var(--sea-ink-soft)] hover:border-[var(--lagoon)] hover:text-[var(--lagoon)]'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
