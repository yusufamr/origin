import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

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

interface WindowCardProps {
  window: Window
}

export function WindowCard({ window: win }: WindowCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {win.type} — {win.subtype}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-[var(--sea-ink-soft)]">
        <p>Category: {win.category}</p>
        <p>Size: {win.width}m × {win.totalHeight}m</p>
        <p>Color: {win.color}</p>
        <p>Count: {win.count}</p>
        <p className="font-semibold text-[var(--sea-ink)]">
          Total: {win.totalPrice.toLocaleString()} EGP
        </p>
      </CardContent>
    </Card>
  )
}
