import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerLogin } from "./commands/users";

function initCommandRegistry(): CommandsRegistry {
	const cmdRegistry: CommandsRegistry = {};
	registerCommand(cmdRegistry, 'login', handlerLogin);
	return cmdRegistry;
}

function main() {
	const cmdRegistry = initCommandRegistry();
	const argv = process.argv.slice(2);
	if (argv.length === 0) {
		console.log("usage: cli <command> [args...]");
		process.exit(1);
	}
	const [cmdName, ...args] = argv;
	try {
		runCommand(cmdRegistry, cmdName, ...args);
	} catch (err) {
		console.log(`Error: ${(err as Error).message}`);
		process.exit(1);
	}
}

main();
