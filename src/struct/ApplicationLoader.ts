import type { RouteBuilder } from "./RouteBuilder";
import { Application } from "./Application";
import { buildRoutePath, isRouteBuilder } from "../utils";
import { readdir } from "fs/promises";
import { extname } from "path";

export class ApplicationLoader {
	/**
	 * @param application The API application
	 */
	public constructor(public application: Application) {}

	/**
	 * Load all the routes
	 */
	public async loadRoutes() {
		for await (const path of this._recursiveReaddir(this._apiPath)) {
			const mod = await import(path).catch(() => ({}));
			const routePath = path.slice(this._apiPath.length, -extname(path).length);
			const routes = Object.values(mod).filter((route) => isRouteBuilder(route)) as RouteBuilder[];

			if (routes.length)
				await this.loadRoute(
					routes.map((route) => {
						route.path = buildRoutePath(routePath, route.path);
						return route;
					}),
				);
		}
	}

	/**
	 * Load a route file
	 * @param builders The routes
	 */
	public async loadRoute(builders: RouteBuilder[]): Promise<void> {
		const versionedRoutes = builders.flatMap((builder) => {
			const versions = [...builder.versions];
			if (!versions.length) versions.push(Application.defaultVersionSlug);

			return versions.map((version) => ({
				method: builder.method,
				path: buildRoutePath(Application.routePrefix, version, builder.path),
				handler: builder._handler,
				onRequest: builder.onRequestHook,
				preParsing: builder.preParsingHook,
				preValidation: builder.preValidationHook,
				preHandler: builder.preHandlerHook,
				preSerialization: builder.preSerializationHook,
				onSend: builder.onSendHook,
				onResponse: builder.onResponseHook,
				onTimeout: builder.onTimeoutHook,
				onError: builder.onErrorHook,
			}));
		});

		for (const route of versionedRoutes) {
			this.application.server.route({
				method: route.method,
				url: route.path,
				handler: route.handler,
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
		for (const file of await readdir(path, { withFileTypes: true })) {
			if (file.isDirectory()) yield* this._recursiveReaddir(`${path}/${file.name}`);
			else yield `${path}/${file.name}`;
		}
	}

	/**
	 * Get the API route path
	 */
	private get _apiPath(): string {
		if (this.application.routeDirPath) return this.application.routeDirPath;
		throw new Error("API route directory path not provided");
	}
}
