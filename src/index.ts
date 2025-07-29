import { handlerAggregator } from "./commands/aggregator";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerAddFeed, handlerFeeds, handlerFollow, handlerFollowing, handlerUnfollow } from "./commands/feeds";
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands/users";
import { middlewareLoggedIn } from "./lib/middlewareLogin";

function initCommandRegistry(): CommandsRegistry {
	const cmdRegistry: CommandsRegistry = {};
	registerCommand(cmdRegistry, 'login',handlerLogin);
	registerCommand(cmdRegistry, 'register', handlerRegister);
	registerCommand(cmdRegistry, 'reset', handlerReset);
	registerCommand(cmdRegistry, 'users', handlerUsers);
	registerCommand(cmdRegistry, 'agg', handlerAggregator);
	registerCommand(cmdRegistry, 'addfeed', middlewareLoggedIn(handlerAddFeed));
	registerCommand(cmdRegistry, 'feeds', handlerFeeds);
	registerCommand(cmdRegistry, 'follow',middlewareLoggedIn( handlerFollow));
	registerCommand(cmdRegistry, 'following', middlewareLoggedIn(handlerFollowing));
	registerCommand(cmdRegistry, 'unfollow', middlewareLoggedIn(handlerUnfollow));
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
