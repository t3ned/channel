import cors, { FastifyCorsOptions } from "@fastify/cors";
import { arrayify, convertErrorToApiError } from "../../utils";
import { ApplicationLoader } from "./ApplicationLoader";
import { fastify, FastifyInstance } from "fastify";
import { HttpStatus } from "../../constants";
import { ApiError } from "../errors";
import { join } from "path";

export class Application {
	/**
	 * The fastify instance for the application to use
	 */
	public instance: FastifyInstance;

	/**
	 * The application loader for loading routes
	 */
	public loader: ApplicationLoader;

	/**
	 * The path to the directory routes are located
	 */
	public routeDirPath: string | null;

	/**
	 * The prefix for a route path
	 */
	public routePathPrefix?: string;

	/**
	 * The prefix to use in file names to ignore in route paths
	 */
	public routeFileIgnorePrefix: string;

	/**
	 * The default route version prefix
	 */
	public routeDefaultVersionPrefix: string | null;

	/**
	 * The default route version number
	 */
	public routeDefaultVersionNumber: number | null;

	/**
	 * Whether to enable debug logs
	 */
	public debug: boolean;

	/**
	 * @param options The application options
	 */
	public constructor(options: Application.Options = {}) {
		this.instance = options.instance ?? fastify();
		this.instance.register(cors, options.cors);

		this.loader = options.loader ?? new ApplicationLoader(this);
		this.routeDirPath = options.routeDirPath ? join(...arrayify(options.routeDirPath)) : null;
		this.routePathPrefix = options.routePathPrefix;
		this.routeFileIgnorePrefix = options.routeFileIgnorePrefix ?? "_";
		this.routeDefaultVersionPrefix = options.routeDefaultVersionPrefix ?? null;
		this.routeDefaultVersionNumber = options.routeDefaultVersionNumber ?? null;
		this.debug = options.debug ?? false;

		if (options.useDefaultErrorHandler ?? true) {
			this.instance.setErrorHandler(async (error, _req, reply) => {
				const apiError = convertErrorToApiError(error);
				const apiErrorResponse = {
					...apiError.toJSON(),
					trace: this.debug ? apiError.trace : undefined,
				};

				// TODO: logger

				return reply.status(apiError.status).send(apiErrorResponse);
			});
		}

		if (options.useDefaultNotFoundHandler ?? true) {
			this.instance.setNotFoundHandler(async (req) => {
				throw new ApiError()
					.setCode(0)
					.setStatus(HttpStatus.NotFound)
					.setMessage(`Route \`${req.url}\` not found`);
			});
		}
	}

	/**
	 * The default route version
	 */
	public get routeDefaultVersion(): string {
		return `${this.routeDefaultVersionPrefix ?? ""}${this.routeDefaultVersionNumber ?? ""}`;
	}

	/**
	 * Listen for connections
	 * @param host The host to bind
	 * @param port The port to bind
	 *
	 * @returns The application
	 */
	public async listen(host: string, port: number): Promise<this> {
		await this.loader.loadRoutes();
		await this.instance.listen({ port, host });

		return this;
	}
}

export namespace Application {
	export interface Options {
		/**
		 * The fastify instance for the application to use
		 */
		instance?: FastifyInstance;

		/**
		 * The application loader for loading routes
		 */
		loader?: ApplicationLoader;

		/**
		 * The path to the directory routes are located
		 */
		routeDirPath?: string[] | string;

		/**
		 * The prefix for a route path
		 */
		routePathPrefix?: string;

		/**
		 * The prefix to use in file names to ignore in route paths
		 */
		routeFileIgnorePrefix?: string;

		/**
		 * The default route version prefix
		 */
		routeDefaultVersionPrefix?: string;

		/**
		 * The default route version number
		 */
		routeDefaultVersionNumber?: number;

		/**
		 * Whether to set the default error handler
		 */
		useDefaultErrorHandler?: boolean;

		/**
		 * Whether to set the default not found handler
		 */
		useDefaultNotFoundHandler?: boolean;

		/**
		 * Whether to enable debug logs
		 */
		debug?: boolean;

		/**
		 * Cors options
		 */
		cors?: FastifyCorsOptions;
	}
}
