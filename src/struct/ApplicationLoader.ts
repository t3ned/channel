import type { FastifyReply, FastifyRequest } from "fastify";
import type { Application } from "./Application";
import type { Route } from "./Route";
import { joinRoutePaths, isRoute, validate } from "../utils";
import { ChannelError } from "../errors";
import { HttpStatus } from "../constants";
import { readdir, readFile } from "fs/promises";
import { extname } from "path";

export class ApplicationLoader {
	/**
	 * @param application The API application
	 */
	public constructor(public application: Application) {}

	/**
	 * Load all the routes
	 */
	public async loadRoutes(): Promise<void> {
		for await (const path of this._recursiveReaddir(this._apiPath)) {
			const mod = await import(path).catch(() => ({}));
			const routePath = path.slice(this._apiPath.length, -extname(path).length);
			const routes = Object.values(mod).filter((route) => isRoute(route)) as Route.Any[];

			if (routes.length)
				await this.loadRoute(
					routes.map((route) => {
						route.path = joinRoutePaths(routePath, route.path);
						return route;
					}),
				);
		}
	}

	/**
	 * Load a route file
	 * @param routes The routes
	 */
	public async loadRoute(routes: Route.Any[]): Promise<void> {
		const versionedRoutes = routes.flatMap((route) => route.toVersionedRoutes());

		for (const route of versionedRoutes) {
			const handler = async (req: FastifyRequest, reply: FastifyReply) => {
				const validated = validate(req, {
					params: route.paramsSchema,
					query: route.querySchema,
					body: route.bodySchema,
				});

				if (validated.success) {
					const parsed = validated.data as Route.AnyParsedData;
					const result = await route.handler({ req, reply, parsed, ...this.application.contexts });
					if (result) return reply.status(route.httpStatus).send(result);
					return result;
				}

				return reply.status(HttpStatus.BadRequest).send(validated.error.format());
			};

			this.application.server.route({
				method: route.method,
				url: route.path,
				handler,
				onRequest: route.onRequest,
				preParsing: route.preParsing,
				preValidation: route.preValidation,
				preHandler: route.preHandler,
				preSerialization: route.preSerialization,
				onSend: route.onSend,
				onResponse: route.onResponse,
				onTimeout: route.onTimeout,
				onError: route.onError,
			});
		}
	}

	/**
	 * Load the env file
	 */
	public async loadEnv(): Promise<void> {
		if (!this.application.envFilePath) return;

		const mod = await readFile(this.application.envFilePath, "utf-8").catch(() => "");
		const lines = mod.split("\n");

		for (const line of lines) {
			const [key, value] = line.split(/=(.*)/s).map((part) => part.trim());
			if (!key || key.startsWith("#") || typeof value !== "string") continue;

			Reflect.defineProperty(process.env, key, { value });
		}
	}

	/**
	 * Recursively read all the file paths in a given path
	 * @param path The path to read
	 *
	 * @returns Path iterator
	 */
	private async *_recursiveReaddir(path: string): AsyncIterableIterator<string> {
		const dir = await readdir(path, { withFileTypes: true }).catch((error) => {
			throw new ChannelError("API route directory error", { cause: error });
		});

		for (const file of dir) {
			if (file.isDirectory()) yield* this._recursiveReaddir(`${path}/${file.name}`);
			else yield `${path}/${file.name}`;
		}
	}

	/**
	 * Get the API route path
	 */
	private get _apiPath(): string {
		if (this.application.routeDirPath) return this.application.routeDirPath;
		throw new ChannelError("API route directory path not provided");
	}
}
