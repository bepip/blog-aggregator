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

export function parseDuration(durationStr: string) {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) return;

  if (match.length !== 3) return;

  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      return;
  }
}
