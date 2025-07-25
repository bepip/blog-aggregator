import { fetchFeed, RSSFeed } from "src/lib/rss";

export async function handlerAggregator(cmdName: string, ...args: string[]) {
//	if (!args || args.length !== 1) {
//		throw new Error(`usage: ${cmdName} <name>`);
//	}
	//const arg = args[0];
	const arg = 'https:www.wagslane.dev/index.xml';
	const feed: RSSFeed = await fetchFeed(arg);
	console.log(JSON.stringify(feed),null, 2);
}
