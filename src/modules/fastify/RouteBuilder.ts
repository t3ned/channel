import type { FastifyInstance, FastifyRegisterOptions } from "fastify";
import { BaseRouteBuilder, RoutePath } from "../../base";
import { Application } from "./Application";

export class RouteBuilder extends BaseRouteBuilder {
	/**
	 * The version slugs for the route
	 */
	public versionSlugs: string[] = [];

	/**
	 * The middleware executed before the handler
	 */
	public preMiddlewares: Middleware[] = [];

	/**
	 * The middleware executed after the handler
	 */
	public postMiddlewares: Middleware[] = [];

	/**
	 * Add a supported version to the route
	 * @param version The version
	 * @param prefix The version prefix
	 *
	 * @returns The route builder
	 */
	public version(version: number, prefix = Application.defaultVersionPrefix): this {
		this.versionSlugs.push(`${prefix ?? ""}${version}`);

		return this;
	}

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

	/**
	 * Add a middleware in the default order
	 * @param middleware The middleware to add
	 *
	 * @returns the route builder
	 */
	public middleware(...middleware: Middleware[]): this {
		if (Application.defaultMiddlewareOrder === "post") {
			this.postMiddlewares.push(...middleware);
			return this;
		}

		this.preMiddlewares.push(...middleware);

		return this;
	}
}

export const Get = (route: RoutePath) => new RouteBuilder(route, "get");
export const Post = (route: RoutePath) => new RouteBuilder(route, "post");
export const Patch = (route: RoutePath) => new RouteBuilder(route, "patch");
export const Put = (route: RoutePath) => new RouteBuilder(route, "put");
export const Delete = (route: RoutePath) => new RouteBuilder(route, "delete");

export type Middleware = (
	instance: FastifyInstance,
	opts: FastifyRegisterOptions<unknown>,
	done: (error?: Error) => void,
) => void;
