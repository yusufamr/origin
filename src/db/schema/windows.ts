import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const windows = pgTable("windows", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),

  type: text("type").notNull(),
  subtype: text("subtype").notNull(),
  category: text("category").notNull(),
  image: text("image"),

  width: numeric("width", { precision: 10, scale: 2 }).notNull(),
  accurateHeight: numeric("accurate_height", { precision: 10, scale: 2 }).notNull(),
  totalHeight: numeric("total_height", { precision: 10, scale: 2 }).notNull(),
  totalArea: numeric("total_area", { precision: 10, scale: 2 }).notNull(),
  count: integer("count").notNull(),

  color: text("color").notNull(),
  glass: text("glass").notNull(),
  glassColor: text("glass_color").notNull(),
  wire: boolean("wire").notNull().default(false),
  materialType: text("material_type").notNull(),

  meterPrice: numeric("meter_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
});

export type Window = typeof windows.$inferSelect;
export type NewWindow = typeof windows.$inferInsert;
