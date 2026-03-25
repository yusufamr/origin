import { createServerFn } from '@tanstack/react-start'
import {
  findUserByCredentials,
  findUserByUsername,
  listUsers,
  createUser,
  deleteUserById,
  countUsers,
} from '#/db/queries'
import type { SessionUser, Role } from '#/lib/auth'

export const $login = createServerFn({ method: 'POST' })
  .inputValidator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    // Auto-seed admin on very first run if the table is empty
    const [{ count }] = await countUsers()
    if (Number(count) === 0) {
      await createUser({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        displayName: 'Admin',
      })
    }

    const user = await findUserByCredentials(data.username, data.password)
    if (!user) return null

    return {
      id: String(user.id),
      username: user.username,
      role: user.role as Role,
      displayName: user.displayName,
    } satisfies SessionUser
  })

export const $listUsers = createServerFn().handler(async () => {
  return await listUsers()
})

export const $addUser = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { username: string; password: string; role: Role; displayName: string }) => data,
  )
  .handler(async ({ data }) => {
    const existing = await findUserByUsername(data.username)
    if (existing) throw new Error('Username already taken')
    const [user] = await createUser(data)
    return user
  })

export const $deleteUser = createServerFn({ method: 'POST' })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }) => {
    await deleteUserById(id)
  })
