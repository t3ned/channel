import type { EnvResolver } from "../interface";
import { ChannelError } from "../../errors";
import { isUndefined } from "../../utils";
import { env } from "./env";

const isValidNumber = (value: string) => !isNaN(Number(value));

export const envNumber = ((key: string, required = true, defaultValue?: number): number | undefined => {
	const value = env(key, required, `${defaultValue}`);
	if (isUndefined(value)) return 0;
	if (!isValidNumber(value)) throw new ChannelError(`Invalid number environment variable: ${key}`);
	return Number(value);
}) as EnvResolver<number>;
