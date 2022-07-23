import { RouteBuilder } from "../struct/RouteBuilder";

/**
 * Check whether a value is a RouteBuilder
 * @param value The value to check
 *
 * @returns Whether the value is a RouteBuilder
 */
export const isRouteBuilder = (value: unknown): value is RouteBuilder => {
	return value instanceof RouteBuilder;
};
