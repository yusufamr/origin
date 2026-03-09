import { createServerFn } from '@tanstack/react-start'
import { listUsers, findUserByPhone, createUser } from '#/db/queries'
import type { NewUser } from '#/db'

export const $listUsers = createServerFn().handler(async () => {
  return await listUsers()
})

export const $findUserByPhone = createServerFn()
  .inputValidator((phone: string) => phone)
  .handler(async ({ data: phone }) => {
    return await findUserByPhone(phone)
  })

export const $createUser = createServerFn({ method: 'POST' })
  .inputValidator((data: Pick<NewUser, 'firstName' | 'lastName' | 'phone'>) => data)
  .handler(async ({ data }) => {
    const [user] = await createUser(data)
    return user
  })
