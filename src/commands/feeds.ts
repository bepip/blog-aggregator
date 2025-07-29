import { readConfig } from "src/config";
import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feed_follows";
import { createFeed, Feed, getFeeds, getFeedsFromUrl } from "src/lib/db/queries/feeds";
import { getUser, getUserById, User } from "src/lib/db/queries/users";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
	if (!args || args.length !== 2) {
		throw new Error(`usage: ${cmdName} <feedName> <url>`);
	}
	const feedName = args[0];
	const url = args[1];
	const feed = await createFeed(user.id, feedName, url);
	if (!feed) {
		throw new Error(`Failed to create feed`);
	}
	await createFeedFollow(user.id, feed.id);
	printFeed(feed, user);
}

export async function handlerFeeds() {
	const feeds = await getFeeds();
	for (const feed of feeds) {
		const user = await getUserById(feed.user_id);
		console.log(`${feed.name}`);
		console.log(`${feed.url}`);
		console.log(`${user.name}`);
		console.log();
	}

}

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
	if (!args || args.length !== 1) {
		throw new Error(`usage: ${cmdName} <feed_url>`);
	}
	const url = args[0];
	const feed = await getFeedsFromUrl(url);
	if (!feed) {
		throw new Error(`Feed not found ${url}`);
	}
	const res = await createFeedFollow(user.id, feed.id);
	if (!res) {
		throw new Error(`Failed to create follow feed`);
	}
	console.log(`* User:          ${user.name}`);
	console.log(`* Feed:          ${feed.name}`);
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
	if (args && args.length > 0) {
		throw new Error(`usage: ${cmdName}`);
	}
	const followedFeeds = await getFeedFollowsForUser(user.id);
	if (followedFeeds.length === 0) {
		console.log(`${user.name} does not follow any feed`);
		return;
	}
	console.log(`${user.name} follows: `);
	for (const feed of followedFeeds) {
		console.log(`*     ${feed.feedName}`);
	}
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]
) {
	if (args && args.length !== 1) {
		throw new Error(`usage: ${cmdName} <feed_url>`);
	}

	const feedURL = args[0];
	const feed = await getFeedsFromUrl(feedURL);
	if (!feed) {
		throw new Error(`Feed not found for url: ${feedURL}`);
	}

	const result = await deleteFeedFollow(user.id, feed.id);
	if (!result) {
		throw new Error(`Failed to unfollow feed: ${feedURL}`);
	}

	console.log(`%s unfollowed successfully!`, feed.name);
}

function printFeed(feed: Feed, user: User) {
	console.log(`* ID:            ${feed.id}`);
	console.log(`* Created:       ${feed.createdAt}`);
	console.log(`* Updated:       ${feed.updatedAt}`);
	console.log(`* name:          ${feed.name}`);
	console.log(`* URL:           ${feed.url}`);
	console.log(`* User:          ${user.name}`);
}
