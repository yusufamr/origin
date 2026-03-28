import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'
import type { Role } from '#/lib/auth'
import { $listUsers, $addUser, $deleteUser, $changeUserPassword } from '#/server/auth'

type UserRow = { id: number; username: string; role: string; displayName: string }

interface ManageUsersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId: string | undefined
}

export function ManageUsersDialog({
  open,
  onOpenChange,
  currentUserId,
}: ManageUsersDialogProps) {
  const [users, setUsers] = useState<UserRow[]>([])
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('employee')
  const [error, setError] = useState('')
  const [changingPasswordId, setChangingPasswordId] = useState<number | null>(null)
  const [newPassword, setNewPassword] = useState('')

  // Fetch users whenever the dialog opens
  useEffect(() => {
    if (open) {
      $listUsers().then(setUsers)
    }
  }, [open])

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await $addUser({ data: { username: username.trim(), password, role, displayName: displayName.trim() } })
      setDisplayName('')
      setUsername('')
      setPassword('')
      setRole('employee')
      const data = await $listUsers()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user')
    }
  }

  async function handleDeleteUser(id: number) {
    await $deleteUser({ data: id })
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  async function handleChangePassword(id: number) {
    if (!newPassword) return
    await $changeUserPassword({ data: { id, password: newPassword } })
    setChangingPasswordId(null)
    setNewPassword('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Users</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex flex-col rounded-lg border border-[var(--line)] px-3 py-2 text-sm gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">{u.displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    @{u.username} · {u.role}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setChangingPasswordId(changingPasswordId === u.id ? null : u.id)
                      setNewPassword('')
                    }}
                  >
                    Change Password
                  </Button>
                  {String(u.id) !== currentUserId && (
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
              </div>
              {changingPasswordId === u.id && (
                <div className="flex gap-2 items-center">
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-7 text-xs"
                  />
                  <Button size="sm" className="h-7 text-xs" onClick={() => handleChangePassword(u.id)}>
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setChangingPasswordId(null); setNewPassword('') }}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleAddUser}
          className="flex flex-col gap-3 pt-2 border-t border-[var(--line)]"
        >
          <p className="text-sm font-medium">Add New User</p>
          <div className="flex gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <Label htmlFor="newDisplayName" className="text-xs">Display Name</Label>
              <Input
                id="newDisplayName"
                placeholder="Full name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Label htmlFor="newUsername" className="text-xs">Username</Label>
              <Input
                id="newUsername"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                    onClick={() => setRole(r)}
                    className="px-3 py-1.5 rounded text-xs font-medium border transition-colors"
                    style={{
                      background: role === r ? '#e8830a' : 'transparent',
                      color: role === r ? '#fff' : 'var(--sea-ink)',
                      borderColor: role === r ? '#e8830a' : 'var(--line)',
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" size="sm">Add User</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
