import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(
	feedName: string,
	url: string,
	userId: string
) {
	const res = await db.insert(feeds).values({
		name: feedName,
		url,
		userId
	}).returning();

	return firstOrUndefined(res);
}

export async function getFeeds() {
	return await db.select().from(feeds)
}

export async function getFeedByUrl(url: string) {
	const result = await db.select().from(feeds).where(eq(feeds.url, url));
	return firstOrUndefined(result);
}
