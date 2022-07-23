import type { FastifyInstance } from "fastify";
import type { RoutePath } from "./RouteBuilder";

import { ApplicationLoader } from "./ApplicationLoader";
import { isClass } from "../utils";
import { join } from "path";

export class Application {
	/**
	 * The fastify server
	 */
	public server!: FastifyInstance;

	/**
	 * The application file loader
	 */
	public loader: ApplicationLoader = new ApplicationLoader(this);

	/**
	 * The path to the API routes folder
	 */
	public routeDirPath?: string;

	/**
	 * The host to bind
	 */
	public host?: string;

	/**
	 * The port to bind
	 */
	public port?: number;

	/**
	 * The route prefix
	 */
	public static routePrefix: RoutePath = "/api";

	/**
	 * The default route version
	 */
	public static defaultVersion = 1;

	/**
	 * The default route version
	 */
	public static defaultVersionPrefix = "v";

	/**
	 * The default middleware order
	 */
	public static defaultMiddlewareOrder: MiddlewareOrder = "pre";

	/**
	 * The contexts to pass to route handlers
	 */
	public contexts: ContextObj<unknown> = {};

	/**
	 * Create an instance of an fastify application
	 * @param server The fastify server
	 */
	public constructor(server: FastifyInstance) {
		Reflect.defineProperty(this, "server", { value: server, enumerable: false });
	}

	/**
	 * Set the path where the API routes are located
	 * @param path The API route path
	 */
	public setRouteDirPath(...path: string[]): this {
		this.routeDirPath = join(...path);

		return this;
	}

	/**
	 * Set the route prefix
	 * @param routePrefix The route prefix
	 *
	 * @returns The application
	 */
	public setRoutePrefix(routePrefix: RoutePath): this {
		Application.routePrefix = routePrefix;

		return this;
	}

	/**
	 * Set the default route version
	 * @param version The version number
	 *
	 * @returns The application
	 */
	public setDefaultVersion(version: number): this {
		Application.defaultVersion = version;

		return this;
	}

	/**
	 * Set the default route version prefix
	 * @param prefix The version prefix
	 *
	 * @returns The application
	 */
	public setDefaultVersionPrefix(prefix: string): this {
		Application.defaultVersionPrefix = prefix;

		return this;
	}

	/**
	 * Set the default middleware
	 * @param order The middleware order
	 *
	 * @returns The application
	 */
	public setDefaultMiddlewareOrder(order: MiddlewareOrder): this {
		Application.defaultMiddlewareOrder = order;

		return this;
	}

	/**
	 * Add a context
	 * @param contextName The name of the context
	 * @param context The context
	 *
	 * @returns The application
	 */
	public addContext<T>(contextName: string, context: Context<T>): this {
		this.contexts[contextName] = context;

		return this;
	}

	/**
	 * Add a class context - an instance of the classes will be created
	 * @param contextName The name of the context
	 * @param context The context
	 *
	 * @returns The application
	 */
	public addClassContext<T>(contextName: string, context: ContextClass<T>): this {
		if (isClass(context)) return this.addContext(contextName, new context());
		if (!this.contexts[contextName] || typeof this.contexts[contextName] !== "object")
			this.contexts[contextName] = {};

		for (const [key, value] of Object.entries(context).filter(isClass)) {
			(this.contexts[contextName] as object)[key] = new value();
		}

		return this;
	}

	/**
	 * The default version slug
	 */
	public static get defaultVersionSlug(): string {
		return `${Application.defaultVersionPrefix}${Application.defaultVersion}`;
	}

	/**
	 * Listen for connections
	 * @param port The port to bind
	 * @param host The host to bind
	 *
	 * @returns The application
	 */
	public async listen(port: number, host?: string): Promise<this> {
		this.port = port;
		this.host = host;

		await this.loader.loadRoutes();
		await this.server.listen({ port, host });

		return this;
	}
}

export type MiddlewareOrder = "pre" | "post";

export type ContextConstructor<T> = new () => T;
export type ContextObj<T> = { [k: string]: T };
export type Context<T> = ContextObj<T> | T;
export type ContextClass<T> = ContextObj<ContextConstructor<T>> | ContextConstructor<T>;
