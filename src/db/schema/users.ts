import { pgTable, serial, text, unique } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone").notNull(),
  },
  (t) => [unique().on(t.phone)]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
