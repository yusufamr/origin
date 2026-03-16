import { eq, count } from "drizzle-orm";
import { db } from ".";
import { clients, projects, windows } from ".";
import type { NewClient, NewProject, NewWindow } from ".";

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
      createdAt: projects.createdAt,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      clientPhone: clients.phone,
      clientPhone2: clients.phone2,
      windowCount: count(windows.id),
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(windows, eq(windows.projectId, projects.id))
    .groupBy(projects.id, clients.id);
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

// ── Windows ────────────────────────────────────────────────────────────────

export function listWindowsByProject(projectId: number) {
  return db.query.windows.findMany({
    where: eq(windows.projectId, projectId),
  });
}

export function createWindow(data: NewWindow) {
  return db.insert(windows).values(data).returning();
}
