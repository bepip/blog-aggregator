import { XMLParser } from "fast-xml-parser";
import { contains, isItem } from "./utils";

export type RSSItem = {
	title: string,
	link: string,
	description: string,
	pubDate: string
}

export type RSSFeed = {
	channel: {
		title: string,
		link: string,
		description: string,
		item: RSSItem[],
	};
};

export async function fetchFeed(feedURL: string) {
	const data = await fetchData(feedURL);
	const parser = new XMLParser();
	const obj = parser.parse(data);
	if (!contains(obj.rss, "channel")) {
		throw new Error("Channel field missing");
	}
	const channel = obj.rss.channel;
	const title = channel.title;
	const link = channel.link;
	const description = channel.description;
	const items = channel.item;

	if (!title || typeof title !== "string") {
		throw new Error("title missing in channel");
	}
	if (!link || typeof link !== "string") {
		throw new Error("link missing in channel");
	}
	if (!description || typeof description !== "string") {
		throw new Error("description missing in channel");
	}
	const feed: RSSFeed = {
		channel: {
			title: title,
			link: link,
			description: description,
			item: []
		}
	}

	if (Array.isArray(items)) {

		const itemArr: RSSItem[] = [];

		for (let item of items) {
			if (isItem(item)) {
				itemArr.push({
					title: item.title,
					description: item.description,
					link: item.link,
					pubDate: item.pubDate
				});
			}
		}
		feed.channel.item = itemArr;
	}
	return feed;

}

async function fetchData(url: string) {
	const res = await fetch(url, {
		method: "GET",
		headers: {
			"User-Agent": "gator",
			accept: "application/rss+xml"
		}
	});
	if (!res.ok) {
		throw new Error(`failed to fetch feed: ${res.status} ${res.statusText}`);
	}
	return res.text();
}
