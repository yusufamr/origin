import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectPage,
})

// Placeholder until server functions are wired up
const mockWindows = [
  { id: 1, type: 'Sliding', subtype: 'Double', category: 'Residential', width: 1.2, totalHeight: 1.5, count: 3, color: 'White', totalPrice: 4500 },
  { id: 2, type: 'Fixed', subtype: 'Single', category: 'Commercial', width: 0.9, totalHeight: 1.2, count: 2, color: 'Black', totalPrice: 2800 },
]

function ProjectPage() {
  const { projectId } = Route.useParams()

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/">
            <Button variant="ghost" className="mb-1 pl-0 text-[var(--sea-ink-soft)]">
              ← Back to Projects
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--sea-ink)]">
            Project #{projectId}
          </h1>
        </div>
        <Button>Add Window</Button>
      </div>

      {mockWindows.length === 0 ? (
        <p className="text-[var(--sea-ink-soft)]">
          No windows yet. Click <strong>Add Window</strong> to get started.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockWindows.map((win) => (
            <Card key={win.id}>
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
          ))}
        </div>
      )}
    </main>
  )
}
