import type { FastifyInstance, HTTPMethods } from "fastify";
import type { Handler, Middleware } from "./RouteBuilder";
import { BaseRouteBuilder, BaseApplicationLoader } from "../base";
import { Application } from "./Application";
import { buildRoutePath } from "../utils";

export class ApplicationLoader extends BaseApplicationLoader<FastifyInstance> {
	/**
	 * Load a route file
	 * @param builders The routes
	 */
	public async loadRoute(builders: BaseRouteBuilder[]): Promise<void> {
		const versionedRoutes = builders.flatMap((builder) => {
			const versions = [...builder._versions];
			if (!versions.length) versions.push(Application.defaultVersionSlug);

			return versions.map((version) => ({
				method: builder.method,
				route: buildRoutePath(Application.routePrefix, version, builder.route),
				handler: builder._handler as Handler,
				preMiddleware: builder._preMiddleware as Middleware[],
				postMiddleware: builder._postMiddleware as Middleware[],
			}));
		});

		for (const { method, route, handler } of versionedRoutes) {
			// TODO: add middleware
			this.application.server.route({
				method: method.toUpperCase() as HTTPMethods,
				url: route,
				handler,
			});
		}
	}
}
