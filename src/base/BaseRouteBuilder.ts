export abstract class BaseRouteBuilder {
	/**
	 * The version slugs for the route
	 */
	public versionSlugs: string[] = [];

	/**
	 * The middleware executed before the handler
	 */
	public abstract preMiddlewares: unknown[];

	/**
	 * The middleware executed after the handler
	 */
	public abstract postMiddlewares: unknown[];

	/**
	 * @param route The route path
	 */
	public constructor(public route: RoutePath) {}

	/**
	 * Add a supported version to the route
	 * @param version The version
	 * @param prefix The version prefix
	 *
	 * @returns The route builder
	 */
	public version(version: number, prefix?: string): this {
		// TODO: use default prefix
		this.versionSlugs.push(`${prefix}${version}`);

		return this;
	}

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
}

export type RoutePath = `/${string}`;
