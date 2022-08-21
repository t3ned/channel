import type { EnvResolver } from "../interface";
import { MissingEnvVariableError, InvalidEnvVariableError } from "../../api/errors";

export const envNumber = ((key: string, required = true, defaultValue?: number): number | undefined => {
	const value = process.env[key] ?? defaultValue;

	if (required && typeof value === "undefined") {
		throw new MissingEnvVariableError(key);
	}

	if (typeof value === "undefined") {
		return undefined;
	}

	if (isNaN(Number(value))) {
		throw new InvalidEnvVariableError(key, "number");
	}

	return Number(value);
}) as EnvResolver<number>;
