import type { BaseRouteBuilder } from "../base";
import { RouteBuilder as ExpressRouterBuilder } from "../express";
import { RouteBuilder as FastifyRouterBuilder } from "../fastify";

/**
 * Check whether a value is a route
 * @param value The value to check
 *
 * @returns Whether the value is a route
 */
export const isRoute = (value: unknown): value is BaseRouteBuilder => {
	return value instanceof ExpressRouterBuilder || value instanceof FastifyRouterBuilder;
};
