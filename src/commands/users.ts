import { readConfig, setUser } from "src/config";
import { createUser, getUserByName, getUsers } from "src/lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
	if (args.length !== 1) {
		throw new Error(`usage: ${cmdName} <name>`);
	}

	const userName = args[0];
	const existingUser = await getUserByName(userName);
	if (!existingUser) {
		throw new Error(`User ${userName} not found`);
	}

	setUser(existingUser.name);
	console.log("User switched successfully!");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
	if (args.length != 1) {
		throw new Error(`usage: ${cmdName} <name>`);
	}

	const userName = args[0];
	const user = await createUser(userName);
	if (!user) {
		throw new Error(`User ${userName} not found`);
	}

	setUser(user.name);
	console.log("User created successfully!");
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
	const users = await getUsers();
	const currentUser = readConfig().currentUserName;
	users.forEach( (user) => {
		console.log(`\t* ${user.name}`, user.name === currentUser ? "(current)": "");
	});
}
