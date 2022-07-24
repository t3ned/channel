import type { EnvResolver } from "../interface";
import { ChannelError } from "../../../errors";
import { isUndefined } from "../../../utils";
import { env } from "./env";

const isValidInteger = (value: string) => Number(value) === parseInt(value);

export const envInteger = ((key: string, required = true, defaultValue?: number): number | undefined => {
	const value = env(key, required, `${defaultValue}`);
	if (isUndefined(value)) return 0;
	if (!isValidInteger(value)) throw new ChannelError(`Invalid integer environment variable: ${key}`);
	return parseInt(value);
}) as EnvResolver<number>;
