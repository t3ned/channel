import type { ApiPathResolver } from "../base/Application";
import { dirnamePathResolver } from "./dirnamePathResolver";
import { cwdPathResolver } from "./cwdPathResolver";

/**
 * Resolve an api path
 * @param path The path to resolve
 *
 * @returns The resolved path
 */
export const apiPathResolver = (path: string, resolver: ApiPathResolver): string => {
	switch (resolver) {
		case "dirname":
			return dirnamePathResolver(path);
		case "cwd":
			return cwdPathResolver(path);
		default:
			throw new Error(`Unsupport api path resolver: ${resolver}`);
	}
};
