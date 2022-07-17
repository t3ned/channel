import type { Express } from "express";
import { BaseApplicationLoader } from "../../base";

export class ApplicationLoader extends BaseApplicationLoader<Express> {
	/**
	 * Bind the route to the router
	 * @param route The route to bind
	 */
	protected async bindRoute(route: unknown): Promise<void> {
		void route;
	}
}
