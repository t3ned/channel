import { BaseRouteBuilder } from "../base";

/**
 * Check whether a value is a route
 * @param value The value to check
 *
 * @returns Whether the value is a route
 */
export const isRoute = (value: unknown): value is BaseRouteBuilder => {
	return value instanceof BaseRouteBuilder;
};
