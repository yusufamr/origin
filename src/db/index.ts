import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as clients from "./schema/clients";
import * as projects from "./schema/projects";
import * as windows from "./schema/windows";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema: { ...clients, ...projects, ...windows } });

export * from "./schema/clients";
export * from "./schema/projects";
export * from "./schema/windows";
