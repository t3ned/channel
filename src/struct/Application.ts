import type { FastifyInstance } from "fastify";
import type { RouteBuilder } from "./RouteBuilder";

import { ApplicationLoader } from "./ApplicationLoader";
import { Class, isClass } from "../utils";
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
	 * The path to the env file
	 */
	public envFilePath?: string;

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
	public static routePrefix: RouteBuilder.RoutePath = "/api";

	/**
	 * The default route version
	 */
	public static defaultVersion = 1;

	/**
	 * The default route version
	 */
	public static defaultVersionPrefix = "v";

	/**
	 * The contexts to pass to route handlers
	 */
	public contexts: Application.ObjectContext<unknown> = {};

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
	 *
	 * @returns The application
	 */
	public setRouteDirPath(...path: string[]): this {
		this.routeDirPath = join(...path);

		return this;
	}

	/**
	 * Set the env file path
	 * @param path The env file path
	 *
	 * @returns The application
	 */
	public setEnvFilePath(...path: string[]): this {
		this.envFilePath = join(...path);

		return this;
	}

	/**
	 * Set the route prefix
	 * @param routePrefix The route prefix
	 *
	 * @returns The application
	 */
	public setRoutePrefix(routePrefix: RouteBuilder.RoutePath): this {
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
	 * Add a context
	 * @param contextName The name of the context
	 * @param context The context
	 *
	 * @returns The application
	 */
	public addContext<T>(contextName: string, context: Application.Context<T>): this {
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
	public addClassContext<T>(contextName: string, context: Application.ClassContext<T>): this {
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

		await this.loader.loadEnv();
		await this.loader.loadRoutes();
		await this.server.listen({ port, host });

		return this;
	}
}

export namespace Application {
	export type Context<T> = ObjectContext<T> | T;
	export type ClassContext<T> = ObjectContext<Class<T>> | Class<T>;
	export type ObjectContext<T> = { [k: string]: T };
}
