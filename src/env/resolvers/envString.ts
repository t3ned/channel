import type { EnvResolver } from "../interface";
import { MissingEnvVariableError } from "../../errors";

export const envString = ((key: string, required = true, defaultValue?: string): string | undefined => {
	const value = process.env[key] ?? defaultValue;

	if (required && typeof value === "undefined") {
		throw new MissingEnvVariableError(key);
	}

	if (typeof value === "undefined") {
		return undefined;
	}

	return value;
}) as EnvResolver<string>;
