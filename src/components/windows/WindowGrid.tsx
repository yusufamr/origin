import { WindowCard } from './WindowCard'

interface Window {
  id: number
  type: string
  subtype: string
  category: string
  width: number
  totalHeight: number
  count: number
  color: string
  totalPrice: number
}

interface WindowGridProps {
  windows: Window[]
}

export function WindowGrid({ windows }: WindowGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {windows.map((win) => (
        <WindowCard key={win.id} window={win} />
      ))}
    </div>
  )
}
