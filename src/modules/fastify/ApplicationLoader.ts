import type { FastifyInstance } from "fastify";
import { BaseApplicationLoader } from "../../base";

export class ApplicationLoader extends BaseApplicationLoader<FastifyInstance> {
	/**
	 * Bind the route to the router
	 * @param route The route to bind
	 */
	protected async bindRoute(route: unknown): Promise<void> {
		void route;
	}
}
