import { User } from "src/lib/db/queries/users";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
	registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
	if (cmdName in registry) {
		await registry[cmdName](cmdName, ...args);
	} else {
		throw new Error(`Unknown command: ${cmdName}`);
	}
}

export type UserCommandHandler = (
	cmdName: string,
	user: User,
	...args: string[]
) => Promise<void> | void;
