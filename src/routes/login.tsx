import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { login } from '#/lib/auth'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const user = login(username.trim(), password)
    setLoading(false)
    if (!user) {
      setError('Invalid username or password')
      return
    }
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="island-shell rounded-2xl p-10 w-full max-w-sm flex flex-col items-center gap-6"
        style={{ border: '1.5px solid rgba(0,0,0,0.1)' }}
      >
        {/* Logo */}
        <img
          src="/images/origin-logo.png"
          alt="Origin UPVC"
          className="h-20 w-auto object-contain"
        />

        {/* Heading */}
        <div className="text-center">
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: 'var(--sea-ink)' }}
          >
            Welcome to <span style={{ color: '#e8830a' }}>ORIGIN UPVC</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: 'var(--destructive)' }}>
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="mt-1 w-full"
            disabled={loading || !username || !password}
            style={{ backgroundColor: '#e8830a', color: '#fff' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
