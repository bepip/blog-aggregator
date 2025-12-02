import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
	dbUrl: string,
	currentUserName: string
};

export function setUser(userName: string) {
	const config = readConfig();
	config.currentUserName = userName;
	writeConfig(config);
}

export function readConfig(): Config {
	const filePath = getConfigFilePath();
	const rawConfig = fs.readFileSync(filePath, "utf8");
	return validateConfig(JSON.parse(rawConfig));
}

function getConfigFilePath(): string {
	const configName = ".gatorconfig.json";
	return path.join(os.homedir(), configName);
}

function writeConfig(cfg: Config): void {
	const fullPath = getConfigFilePath();
	const rawConfig = {
		db_url: cfg.dbUrl,
		current_user_name: cfg.currentUserName
	}

	const data = JSON.stringify(rawConfig);
	fs.writeFileSync(fullPath, data, {encoding: "utf8"});
}

function validateConfig(rawConfig: any): Config {
	if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
		throw new Error("missing db url in config");
	}
	if (rawConfig.current_user_name && typeof rawConfig.current_user_name !== "string") {
		throw new Error("current username must be a string in config");
	}
	return {
		dbUrl: rawConfig.db_url,
		currentUserName: rawConfig.current_user_name || ""
	}
}
