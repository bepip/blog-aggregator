import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feed_follows, feeds, users } from "../schema";
import { getFeedsFromUrl } from "./feeds";

export async function createFeedFollow(userId: string, feedId: string) {
	const [result] = await db.insert(feed_follows).values({
		user_id: userId,
		feed_id: feedId
	}).returning();
	if (!result) {
		throw new Error(`failed to create new feed follow`);
	}
	const res = await db.select({
		id: feed_follows.id,
		createdAt: feed_follows.createdAt,
		updatedAt: feed_follows.updatedAt,
		feedName: feeds.name,
		userName: users.name,
	})
		.from(feed_follows)
		.innerJoin(users, eq(feed_follows.user_id, users.id))
		.innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
		.where(eq(feed_follows.id, result.id));
	if (res.length === 0) return;
	return res[0];
}

export async function getFeedFollowsForUser(userId: string) {
	const result = await db.select({
		id: feed_follows.id,
		createdAt: feed_follows.createdAt,
		updatedAt: feed_follows.updatedAt,
		feedName: feeds.name,
		userName: users.name,
	}).from(feed_follows)
		.innerJoin(users, eq(feed_follows.user_id, users.id))
		.innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
		.where(eq(feed_follows.user_id, userId));
	return result;
}

export async function deleteFeedFollow(userId: string, feedId: string) {
	const result = await db.delete(feed_follows)
		.where(and(eq(feed_follows.user_id, userId), eq(feed_follows.feed_id, feedId))).returning();
	return result;
}
