import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
	channel: {
		title: string;
		link: string;
		description: string;
		item: RSSItem[];
	};
};

export type RSSItem = {
	title: string;
	link: string;
	description: string;
	pubDate: string;
};

export async function fetchFeed(feedURL: string) {
	try {
		const response = await fetch(feedURL, {
			method: 'GET',
			headers: {
				'User-Agent': 'gator',
				accept: "application/rss+xml"
			}
		});
		if (!response.ok) {
			throw new Error(`${response.status} ${response.statusText}`);
		}
		const rawData = await response.text();
		const parser = new XMLParser();
		const feedObject = parser.parse(rawData);
		if ('rss' in feedObject === false) {
			throw new Error(`rss not in parsed object`);
		}
		const rssObject = feedObject.rss;
		if ('channel' in rssObject === false) {
			throw new Error(`channel not in parsed object`);
		}
		return validateRSSFeed(rssObject.channel);
	} catch (err) {
		throw new Error(`failed to fetch ${feedURL}, ${(err as Error).message}`);
	}
}

function validateRSSFeed(raw: any): RSSFeed {
	if (typeof raw !== 'object' || raw === null) {
		throw new Error(`data not an object`);
	}
	if (!raw.title || typeof raw.title !== 'string') {
		throw new Error(`title is required in RSSFeed`);
	}
	if (!raw.link || typeof raw.link !== 'string') {
		throw new Error(`link is required in RSSFeed`);
	}
	if (!raw.description || typeof raw.description !== 'string') {
		throw new Error(`description is required in RSSFeed`);
	}

	if ((raw.item && !Array.isArray(raw.item))) {
		return {
			channel: {
				title: raw.title,
				link: raw.link,
				description: raw.link,
				item: []
			}
		};
	}

	const items: RSSItem[] = [];
	for (const item of raw.item) {
		const validatedItem = validateItem(item);
		if (!validatedItem) {
			continue;
		}
		items.push(validatedItem);
	}
	return {
		channel: {
			title: raw.title,
			link: raw.link,
			description: raw.link,
			item: items
		}
	};

}

function validateItem(item: any): RSSItem | null {
	if (!item.title || typeof item.title !== 'string') {
		return null;
	}
	if (!item.link || typeof item.link !== 'string') {
		return null;
	}
	if (!item.description || typeof item.description !== 'string') {
		return null;
	}
	if (!item.pubDate || typeof item.pubDate !== 'string') {
		return null;
	}
	return {
		title: item.title,
		link: item.line,
		description: item.description,
		pubDate: item.pubdate
	};
}
