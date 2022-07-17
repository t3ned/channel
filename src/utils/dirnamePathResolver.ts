import { join } from "path";

/**
 * Resolve a path from the dirname
 * @param path The path to resolve
 *
 * @returns The resolved path
 */
export const dirnamePathResolver = (path: string): string => {
	return join(__dirname, path);
};
