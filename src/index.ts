import { handlerAggregator } from "./commands/aggregator";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerAddFeed, handlerFeeds } from "./commands/feeds";
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands/users";

function initCommandRegistry(): CommandsRegistry {
	const cmdRegistry: CommandsRegistry = {};
	registerCommand(cmdRegistry, 'login', handlerLogin);
	registerCommand(cmdRegistry, 'register', handlerRegister);
	registerCommand(cmdRegistry, 'reset', handlerReset);
	registerCommand(cmdRegistry, 'users', handlerUsers);
	registerCommand(cmdRegistry, 'agg', handlerAggregator);
	registerCommand(cmdRegistry, 'addfeed', handlerAddFeed);
	registerCommand(cmdRegistry, 'feeds', handlerFeeds);
	registerCommand(cmdRegistry, 'follow', handlerFollow);
	registerCommand(cmdRegistry, 'following', handlerFollowing);
	return cmdRegistry;
}

async function main() {
	const cmdRegistry = initCommandRegistry();
	const argv = process.argv.slice(2);
	if (argv.length === 0) {
		console.log("usage: cli <command> [args...]");
		process.exit(1);
	}
	const [cmdName, ...args] = argv;
	try {
		await runCommand(cmdRegistry, cmdName, ...args);
	} catch (err) {
		console.log(`Error: ${(err as Error).message}`);
		process.exit(1);
	}
	process.exit(0);
}

await main();
