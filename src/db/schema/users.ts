import { pgTable, serial, text, pgEnum } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['admin', 'employee'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: userRoleEnum('role').notNull().default('employee'),
  displayName: text('display_name').notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
