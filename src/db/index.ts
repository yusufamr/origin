import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as users from "./schema/users";
import * as projects from "./schema/projects";
import * as windows from "./schema/windows";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema: { ...users, ...projects, ...windows } });

export * from "./schema/users";
export * from "./schema/projects";
export * from "./schema/windows";