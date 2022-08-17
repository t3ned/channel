import type { EnvResolver } from "../interface";
import { MissingEnvVariableError, InvalidEnvVariableError } from "../../errors";

export const envInteger = ((key: string, required = true, defaultValue?: number): number | undefined => {
	const value = process.env[key] ?? defaultValue;

	if (required && typeof value === "undefined") {
		throw new MissingEnvVariableError(key);
	}

	if (typeof value === "undefined") {
		return undefined;
	}

	if (Math.floor(Number(value)) !== Number(value)) {
		throw new InvalidEnvVariableError(key, "integer");
	}

	return Number(value);
}) as EnvResolver<number>;
