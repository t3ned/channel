import type { EnvResolver } from "../interface";
import { ChannelError } from "../../../errors";
import { isUndefined } from "../../../utils";

export const env = ((key: string, required = true, defaultValue?: string): string | undefined => {
	const value = process.env[key] ?? defaultValue;
	if (required && isUndefined(value)) throw new ChannelError(`Missing environment variable: ${key}`);
	return value;
}) as EnvResolver<string>;
