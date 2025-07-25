import { readConfig } from "src/config";
import { createFeed, Feed, getFeeds } from "src/lib/db/queries/feeds";
import { getUser, getUserById, User } from "src/lib/db/queries/users";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
	if (!args || args.length !== 2) {
		throw new Error(`usage: ${cmdName} <feedName> <url>`);
	}
	const username = readConfig().currentUserName;
	const user = await getUser(username);
	const feedName = args[0];
	const url = args[1];
	const feed = await createFeed(user.id, feedName, url);
	if (!feed) {
		throw new Error(`Failed to create feed`);
	}
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

export async function handlerFollow(cmdName: string, ...args: string[]) {
	if (!args || args.length !== 1) {
		throw new Error(`usage: ${cmdName} <url>`);
	}

}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
	if (!args || args.length !== 1) {
		throw new Error(`usage: ${cmdName} <url>`);
	}

}

function printFeed(feed: Feed, user: User) {
	console.log(`* ID:            ${feed.id}`);
	console.log(`* Created:       ${feed.createdAt}`);
	console.log(`* Updated:       ${feed.updatedAt}`);
	console.log(`* name:          ${feed.name}`);
	console.log(`* URL:           ${feed.url}`);
	console.log(`* User:          ${user.name}`);
}
