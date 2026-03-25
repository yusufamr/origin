import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { users } from "./users";

export const projectStatusEnum = pgEnum("project_status", ["sent", "done"]);
export const projectCityEnum = pgEnum("project_city", ["cairo", "alex", "giza"]);

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  address: text("address").notNull(),
  status: projectStatusEnum("status").notNull().default("sent"),
  city: projectCityEnum("city").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
