import type { RoutePath } from "../struct/RouteBuilder";

/**
 * Build a route path
 * @param parts The route parts to join
 *
 * @returns The route path
 */
export const buildRoutePath = (...parts: (string | undefined)[]): RoutePath => {
	let path = parts.reduce((routePath, part) => {
		if (!part) return routePath;
		if (!part.startsWith("/")) part = `/${part}`;
		return `${routePath}${part}`;
	}, "") as string;

	if (path.endsWith("/")) path = path.slice(0, -1);
	return path as RoutePath;
};
