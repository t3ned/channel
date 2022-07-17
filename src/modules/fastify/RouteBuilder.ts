import type { FastifyInstance, FastifyRegisterOptions } from "fastify";
import { BaseRouteBuilder } from "../../base";

export class RouteBuilder extends BaseRouteBuilder {
	/**
	 * The middleware executed before the handler
	 */
	public preMiddlewares: Middleware[] = [];

	/**
	 * The middleware executed after the handler
	 */
	public postMiddlewares: Middleware[] = [];

	/**
	 * Add a middleware before the handler
	 * @param middleware The middleware to add
	 *
	 * @returns the route builder
	 */
	public preMiddleware(...middleware: Middleware[]): this {
		this.preMiddlewares.push(...middleware);

		return this;
	}

	/**
	 * Add a middleware after the handler
	 * @param middleware The middleware to add
	 *
	 * @returns the route builder
	 */
	public postMiddleware(...middleware: Middleware[]): this {
		this.postMiddlewares.push(...middleware);

		return this;
	}
}

export type Middleware = (
	instance: FastifyInstance,
	opts: FastifyRegisterOptions<unknown>,
	done: (error?: Error) => void,
) => void;
