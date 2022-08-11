import type { Route } from "../..";

/**
 * Join multiple route paths
 * @param paths The paths to join
 *
 * @returns The route path
 */
export const joinRoutePaths = (...paths: (string | undefined)[]): Route.Path => {
	const path = paths.reduce<string>((routePath, part) => {
		if (!part) return routePath;
		if (!part.startsWith("/")) part = `/${part}`;

		return `${routePath}${part}`;
	}, "");

	return (path.endsWith("/") ? path.slice(0, -1) : path) as Route.Path;
};
