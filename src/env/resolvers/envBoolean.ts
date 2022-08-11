import type { EnvResolver } from "../interface";
import { ChannelError } from "../../errors";
import { isUndefined } from "../../utils";
import { env } from "./env";

const truthy = ["true", "1"];
const falsey = ["false", "0"];

const isValidBoolean = (value: string) => [...truthy, ...falsey].includes(value);

export const envBoolean = ((key: string, required = true, defaultValue?: boolean): boolean | undefined => {
	const value = env(key, required, `${defaultValue}`);
	if (isUndefined(value)) return undefined;
	if (!isValidBoolean(value)) throw new ChannelError(`Invalid boolean environment variable: ${key}`);
	return truthy.includes(value);
}) as EnvResolver<boolean>;
