import { Feed, fetchFeed } from "src/lib/rss";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
	const feedUrl = "https://www.wagslane.dev/index.xml";
	const feed: Feed = await fetchFeed(feedUrl);
	const feedStr = JSON.stringify(feed, null, 2);
	console.log(feedStr);
}
