import {
  Outlet,
  createRootRoute,
  redirect,
  useNavigate,
  useRouterState,
  Scripts,
  HeadContent,
} from '@tanstack/react-router'
import { useState } from 'react'
import { getSession, logout } from '#/lib/auth'
import { AppHeader } from '#/components/AppHeader'
import { CreateClientDialog } from '#/components/CreateClientDialog'
import { CreateProjectDialog } from '#/components/CreateProjectDialog'
import { ManageUsersDialog } from '#/components/ManageUsersDialog'

import '../styles.css'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    if (typeof window === 'undefined') return
    if (location.pathname === '/login') return
    if (!getSession()) {
      throw redirect({ to: '/login' })
    }
  },
  component: RootDocument,
})

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Origin</title>
        <HeadContent />
      </head>
      <body>
        <AppShell />
        <Scripts />
      </body>
    </html>
  )
}

function AppShell() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const session = getSession()

  const [clientOpen, setClientOpen] = useState(false)
  const [projectOpen, setProjectOpen] = useState(false)
  const [usersOpen, setUsersOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  if (pathname === '/login') {
    return <Outlet />
  }

  return (
    <>
      <AppHeader
        session={session}
        onNewClient={() => setClientOpen(true)}
        onNewProject={() => setProjectOpen(true)}
        onManageUsers={() => setUsersOpen(true)}
        onLogout={handleLogout}
      />

      <Outlet />

      <CreateClientDialog open={clientOpen} onOpenChange={setClientOpen} />
      <CreateProjectDialog open={projectOpen} onOpenChange={setProjectOpen} />
      <ManageUsersDialog
        open={usersOpen}
        onOpenChange={setUsersOpen}
        currentUserId={session?.id}
      />
    </>
  )
}
