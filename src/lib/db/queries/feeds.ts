import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";

export type Feed = typeof feeds.$inferSelect;

export async function createFeed(userId: string, feedName: string, url: string) {
	const [result] = await db.insert(feeds).values({
		name: feedName,
		url: url,
		user_id: userId
	}).returning();
	return result;
}

export async function getFeedsFromUserId(userId: string) {
	const result = await db.select().from(feeds).where(eq(feeds.user_id, userId));
	if (result.length === 1) return result[0];
	return result;
}

export async function getFeedsFromName(name: string) {
	const result = await db.select().from(feeds).where(eq(feeds.name, name));
	if (result.length === 1) return result[0];
	return result;
}

export async function getFeeds() {
	return await db.select().from(feeds);
}

export async function resetFeeds() {
	await db.delete(feeds);
}
