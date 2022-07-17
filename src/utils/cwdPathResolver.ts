import { join } from "path";

/**
 * Resolve a path from the cwd
 * @param path The path to resolve
 *
 * @returns The resolved path
 */
export const cwdPathResolver = (path: string): string => {
	return join(process.cwd(), path);
};
