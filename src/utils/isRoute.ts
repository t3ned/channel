import { Route } from "../lib";

/**
 * Check whether a value is a Route
 * @param value The value to check
 *
 * @returns Whether the value is a Route
 */
export const isRoute = (value: unknown): value is Route.Any => {
	return value instanceof Route;
};
