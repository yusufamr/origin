export type Role = 'admin' | 'employee'

export interface SessionUser {
  id: string
  username: string
  role: Role
  displayName: string
}

const SESSION_KEY = 'origin_session'

export function saveSession(user: SessionUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
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
