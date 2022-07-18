import type { RoutePath } from "../base";

/**
 * Build a route path
 * @param parts The route parts to join
 *
 * @returns The route path
 */
export const buildRoutePath = (...parts: (string | undefined)[]): RoutePath => {
	return parts.reduce((routePath, part) => {
		if (!part) return routePath;
		if (!part.startsWith("/")) part = `/${part}`;

		return `${routePath}${part}`;
	}, "") as RoutePath;
};
