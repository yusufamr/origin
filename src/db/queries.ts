import { eq, count } from "drizzle-orm";
import { db } from ".";
import { users, projects, windows } from ".";
import type { NewUser, NewProject, NewWindow } from ".";

// ── Users ──────────────────────────────────────────────────────────────────

export function findUserByPhone(phone: string) {
  return db.query.users.findFirst({
    where: eq(users.phone, phone),
  });
}

export function listUsers() {
  return db.query.users.findMany();
}

export function createUser(data: NewUser) {
  return db.insert(users).values(data).returning();
}

// ── Projects ───────────────────────────────────────────────────────────────

export function listProjects() {
  return db
    .select({
      id: projects.id,
      name: projects.name,
      address: projects.address,
      createdAt: projects.createdAt,
      userFirstName: users.firstName,
      userLastName: users.lastName,
      userPhone: users.phone,
      windowCount: count(windows.id),
    })
    .from(projects)
    .leftJoin(users, eq(projects.userId, users.id))
    .leftJoin(windows, eq(windows.projectId, projects.id))
    .groupBy(projects.id, users.id);
}

export function getProjectById(id: number) {
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
  });
}

export function listProjectsByUser(userId: number) {
  return db.query.projects.findMany({
    where: eq(projects.userId, userId),
  });
}

export function createProject(data: NewProject) {
  return db.insert(projects).values(data).returning();
}

// ── Windows ────────────────────────────────────────────────────────────────

export function listWindowsByProject(projectId: number) {
  return db.query.windows.findMany({
    where: eq(windows.projectId, projectId),
  });
}

export function createWindow(data: NewWindow) {
  return db.insert(windows).values(data).returning();
}
