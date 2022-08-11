import type { EnvResolver } from "../interface";
import { ChannelError } from "../../errors";

export const env = ((key: string, required = true, defaultValue?: string): string | undefined => {
	const value = process.env[key] ?? defaultValue;
	if (required && typeof value === "undefined")
		throw new ChannelError(`Missing environment variable: ${key}`);
	return value;
}) as EnvResolver<string>;
