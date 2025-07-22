import { readConfig, setUser } from "./config";

function main() {
	try {
		setUser('bepip');
		const cfg = readConfig();
		console.log(cfg);
	} catch (err) {
		console.log((err as Error).message);
	}
}

main();
