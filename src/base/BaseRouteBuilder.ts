export abstract class BaseRouteBuilder {
	/**
	 * The version slugs for the route
	 */
	public abstract _versions: string[];

	/**
	 * The middleware executed before the handler
	 */
	public abstract _preMiddleware: unknown[];

	/**
	 * The middleware executed after the handler
	 */
	public abstract _postMiddleware: unknown[];

	/**
	 * The route handler
	 */
	public abstract _handler: unknown;

	/**
	 * @param route The route path
	 * @param method The route method
	 */
	public constructor(public route: RoutePath, public method: RouteMethod) {}

	/**
	 * Add a supported version to the route
	 * @param version The version
	 * @param prefix The version prefix
	 *
	 * @returns The route builder
	 */
	public abstract version(version: number, prefix?: string): this;

	/**
	 * Add a middleware before the handler
	 * @param middleware The middleware to add
	 *
	 * @returns the route builder
	 */
	public abstract preMiddleware(...middleware: unknown[]): this;

	/**
	 * Add a middleware before the handler
	 * @param middleware The middleware to add
	 *
	 * @returns the route builder
	 */
	public abstract postMiddleware(...middleware: unknown[]): this;

	/**
	 * Add a middleware in the default order
	 * @param middleware The middleware to add
	 *
	 * @returns the route builder
	 */
	public abstract middleware(...middleware: unknown[]): this;

	/**
	 * Set the handler for the route
	 * @param handler The route handler
	 *
	 * @returns The route builder
	 */
	public abstract handler(handler: unknown): this;
}

export type RoutePath = `/${string}`;
export type RouteMethod = "get" | "post" | "patch" | "put" | "delete";
