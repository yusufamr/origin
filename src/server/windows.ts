import { createServerFn } from '@tanstack/react-start'
import { listWindowsByProject, createWindow } from '#/db/queries'
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
