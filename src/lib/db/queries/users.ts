import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export type User = typeof users.$inferSelect;

export async function createUser(name: string) {
	const [result] = await db.insert(users).values({ name: name }).returning();
	return result;
}

export async function getUser(name: string) {
	const result = await db.select().from(users).where(eq(users.name, name));
	if (result.length === 0) return;
	return result[0];
}

export async function getUserById(userId: string) {
	const [result] = await db.select().from(users).where(eq(users.id, userId));
	return result;
}

export async function getUsers() {
	return await db.select().from(users);
}

export async function resetUsers() {
	await db.delete(users);
}
