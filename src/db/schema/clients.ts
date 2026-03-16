import { pgTable, serial, text, unique } from "drizzle-orm/pg-core";

export const clients = pgTable(
  "clients",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone").notNull(),
  },
  (t) => [unique().on(t.phone)]
);

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
