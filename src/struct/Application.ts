import type { FastifyInstance } from "fastify";
import type { Route } from "./Route";
import { ApplicationLoader } from "./ApplicationLoader";
import { convertErrorToApiError } from "../utils";
import { HttpStatus } from "../constants";
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
	 * Whether the application is a development instance
	 */
	public isDevelopment = true;

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
	public static routePrefix: Route.Path = "/api";

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

		server.setErrorHandler(async (error, _req, reply) => {
			const apiError = convertErrorToApiError(error);
			const apiErrorResponse = {
				...apiError.toJSON(),
				stack:
					this.isDevelopment && apiError.status === HttpStatus.InternalServerError
						? apiError.stack
						: undefined,
			};

			return reply.status(apiError.status).send(apiErrorResponse);
		});
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
		this.loader.loadEnv();

		return this;
	}

	/**
	 * The NODE_ENV or APP_ENV development environment identifier
	 * @param identifier The env identifier
	 *
	 * @returns The application
	 */
	public setDevelopmentEnvName(identifier: string): this {
		this.isDevelopment = [process.env.NODE_ENV, process.env.APP_ENV].includes(identifier);

		return this;
	}

	/**
	 * Set the route prefix
	 * @param routePrefix The route prefix
	 *
	 * @returns The application
	 */
	public setRoutePrefix(routePrefix: Route.Path): this {
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

export namespace Application {
	export type Context<T> = ObjectContext<T> | T;
	export type ObjectContext<T> = { [k: string]: T };
}
