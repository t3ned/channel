import type { RouteHandlerMethod } from "fastify";
import { Application } from "./Application";

export class RouteBuilder {
	/**
	 * The version slugs for the route
	 */
	public _versions: string[] = [];

	/**
	 * The middleware executed before the handler
	 */
	public _preMiddleware: Middleware[] = [];

	/**
	 * The middleware executed after the handler
	 */
	public _postMiddleware: Middleware[] = [];

	/**
	 * The route handler
	 */
	public _handler: Handler = () => {
		throw new Error("Handler not implemented");
	};

	/**
	 * @param route The route path
	 * @param method The route method
	 */
	public constructor(public route: RoutePath, public method: RouteMethod) {}

	/**
	 * Add a supported version to the route
	 * @param version The version
	 * @param prefix The version prefix
	 *
	 * @returns The route builder
	 */
	public version(version: number, prefix = Application.defaultVersionPrefix): this {
		this._versions.push(`${prefix ?? ""}${version}`);

		return this;
	}

	/**
	 * Add a middleware before the handler
	 * @param middleware The middleware to add
	 *
	 * @returns the route builder
	 */
	public preMiddleware(...middleware: Middleware[]): this {
		this._preMiddleware.push(...middleware);

		return this;
	}

	/**
	 * Add a middleware after the handler
	 * @param middleware The middleware to add
	 *
	 * @returns the route builder
	 */
	public postMiddleware(...middleware: Middleware[]): this {
		this._postMiddleware.push(...middleware);

		return this;
	}

	/**
	 * Add a middleware in the default order
	 * @param middleware The middleware to add
	 *
	 * @returns the route builder
	 */
	public middleware(...middleware: Middleware[]): this {
		if (Application.defaultMiddlewareOrder === "pre") {
			this._preMiddleware.push(...middleware);
			return this;
		}

		this._postMiddleware.push(...middleware);

		return this;
	}

	/**
	 * Set the handler for the route
	 * @param handler The route handler
	 *
	 * @returns The route builder
	 */
	public handler(handler: Handler): this {
		this._handler = handler;

		return this;
	}
}

export const Get = (route: RoutePath) => new RouteBuilder(route, "get");
export const Post = (route: RoutePath) => new RouteBuilder(route, "post");
export const Patch = (route: RoutePath) => new RouteBuilder(route, "patch");
export const Put = (route: RoutePath) => new RouteBuilder(route, "put");
export const Delete = (route: RoutePath) => new RouteBuilder(route, "delete");

export type Middleware = RouteHandlerMethod;
export type Handler = RouteHandlerMethod;
export type RoutePath = `/${string}`;
export type RouteMethod = "get" | "post" | "patch" | "put" | "delete";
