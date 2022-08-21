import type { FastifyReply, FastifyRequest } from "fastify";
import type { Application } from "./Application";
import { joinRoutePaths, validate } from "../../utils";
import { ChannelError } from "../errors";
import { HttpStatus } from "../../constants";
import { basename, extname } from "path";
import { readdir } from "fs/promises";
import { Route } from "./Route";

export class ApplicationLoader {
	/**
	 * @param application The application
	 */
	public constructor(public application: Application) {}

	/**
	 * Load all the routes
	 */
	public async loadRoutes(): Promise<void> {
		if (!this.application.routeDirPath) return;

		for await (const path of this._recursiveReaddir(this.application.routeDirPath)) {
			const mod = await import(path).catch(() => ({}));

			const fileExtension = extname(path);
			const fileName = basename(path, fileExtension);

			const sliceLength = fileName.startsWith(this.application.routeFileIgnorePrefix)
				? fileName.length + 1 // add one to remove trailing slash
				: fileExtension.length;

			const routePath = path.slice(this.application.routeDirPath.length, -sliceLength);

			for (const route of Object.values(mod)) {
				if (route instanceof Route) {
					route.path = joinRoutePaths(routePath, route.path);
					await this.loadRoute(route);
				}
			}
		}
	}

	/**
	 * Load a route
	 * @param route The routes
	 */
	public async loadRoute(route: Route.Any): Promise<void> {
		const versionedRoutes = route.toVersionedRoutes(this.application);

		for (const route of versionedRoutes) {
			const handler = async (req: FastifyRequest, reply: FastifyReply) => {
				const validated = validate(req, {
					params: route.paramsSchema,
					query: route.querySchema,
					body: route.bodySchema,
				});

				if (validated.success) {
					const parsed = validated.data as Route.AnyParsedData;
					const result = await route.handler({ req, reply, parsed });
					if (result) return reply.status(route.httpStatus).send(result);
					return result;
				}

				return reply
					.status(HttpStatus.BadRequest)
					.send(this.application.validationErrorMapper(validated.error));
			};

			this.application.instance.route({
				method: route.method,
				url: joinRoutePaths(this.application.routePathPrefix, route.path),
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
}
