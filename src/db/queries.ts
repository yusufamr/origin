import { eq, count, and } from "drizzle-orm";
import { db } from ".";
import { clients, projects, windows, users } from ".";
import type { NewClient, NewProject, NewWindow, NewUser } from ".";

// ── Clients ─────────────────────────────────────────────────────────────────

export function findClientByPhone(phone: string) {
  return db.query.clients.findFirst({
    where: eq(clients.phone, phone),
  });
}

export function listClients() {
  return db.query.clients.findMany();
}

export function createClient(data: NewClient) {
  return db.insert(clients).values(data).returning();
}

// ── Projects ───────────────────────────────────────────────────────────────

export function listProjects() {
  return db
    .select({
      id: projects.id,
      name: projects.name,
      address: projects.address,
      city: projects.city,
      status: projects.status,
      createdAt: projects.createdAt,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      clientPhone: clients.phone,
      clientPhone2: clients.phone2,
      windowCount: count(windows.id),
      createdBy: users.displayName,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(windows, eq(windows.projectId, projects.id))
    .leftJoin(users, eq(projects.userId, users.id))
    .groupBy(projects.id, clients.id, users.id);
}

export function getProjectById(id: number) {
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
  });
}

export function listProjectsByClient(clientId: number) {
  return db.query.projects.findMany({
    where: eq(projects.clientId, clientId),
  });
}

export function createProject(data: NewProject) {
  return db.insert(projects).values(data).returning();
}

// ── Users ──────────────────────────────────────────────────────────────────

export function findUserByCredentials(username: string, password: string) {
  return db.query.users.findFirst({
    where: and(eq(users.username, username), eq(users.password, password)),
  })
}

export function findUserByUsername(username: string) {
  return db.query.users.findFirst({
    where: eq(users.username, username),
  })
}

export function listUsers() {
  return db.select({ id: users.id, username: users.username, role: users.role, displayName: users.displayName })
    .from(users)
}

export function createUser(data: NewUser) {
  return db.insert(users).values(data).returning()
}

export function deleteUserById(id: number) {
  return db.delete(users).where(eq(users.id, id))
}

export function countUsers() {
  return db.select({ count: count() }).from(users)
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
