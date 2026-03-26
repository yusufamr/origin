import { createServerFn } from '@tanstack/react-start'
import { listWindowsByProject, createWindow, updateWindow, deleteWindow } from '#/db/queries'
import type { NewWindow } from '#/db'

export const $listWindowsByProject = createServerFn()
  .inputValidator((projectId: number) => projectId)
  .handler(async ({ data: projectId }) => {
    return await listWindowsByProject(projectId)
  })

export const $createWindow = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<NewWindow, 'id'>) => data)
  .handler(async ({ data }) => {
    const [window] = await createWindow(data)
    return window
  })

export const $updateWindow = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: number } & Partial<Omit<NewWindow, 'id' | 'projectId'>>) => data)
  .handler(async ({ data: { id, ...fields } }) => {
    const [window] = await updateWindow(id, fields)
    return window
  })

export const $deleteWindow = createServerFn({ method: 'POST' })
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }) => {
    await deleteWindow(id)
  })
