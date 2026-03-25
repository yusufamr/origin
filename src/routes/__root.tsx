import {
  Outlet,
  createRootRoute,
  Link,
  redirect,
  useNavigate,
  useRouterState,
  useRouter,
  Scripts,
  HeadContent,
} from '@tanstack/react-router'
import { useState } from 'react'
import { Check, ChevronsUpDown, LogOut, Users } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '#/components/ui/command'
import { cn } from '#/lib/utils'
import {
  getSession,
  logout,
  getAllUsers,
  addUser,
  deleteUser,
  type Role,
} from '#/lib/auth'
import { $listClients, $createClient } from '#/server/clients'
import { $createProject } from '#/server/projects'

import '../styles.css'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    // Skip auth check on the server (localStorage not available)
    if (typeof window === 'undefined') return
    // Allow the login page through
    if (location.pathname === '/login') return
    // Redirect to login if no session
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
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const session = getSession()

  // ── Dialogs ────────────────────────────────────────────────────────────────
  const [clientOpen, setClientOpen] = useState(false)
  const [projectOpen, setProjectOpen] = useState(false)
  const [usersOpen, setUsersOpen] = useState(false)

  // ── Clients list (loaded when project dialog opens) ────────────────────────
  const [dbClients, setDbClients] = useState<{ id: number; firstName: string; lastName: string; phone: string }[]>([])

  // ── New Client form state ──────────────────────────────────────────────────
  const [clientFirstName, setClientFirstName] = useState('')
  const [clientLastName, setClientLastName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientPhone2, setClientPhone2] = useState('')
  const [clientError, setClientError] = useState('')

  // ── New Project form state ─────────────────────────────────────────────────
  const [projectName, setProjectName] = useState('')
  const [projectAddress, setProjectAddress] = useState('')
  const [comboOpen, setComboOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'sent' | 'done' | null>(null)
  const [selectedCity, setSelectedCity] = useState<'cairo' | 'alex' | 'giza' | null>(null)
  const [projectError, setProjectError] = useState('')

  // ── Manage Users form state ────────────────────────────────────────────────
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newDisplayName, setNewDisplayName] = useState('')
  const [newRole, setNewRole] = useState<Role>('employee')
  const [userError, setUserError] = useState('')
  const [users, setUsers] = useState(() => getAllUsers())

  const selectedClient = dbClients.find((c) => c.id === selectedClientId)

  const statuses = [
    { value: 'sent' as const, label: 'Sent' },
    { value: 'done' as const, label: 'Done' },
  ]

  const cities = [
    { value: 'cairo' as const, label: 'Cairo' },
    { value: 'alex' as const, label: 'Alexandria' },
    { value: 'giza' as const, label: 'Giza' },
  ]

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  async function handleOpenProjectDialog() {
    setProjectOpen(true)
    const clients = await $listClients()
    setDbClients(clients)
  }

  async function handleCreateClient(e: React.FormEvent) {
    e.preventDefault()
    setClientError('')
    try {
      await $createClient({
        data: {
          firstName: clientFirstName.trim(),
          lastName: clientLastName.trim(),
          phone: clientPhone.trim(),
          phone2: clientPhone2.trim() || null,
        },
      })
      setClientFirstName('')
      setClientLastName('')
      setClientPhone('')
      setClientPhone2('')
      setClientOpen(false)
      router.invalidate()
    } catch (err) {
      setClientError(err instanceof Error ? err.message : 'Failed to create client')
    }
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedClientId || !selectedCity) return
    setProjectError('')
    try {
      await $createProject({
        data: {
          clientId: selectedClientId,
          name: projectName.trim(),
          address: projectAddress.trim(),
          city: selectedCity,
          status: selectedStatus ?? 'sent',
        },
      })
      setProjectName('')
      setProjectAddress('')
      setSelectedClientId(null)
      setSelectedStatus(null)
      setSelectedCity(null)
      setProjectOpen(false)
      router.invalidate()
    } catch (err) {
      setProjectError(err instanceof Error ? err.message : 'Failed to create project')
    }
  }

  function handleAddUser(e: React.FormEvent) {
    e.preventDefault()
    setUserError('')
    const result = addUser(newUsername.trim(), newPassword, newRole, newDisplayName.trim())
    if (!result.ok) {
      setUserError(result.error)
      return
    }
    setNewUsername('')
    setNewPassword('')
    setNewDisplayName('')
    setNewRole('employee')
    setUsers(getAllUsers())
  }

  function handleDeleteUser(id: string) {
    deleteUser(id)
    setUsers(getAllUsers())
  }

  const isAdmin = session?.role === 'admin'

  // On the login page, render only the outlet (no header/shell)
  if (pathname === '/login') {
    return <Outlet />
  }

  return (
    <>
      <header className="flex items-center gap-3 border-b border-[var(--line)] bg-[var(--header-bg)] px-6 py-3 backdrop-blur">
        <Link to="/">
          <Button variant="ghost">Home</Button>
        </Link>
        <Link to="/clients">
          <Button variant="ghost">Clients</Button>
        </Link>

        <Button onClick={() => setClientOpen(true)}>New Client</Button>
        <Button onClick={handleOpenProjectDialog}>New Project</Button>

        {/* Admin-only: manage users */}
        {isAdmin && (
          <Button variant="outline" onClick={() => { setUsers(getAllUsers()); setUsersOpen(true) }}>
            <Users className="h-4 w-4 mr-1.5" />
            Manage Users
          </Button>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Current user + logout */}
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
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-1" />
          Logout
        </Button>
      </header>

      <Outlet />

      {/* ── New Client Dialog ─────────────────────────────────────────────── */}
      <Dialog open={clientOpen} onOpenChange={setClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateClient} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={clientFirstName}
                onChange={(e) => setClientFirstName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={clientLastName}
                onChange={(e) => setClientLastName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone2">Phone Number 2 <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="phone2"
                type="tel"
                placeholder="+1234567890"
                value={clientPhone2}
                onChange={(e) => setClientPhone2(e.target.value)}
              />
            </div>
            {clientError && <p className="text-xs text-destructive">{clientError}</p>}
            <Button type="submit" className="mt-2">Create Client</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── New Project Dialog ────────────────────────────────────────────── */}
      <Dialog open={projectOpen} onOpenChange={setProjectOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="e.g. Villa North Wing"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="e.g. 12 Nile St, Cairo"
                value={projectAddress}
                onChange={(e) => setProjectAddress(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label>Status</Label>
                <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={statusOpen}
                      className="w-full justify-between font-normal"
                    >
                      {selectedStatus
                        ? statuses.find((s) => s.value === selectedStatus)?.label
                        : 'Select status...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {statuses.map((s) => (
                            <CommandItem
                              key={s.value}
                              value={s.value}
                              onSelect={() => {
                                setSelectedStatus(s.value)
                                setStatusOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  selectedStatus === s.value ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              {s.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-1 flex-col gap-1.5">
                <Label>City</Label>
                <Popover open={cityOpen} onOpenChange={setCityOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={cityOpen}
                      className="w-full justify-between font-normal"
                    >
                      {selectedCity
                        ? cities.find((c) => c.value === selectedCity)?.label
                        : 'Select city...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-44 p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {cities.map((c) => (
                            <CommandItem
                              key={c.value}
                              value={c.value}
                              onSelect={() => {
                                setSelectedCity(c.value)
                                setCityOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  selectedCity === c.value ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              {c.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Assign to Client</Label>
              <Popover open={comboOpen} onOpenChange={setComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboOpen}
                    className="w-full justify-between font-normal"
                  >
                    {selectedClient
                      ? `${selectedClient.firstName} ${selectedClient.lastName} — ${selectedClient.phone}`
                      : 'Select a client...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search by name or phone..." />
                    <CommandList>
                      <CommandEmpty>No clients found.</CommandEmpty>
                      <CommandGroup>
                        {dbClients.map((c) => (
                          <CommandItem
                            key={c.id}
                            value={`${c.firstName} ${c.lastName} ${c.phone}`}
                            onSelect={() => {
                              setSelectedClientId(c.id)
                              setComboOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedClientId === c.id ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            <span className="font-medium">
                              {c.firstName} {c.lastName}
                            </span>
                            <span className="ml-auto text-xs text-muted-foreground">
                              {c.phone}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {projectError && <p className="text-xs text-destructive">{projectError}</p>}
            <Button type="submit" className="mt-2" disabled={!selectedClientId || !selectedCity}>
              Create Project
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Manage Users Dialog (admin only) ─────────────────────────────── */}
      <Dialog open={usersOpen} onOpenChange={setUsersOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Users</DialogTitle>
          </DialogHeader>

          {/* Existing users list */}
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-lg border border-[var(--line)] px-3 py-2 text-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{u.displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    @{u.username} · {u.role}
                  </span>
                </div>
                {u.id !== session?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteUser(u.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Add new user form */}
          <form onSubmit={handleAddUser} className="flex flex-col gap-3 pt-2 border-t border-[var(--line)]">
            <p className="text-sm font-medium">Add New User</p>
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-1">
                <Label htmlFor="newDisplayName" className="text-xs">Display Name</Label>
                <Input
                  id="newDisplayName"
                  placeholder="Full name"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Label htmlFor="newUsername" className="text-xs">Username</Label>
                <Input
                  id="newUsername"
                  placeholder="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-1">
                <Label htmlFor="newPassword" className="text-xs">Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Role</Label>
                <div className="flex gap-1">
                  {(['employee', 'admin'] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setNewRole(r)}
                      className="px-3 py-1.5 rounded text-xs font-medium border transition-colors"
                      style={{
                        background: newRole === r ? '#e8830a' : 'transparent',
                        color: newRole === r ? '#fff' : 'var(--sea-ink)',
                        borderColor: newRole === r ? '#e8830a' : 'var(--line)',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {userError && (
              <p className="text-xs text-destructive">{userError}</p>
            )}
            <Button type="submit" size="sm">Add User</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
