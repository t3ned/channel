import type { Express } from "express";
import type { Middleware } from "./RouteBuilder";
import { BaseRouteBuilder, BaseApplicationLoader } from "../../base";
import { Application } from "./Application";
import { buildRoutePath } from "../../utils";

export class ApplicationLoader extends BaseApplicationLoader<Express> {
	/**
	 * Load a route file
	 * @param builders The routes
	 */
	public async loadRoute(builders: BaseRouteBuilder[]): Promise<void> {
		const versionedRoutes = builders.flatMap((builder) => {
			const versions = [...builder.versionSlugs];
			if (!versions.length) versions.push(Application.defaultVersionSlug);

			return versions.map((version) => ({
				method: builder.method,
				route: buildRoutePath(Application.routePrefix, version, builder.route),
				preMiddlewares: builder.preMiddlewares as Middleware[],
				postMiddlewares: builder.postMiddlewares as Middleware[],
			}));
		});

		for (const { method, route, preMiddlewares, postMiddlewares } of versionedRoutes) {
			console.log(method, route, preMiddlewares, postMiddlewares);
		}
	}
}
