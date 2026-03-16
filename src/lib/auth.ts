export type Role = 'admin' | 'employee'

export interface SessionUser {
  id: string
  username: string
  role: Role
  displayName: string
}

interface StoredUser {
  id: string
  username: string
  password: string
  role: Role
  displayName: string
}

const USERS_KEY = 'origin_users'
const SESSION_KEY = 'origin_session'

// Initial seed — admin account created on first run
const SEED_USERS: StoredUser[] = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin', displayName: 'Admin' },
]

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return SEED_USERS
  const stored = localStorage.getItem(USERS_KEY)
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS))
    return SEED_USERS
  }
  return JSON.parse(stored) as StoredUser[]
}

export function login(username: string, password: string): SessionUser | null {
  const users = getStoredUsers()
  const user = users.find((u) => u.username === username && u.password === password)
  if (!user) return null
  const session: SessionUser = {
    id: user.id,
    username: user.username,
    role: user.role,
    displayName: user.displayName,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): SessionUser | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(SESSION_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as SessionUser
  } catch {
    return null
  }
}

export function getAllUsers(): StoredUser[] {
  return getStoredUsers()
}

export function addUser(
  username: string,
  password: string,
  role: Role,
  displayName: string,
): { ok: true } | { ok: false; error: string } {
  const users = getStoredUsers()
  if (users.find((u) => u.username === username)) {
    return { ok: false, error: 'Username already taken' }
  }
  users.push({ id: Date.now().toString(), username, password, role, displayName })
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return { ok: true }
}

export function deleteUser(id: string): void {
  const session = getSession()
  if (session?.id === id) return // cannot delete yourself
  const users = getStoredUsers().filter((u) => u.id !== id)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}
