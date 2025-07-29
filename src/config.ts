import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
	dbUrl: string,
	currentUserName: string,
};

export function setUser(username: string) {
	const cfg = readConfig();
	cfg.currentUserName = username;
	writeConifg(cfg);
};

export function readConfig(): Config {
	const configPath = getConfigFilePath();
	const raw = fs.readFileSync(configPath, 'utf8');
	return validateConfig(JSON.parse(raw));
};

export function getUser(): string {
	return readConfig().currentUserName;
}

function getConfigFilePath(): string {
	return path.join(os.homedir() + '/.gatorconfig.json');
};

function writeConifg(cfg: Config): void {
	const filePath = getConfigFilePath();
	const rawConfig = {
		"db_url": cfg.dbUrl,
		"current_user_name": cfg.currentUserName,
	}
	const data = JSON.stringify(rawConfig, null, 2);
	fs.writeFileSync(filePath, data, { encoding: "utf-8" });
};

function validateConfig(rawConfig: any): Config {
	if (typeof rawConfig !== "object" || rawConfig === null) {
		throw new Error("Config not an object");
	}

	if (typeof rawConfig.db_url !== "string" || rawConfig.db_url.length === 0) {
		throw new Error("Config missing or invalid 'db_url'");
	}

	if ("current_user_name" in rawConfig && typeof rawConfig.current_user_name !== "string") {
		throw new Error("Config 'current_user_name' must be a string if present");
	}

	const allowedKeys = new Set(["db_url", "current_user_name"]);
	for (const key in rawConfig) {
		if (!allowedKeys.has(key)) {
			throw new Error(`Unexpected key in config: '${key}'`);
		}
	}

	const config: Config = {
		dbUrl: rawConfig.db_url,
		currentUserName: rawConfig.current_user_name,
	};

	return config;
}
