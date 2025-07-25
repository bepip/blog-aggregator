import { readConfig, setUser } from "src/config.js";
import { createUser, getUser, getUsers, resetUsers } from "src/lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
	if (!args || args.length !== 1) {
		throw new Error(`usage: ${cmdName} <name>`);
	}
	const user = await getUser(args[0]);
	if (!user) {
		throw new Error(`User ${args[0]} not found`);
	}
	setUser(user.name);
	console.log(`User ${args[0]} has logged in`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
	if (!args || args.length !== 1) {
		throw new Error(`usage: ${cmdName} <name>`);
	}
	try {
		const createdUser = await createUser(args[0]);
		setUser(createdUser.name);
		console.log(`User ${createdUser.name} has been created.`);
	} catch (err) {
		throw new Error(`User ${args[0]} not found`);
	}
}

export async function handlerReset(cmdName: string, ...args: string[]) {
	if (!args || args.length !== 0) {
		throw new Error(`usage: ${cmdName} <name>`);
	}
	try {
		await resetUsers();
		console.log('sucessfully reset users table');
	} catch (err) {
		throw new Error(`Failed to reset users table`);
	}
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
	if (!args || args.length !== 0) {
		throw new Error(`usage: ${cmdName} <name>`);
	}
	try {
		const users = await getUsers();
		const currentUser = readConfig().currentUserName;
		users.map((user) => console.log(`* ${user.name === currentUser ? `${user.name} (current)` : user.name}`));
	} catch (err) {
		throw new Error(`Failed to fetch users`);
	}
}
