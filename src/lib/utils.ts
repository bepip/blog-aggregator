export function contains(obj: any, key: string) {
	if (!obj || !key) {
		return false;
	}
	return key in obj;
}

export function isItem(obj: any) {
	return contains(obj, "link") &&
		contains(obj, "title") &&
		contains(obj, "description") &&
		contains(obj, "pubDate");
}
