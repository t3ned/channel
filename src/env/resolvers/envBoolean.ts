import type { EnvResolver } from "..";
import { MissingEnvVariableError, InvalidEnvVariableError } from "../../api/errors";

const truthy: unknown[] = [true, "true", 1, "1"];
const falsey: unknown[] = [false, "false", 0, "0"];

const validBooleans: unknown[] = [...truthy, ...falsey];

export const envBoolean = ((key: string, required = true, defaultValue?: boolean): boolean | undefined => {
	const value = process.env[key] ?? defaultValue;

	if (required && typeof value === "undefined") {
		throw new MissingEnvVariableError(key);
	}

	if (typeof value === "undefined") {
		return undefined;
	}

	if (!validBooleans.includes(value)) {
		throw new InvalidEnvVariableError(key, "boolean");
	}

	return truthy.includes(value);
}) as EnvResolver<boolean>;
