import { Link } from '@tanstack/react-router'
import { Users, LogOut } from 'lucide-react'
import { Button } from '#/components/ui/button'
import type { getSession } from '#/lib/auth'

interface AppHeaderProps {
  session: ReturnType<typeof getSession>
  onNewClient: () => void
  onNewProject: () => void
  onManageUsers: () => void
  onLogout: () => void
}

export function AppHeader({
  session,
  onNewClient,
  onNewProject,
  onManageUsers,
  onLogout,
}: AppHeaderProps) {
  const isAdmin = session?.role === 'admin'

  return (
    <header className="flex items-center gap-3 border-b border-[var(--line)] bg-[var(--header-bg)] px-6 py-3 backdrop-blur">
      <Link to="/">
        <Button variant="ghost">Home</Button>
      </Link>
      <Link to="/clients">
        <Button variant="ghost">Clients</Button>
      </Link>

      <Button onClick={onNewClient}>New Client</Button>
      <Button onClick={onNewProject}>New Project</Button>

      {isAdmin && (
        <Button variant="outline" onClick={onManageUsers}>
          <Users className="h-4 w-4 mr-1.5" />
          Manage Users
        </Button>
      )}

      <div className="flex-1" />

      <span className="text-sm text-muted-foreground">
        {session?.displayName}{' '}
        <span
          className="text-xs px-1.5 py-0.5 rounded"
          style={{
            background: isAdmin ? '#e8830a22' : 'var(--chip-bg)',
            color: isAdmin ? '#e8830a' : 'var(--sea-ink-soft)',
            border: '1px solid ' + (isAdmin ? '#e8830a44' : 'var(--chip-line)'),
          }}
        >
          {session?.role}
        </span>
      </span>

      <Button variant="ghost" size="sm" onClick={onLogout}>
        <LogOut className="h-4 w-4 mr-1" />
        Logout
      </Button>
    </header>
  )
}
