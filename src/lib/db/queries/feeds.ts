import { db } from "..";
import { feeds } from "../schema";
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
