import { createServerFn } from '@tanstack/react-start'
import { listClients, findClientByPhone, createClient } from '#/db/queries'
import type { NewClient } from '#/db'

export const $listClients = createServerFn().handler(async () => {
  return await listClients()
})

export const $findClientByPhone = createServerFn()
  .inputValidator((phone: string) => phone)
  .handler(async ({ data: phone }) => {
    return await findClientByPhone(phone)
  })

export const $createClient = createServerFn({ method: 'POST' })
  .inputValidator((data: Pick<NewClient, 'firstName' | 'lastName' | 'phone'>) => data)
  .handler(async ({ data }) => {
    const [client] = await createClient(data)
    return client
  })
