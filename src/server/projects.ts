import { createServerFn } from '@tanstack/react-start'
import { listProjects, getProjectById, createProject, getProjectStatsByUser, getProjectYears } from '#/db/queries'
import type { NewProject } from '#/db'

export const $listProjects = createServerFn().handler(async () => {
  return await listProjects()
})

export const $getProjectById = createServerFn()
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }) => {
    return await getProjectById(id)
  })

export const $getProjectStats = createServerFn()
  .inputValidator((data: { year: number; month: number | null; status: 'sent' | 'done' | null }) => data)
  .handler(async ({ data }) => {
    const [stats, years] = await Promise.all([
      getProjectStatsByUser(data.year, data.month, data.status),
      getProjectYears(),
    ])
    return { stats, years: years.map((r) => r.year) }
  })

export const $createProject = createServerFn({ method: 'POST' })
  .inputValidator((data: Pick<NewProject, 'clientId' | 'userId' | 'name' | 'address' | 'city' | 'status'>) => data)
  .handler(async ({ data }) => {
    const [project] = await createProject(data)
    return project
  })
