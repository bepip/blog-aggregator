import { CommandHandler, UserCommandHandler } from "src/commands/commands";
import { getUser, User } from "./db/queries/users";
import { readConfig } from "src/config";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
	return async (cmdName: string, ...args: string[]): Promise<void> => {
		const config = readConfig();
		const username = config.currentUserName;
		if (!username) {
			throw new Error(`User not logged in`);
		}
		const user = await getUser(username);
		if (!user) {
			throw new Error(`User ${username} not found`);
		}
		await handler(cmdName, user, ...args);
	};
}
