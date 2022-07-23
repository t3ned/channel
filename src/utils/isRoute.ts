import { RouteBuilder } from "../struct/RouteBuilder";

/**
 * Check whether a value is a route
 * @param value The value to check
 *
 * @returns Whether the value is a route
 */
export const isRoute = (value: unknown): value is RouteBuilder => {
	return value instanceof RouteBuilder;
};
