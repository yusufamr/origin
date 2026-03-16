import { createServerFn } from '@tanstack/react-start'
import { listProjects, getProjectById, createProject } from '#/db/queries'
import type { NewProject } from '#/db'

export const $listProjects = createServerFn().handler(async () => {
  return await listProjects()
})

export const $getProjectById = createServerFn()
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }) => {
    return await getProjectById(id)
  })

export const $createProject = createServerFn({ method: 'POST' })
  .inputValidator((data: Pick<NewProject, 'userId' | 'name' | 'address' | 'city' | 'status'>) => data)
  .handler(async ({ data }) => {
    const [project] = await createProject(data)
    return project
  })
